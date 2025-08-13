import { Repository } from 'typeorm';
import { AppDataSource } from '../config/database';
import { Transaction, TransactionType } from '../models/Transaction';
import { User } from '../models/User';
import { TransactionFilters, PaginationParams, TransactionStats } from '../types';
import { DateHelper } from '../utils/helpers';

const transactionRepository = AppDataSource.getRepository(Transaction);
const userRepository = AppDataSource.getRepository(User);

export class TransactionService {
  async createTransaction(userId: string, transactionData: {
    description: string;
    amount: number;
    type: TransactionType;
    category: string;
    date: string;
    notes?: string;
  }): Promise<Transaction> {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    const transaction = new Transaction();
    transaction.description = transactionData.description;
    transaction.amount = transactionData.amount;
    transaction.type = transactionData.type;
    transaction.category = transactionData.category as any;
    transaction.date = new Date(transactionData.date);
    transaction.notes = transactionData.notes;
    transaction.user = user;
    transaction.userId = userId;

    const savedTransaction = await transactionRepository.save(transaction);

    // Update user balance
    await this.updateUserBalance(user, transactionData.amount, transactionData.type);

    return savedTransaction;
  }

  async getTransactions(
    userId: string,
    filters: TransactionFilters,
    pagination: PaginationParams
  ): Promise<{ transactions: Transaction[]; total: number }> {
    const queryBuilder = transactionRepository
      .createQueryBuilder('transaction')
      .where('transaction.userId = :userId', { userId })
      .orderBy('transaction.date', 'DESC');

    // Apply filters
    if (filters.type) {
      queryBuilder.andWhere('transaction.type = :type', { type: filters.type });
    }
    if (filters.category) {
      queryBuilder.andWhere('transaction.category = :category', { category: filters.category });
    }
    if (filters.startDate) {
      queryBuilder.andWhere('transaction.date >= :startDate', { startDate: filters.startDate });
    }
    if (filters.endDate) {
      queryBuilder.andWhere('transaction.date <= :endDate', { endDate: filters.endDate });
    }

    // Apply pagination
    const skip = (pagination.page - 1) * pagination.limit;
    queryBuilder.skip(skip).take(pagination.limit);

    const [transactions, total] = await queryBuilder.getManyAndCount();

    return { transactions, total };
  }

  async getTransactionById(userId: string, transactionId: string): Promise<Transaction> {
    const transaction = await transactionRepository.findOne({
      where: { id: transactionId, userId }
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    return transaction;
  }

  async updateTransaction(
    userId: string,
    transactionId: string,
    updateData: Partial<Transaction>
  ): Promise<Transaction> {
    const transaction = await transactionRepository.findOne({
      where: { id: transactionId, userId },
      relations: ['user']
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Store old values for balance calculation
    const oldAmount = Number(transaction.amount);
    const oldType = transaction.type;

    // Update transaction fields
    Object.assign(transaction, updateData);

    const updatedTransaction = await transactionRepository.save(transaction);

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

    return updatedTransaction;
  }

  async deleteTransaction(userId: string, transactionId: string): Promise<void> {
    const transaction = await transactionRepository.findOne({
      where: { id: transactionId, userId },
      relations: ['user']
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    // Update user balance (revert transaction effect)
    const user = transaction.user;
    if (transaction.type === TransactionType.INCOME) {
      user.balance = Number(user.balance) - Number(transaction.amount);
    } else {
      user.balance = Number(user.balance) + Number(transaction.amount);
    }
    await userRepository.save(user);

    await transactionRepository.remove(transaction);
  }

  async getTransactionStats(
    userId: string,
    period: 'week' | 'month' | 'year' = 'month'
  ): Promise<TransactionStats> {
    const startDate = DateHelper.getStartOfPeriod(period);
    const endDate = new Date();

    const transactions = await transactionRepository.find({
      where: { userId },
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

    return {
      period,
      startDate,
      endDate,
      totalIncome: income,
      totalExpenses: expenses,
      netAmount: income - expenses,
      transactionCount: filteredTransactions.length,
      expensesByCategory
    };
  }

  private async updateUserBalance(user: User, amount: number, type: TransactionType): Promise<void> {
    if (type === TransactionType.INCOME) {
      user.balance = Number(user.balance) + Number(amount);
    } else {
      user.balance = Number(user.balance) - Number(amount);
    }
    await userRepository.save(user);
  }
}
