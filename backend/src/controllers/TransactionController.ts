import { Request, Response } from 'express';
import { validate } from 'class-validator';
import { AppDataSource } from '../config/database';
import { Transaction, TransactionType } from '../models/Transaction';
import { User } from '../models/User';

const transactionRepository = AppDataSource.getRepository(Transaction);
const userRepository = AppDataSource.getRepository(User);

export class TransactionController {
  async createTransaction(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { description, amount, type, category, date, notes } = req.body;

      // Find the user
      const user = await userRepository.findOne({ where: { id: userId } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Create new transaction
      const transaction = new Transaction();
      transaction.description = description;
      transaction.amount = amount;
      transaction.type = type;
      transaction.category = category;
      transaction.date = new Date(date);
      transaction.notes = notes;
      transaction.user = user;
      transaction.userId = userId;

      // Validate transaction data
      const errors = await validate(transaction);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      await transactionRepository.save(transaction);

      // Update user balance
      if (type === TransactionType.INCOME) {
        user.balance = Number(user.balance) + Number(amount);
      } else {
        user.balance = Number(user.balance) - Number(amount);
      }
      await userRepository.save(user);

      res.status(201).json({
        message: 'Transaction created successfully',
        transaction: {
          id: transaction.id,
          description: transaction.description,
          amount: transaction.amount,
          type: transaction.type,
          category: transaction.category,
          date: transaction.date,
          notes: transaction.notes
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async getTransactions(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { page = 1, limit = 10, type, category, startDate, endDate } = req.query;

      const queryBuilder = transactionRepository
        .createQueryBuilder('transaction')
        .where('transaction.userId = :userId', { userId })
        .orderBy('transaction.date', 'DESC');

      // Apply filters
      if (type) {
        queryBuilder.andWhere('transaction.type = :type', { type });
      }
      if (category) {
        queryBuilder.andWhere('transaction.category = :category', { category });
      }
      if (startDate) {
        queryBuilder.andWhere('transaction.date >= :startDate', { startDate });
      }
      if (endDate) {
        queryBuilder.andWhere('transaction.date <= :endDate', { endDate });
      }

      // Apply pagination
      const skip = (Number(page) - 1) * Number(limit);
      queryBuilder.skip(skip).take(Number(limit));

      const [transactions, total] = await queryBuilder.getManyAndCount();

      res.json({
        transactions,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async getTransaction(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;

      const transaction = await transactionRepository.findOne({
        where: { id, userId }
      });

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      res.json(transaction);
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async updateTransaction(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;
      const { description, amount, type, category, date, notes } = req.body;

      const transaction = await transactionRepository.findOne({
        where: { id, userId },
        relations: ['user']
      });

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      // Store old values for balance calculation
      const oldAmount = Number(transaction.amount);
      const oldType = transaction.type;

      // Update transaction fields
      if (description) transaction.description = description;
      if (amount) transaction.amount = amount;
      if (type) transaction.type = type;
      if (category) transaction.category = category;
      if (date) transaction.date = new Date(date);
      if (notes !== undefined) transaction.notes = notes;

      // Validate updated transaction data
      const errors = await validate(transaction);
      if (errors.length > 0) {
        return res.status(400).json({ errors });
      }

      await transactionRepository.save(transaction);

      // Update user balance
      const user = transaction.user;
      
      // Revert old transaction effect
      if (oldType === TransactionType.INCOME) {
        user.balance = Number(user.balance) - oldAmount;
      } else {
        user.balance = Number(user.balance) + oldAmount;
      }

      // Apply new transaction effect
      if (transaction.type === TransactionType.INCOME) {
        user.balance = Number(user.balance) + Number(transaction.amount);
      } else {
        user.balance = Number(user.balance) - Number(transaction.amount);
      }

      await userRepository.save(user);

      res.json({
        message: 'Transaction updated successfully',
        transaction
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async deleteTransaction(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { id } = req.params;

      const transaction = await transactionRepository.findOne({
        where: { id, userId },
        relations: ['user']
      });

      if (!transaction) {
        return res.status(404).json({ message: 'Transaction not found' });
      }

      // Update user balance
      const user = transaction.user;
      if (transaction.type === TransactionType.INCOME) {
        user.balance = Number(user.balance) - Number(transaction.amount);
      } else {
        user.balance = Number(user.balance) + Number(transaction.amount);
      }
      await userRepository.save(user);

      await transactionRepository.remove(transaction);

      res.json({ message: 'Transaction deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }

  async getTransactionStats(req: Request, res: Response) {
    try {
      const userId = (req as any).userId;
      const { period = 'month' } = req.query;

      let startDate: Date;
      const endDate = new Date();

      switch (period) {
        case 'week':
          startDate = new Date();
          startDate.setDate(startDate.getDate() - 7);
          break;
        case 'month':
          startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1);
          break;
        case 'year':
          startDate = new Date();
          startDate.setFullYear(startDate.getFullYear() - 1);
          break;
        default:
          startDate = new Date();
          startDate.setMonth(startDate.getMonth() - 1);
      }

      const transactions = await transactionRepository.find({
        where: {
          userId,
        },
        order: { date: 'DESC' }
      });

      const filteredTransactions = transactions.filter(
        t => new Date(t.date) >= startDate && new Date(t.date) <= endDate
      );

      const income = filteredTransactions
        .filter(t => t.type === TransactionType.INCOME)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expenses = filteredTransactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((sum, t) => sum + Number(t.amount), 0);

      // Group by category
      const expensesByCategory = filteredTransactions
        .filter(t => t.type === TransactionType.EXPENSE)
        .reduce((acc, t) => {
          acc[t.category] = (acc[t.category] || 0) + Number(t.amount);
          return acc;
        }, {} as Record<string, number>);

      res.json({
        period,
        startDate,
        endDate,
        totalIncome: income,
        totalExpenses: expenses,
        netAmount: income - expenses,
        transactionCount: filteredTransactions.length,
        expensesByCategory
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
  }
}
