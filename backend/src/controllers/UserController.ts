import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

const userRepository = AppDataSource.getRepository(User);

export class UserController {
  async getUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userRepository.findOne({ 
        where: { id },
        relations: ['transactions']
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        balance: user.balance,
        transactionCount: user.transactions.length
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { firstName, lastName, email } = req.body;

      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Update user fields
      if (firstName) user.firstName = firstName;
      if (lastName) user.lastName = lastName;
      if (email) user.email = email;

      // Validate updated user data
      const errors = await validate(user);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      await userRepository.save(user);

      res.json({
        message: 'User updated successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          balance: user.balance
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await userRepository.remove(user);

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async getUserStats(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;

      const user = await userRepository.findOne({ 
        where: { id: userId },
        relations: ['transactions']
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const totalTransactions = user.transactions.length;
      const totalIncome = user.transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const totalExpenses = user.transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + Number(t.amount), 0);

      res.json({
        totalTransactions,
        totalIncome,
        totalExpenses,
        currentBalance: user.balance,
        netIncome: totalIncome - totalExpenses
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
}
