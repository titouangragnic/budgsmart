import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { config } from '../config/environment';

const userRepository = AppDataSource.getRepository(User);

// Google OAuth client
const googleClient = new OAuth2Client(config.GOOGLE_CLIENT_ID);

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

  async verifyGoogleToken(token: string): Promise<{ user: Partial<User>; token: string }> {
    try {
      // Verify Google token
      const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: config.GOOGLE_CLIENT_ID,
      });
      
      const payload = ticket.getPayload();
      if (!payload) {
        throw new Error('Invalid Google token');
      }

      const { sub: googleId, email, given_name: firstName, family_name: lastName, picture } = payload;

      if (!email) {
        throw new Error('Email not provided by Google');
      }

      // Check if user exists
      let user = await userRepository.findOne({ where: { email } });

      if (!user) {
        // Create new user from Google data
        user = new User();
        user.email = email;
        user.firstName = firstName || '';
        user.lastName = lastName || '';
        user.googleId = googleId;
        user.picture = picture || '';
        // Set a random password (not used for Google auth)
        user.password = await bcrypt.hash(Math.random().toString(36), 12);
        
        user = await userRepository.save(user);
      } else {
        // Update user with Google ID if not set
        if (!user.googleId) {
          user.googleId = googleId;
          user.picture = picture || '';
          await userRepository.save(user);
        }
      }

      // Generate JWT token for our app
      const appToken = this.generateToken(user.id);

      return {
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          balance: user.balance,
          picture: user.picture
        },
        token: appToken
      };
    } catch (error) {
      console.error('Google token verification error:', error);
      throw new Error('Invalid Google token');
    }
  }

  private generateToken(userId: string): string {
    return jwt.sign({ userId }, config.JWT_SECRET, { expiresIn: '7d' });
  }

  verifyToken(token: string): { userId: string } {
    return jwt.verify(token, config.JWT_SECRET) as { userId: string };
  }
}
