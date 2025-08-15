import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { validate } from 'class-validator';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { AuthService } from '../services/AuthService';
import { config } from '../config/environment';

const userRepository = AppDataSource.getRepository(User);
const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, firstName, lastName, password } = req.body;
      const result = await authService.register({ email, firstName, lastName, password });
      
      res.status(201).json({
        message: 'User created successfully',
        ...result
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message || 'Registration failed' });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      
      res.json({
        message: 'Login successful',
        ...result
      });
    } catch (error: any) {
      res.status(401).json({ message: error.message || 'Login failed' });
    }
  }

  async googleAuth(req: Request, res: Response) {
    try {
      const { token } = req.body;
      
      if (!token) {
        return res.status(400).json({ message: 'Google token is required' });
      }

      const result = await authService.verifyGoogleToken(token);
      
      res.json({
        message: 'Google authentication successful',
        ...result
      });
    } catch (error: any) {
      console.error('Google auth error:', error);
      res.status(401).json({ message: error.message || 'Google authentication failed' });
    }
  }

  async getProfile(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const user = await userRepository.findOne({ where: { id: userId } });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        balance: user.balance
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
}
