import { Request } from 'express';
import { PaginationParams } from '../types';

export class PaginationHelper {
  static extractParams(req: Request): PaginationParams {
    const page = parseInt(req.query.page as string) || 1;
    const limit = Math.min(parseInt(req.query.limit as string) || 10, 100); // Max 100 per page
    
    return { page, limit };
  }

  static getSkip(page: number, limit: number): number {
    return (page - 1) * limit;
  }

  static calculatePages(total: number, limit: number): number {
    return Math.ceil(total / limit);
  }
}

export class DateHelper {
  static parseDate(dateString: string): Date {
    return new Date(dateString);
  }

  static formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static getStartOfPeriod(period: 'week' | 'month' | 'year'): Date {
    const date = new Date();
    
    switch (period) {
      case 'week':
        date.setDate(date.getDate() - 7);
        break;
      case 'month':
        date.setMonth(date.getMonth() - 1);
        break;
      case 'year':
        date.setFullYear(date.getFullYear() - 1);
        break;
    }
    
    return date;
  }
}

export class ValidationHelper {
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  static isValidAmount(amount: number): boolean {
    return amount > 0 && amount <= 999999.99;
  }
}
