import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

const userRepository = AppDataSource.getRepository(User);

export class AuthService {
  async register(userData: {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
  }): Promise<{ user: Partial<User>; token: string }> {
    const { email, firstName, lastName, password } = userData;

    // Check if user already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const user = new User();
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    user.password = await bcrypt.hash(password, 12);

    const savedUser = await userRepository.save(user);

    // Generate JWT token
    const token = this.generateToken(savedUser.id);

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        balance: savedUser.balance
      },
      token
    };
  }

  async login(email: string, password: string): Promise<{ user: Partial<User>; token: string }> {
    // Find user by email
    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        balance: user.balance
      },
      token
    };
  }

  async getUserById(userId: string): Promise<User | null> {
    return await userRepository.findOne({ where: { id: userId } });
  }

  private generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
  }

  verifyToken(token: string): { userId: string } {
    return jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
  }
}
