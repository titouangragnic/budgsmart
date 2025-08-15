import ApiService from './ApiService';
import { Transaction, FormData } from '../types/Transaction';

export interface CreateTransactionData {
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
  notes?: string;
}

export interface UpdateTransactionData extends CreateTransactionData {}

export interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TransactionStats {
  period: string;
  startDate: string;
  endDate: string;
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
  expensesByCategory: Record<string, number>;
}

export class TransactionService {
  private static baseEndpoint = '/transactions';

  static async createTransaction(data: CreateTransactionData): Promise<Transaction> {
    const response = await ApiService.post<{ 
      message: string; 
      transaction: Transaction 
    }>(this.baseEndpoint, data);
    return response.transaction;
  }

  static async getTransactions(params?: {
    page?: number;
    limit?: number;
    type?: 'income' | 'expense';
    category?: string;
    startDate?: string;
    endDate?: string;
  }): Promise<TransactionsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.type) queryParams.append('type', params.type);
    if (params?.category) queryParams.append('category', params.category);
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);

    const endpoint = queryParams.toString() 
      ? `${this.baseEndpoint}?${queryParams.toString()}`
      : this.baseEndpoint;

    return ApiService.get<TransactionsResponse>(endpoint);
  }

  static async getTransaction(id: string): Promise<Transaction> {
    return ApiService.get<Transaction>(`${this.baseEndpoint}/${id}`);
  }

  static async updateTransaction(id: string, data: UpdateTransactionData): Promise<Transaction> {
    const response = await ApiService.put<{ 
      message: string; 
      transaction: Transaction 
    }>(`${this.baseEndpoint}/${id}`, data);
    return response.transaction;
  }

  static async deleteTransaction(id: string): Promise<void> {
    await ApiService.delete<{ message: string }>(`${this.baseEndpoint}/${id}`);
  }

  static async getTransactionStats(period: 'week' | 'month' | 'year' = 'month'): Promise<TransactionStats> {
    return ApiService.get<TransactionStats>(`${this.baseEndpoint}/stats?period=${period}`);
  }
}

export default TransactionService;
