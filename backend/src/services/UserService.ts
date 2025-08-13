import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { UserStats } from '../types';

const userRepository = AppDataSource.getRepository(User);

export class UserService {
  async updateUser(userId: string, updateData: Partial<User>): Promise<User> {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    // Update only allowed fields
    const allowedFields = ['firstName', 'lastName', 'email'];
    for (const field of allowedFields) {
      if (updateData[field as keyof User] !== undefined) {
        (user as any)[field] = updateData[field as keyof User];
      }
    }

    return await userRepository.save(user);
  }

  async deleteUser(userId: string): Promise<void> {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    await userRepository.remove(user);
  }

  async getUserStats(userId: string): Promise<UserStats> {
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['transactions']
    });

    if (!user) {
      throw new Error('User not found');
    }

    const totalTransactions = user.transactions.length;
    const totalIncome = user.transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + Number(t.amount), 0);
    
    const totalExpenses = user.transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + Number(t.amount), 0);

    return {
      totalTransactions,
      totalIncome,
      totalExpenses,
      currentBalance: Number(user.balance),
      netIncome: totalIncome - totalExpenses
    };
  }

  async updateBalance(userId: string, amount: number, operation: 'add' | 'subtract'): Promise<User> {
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }

    if (operation === 'add') {
      user.balance = Number(user.balance) + amount;
    } else {
      user.balance = Number(user.balance) - amount;
    }

    return await userRepository.save(user);
  }
}
