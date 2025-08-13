export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TransactionFilters {
  type?: 'income' | 'expense';
  category?: string;
  startDate?: string;
  endDate?: string;
}

export interface UserStats {
  totalTransactions: number;
  totalIncome: number;
  totalExpenses: number;
  currentBalance: number;
  netIncome: number;
}

export interface TransactionStats {
  period: string;
  startDate: Date;
  endDate: Date;
  totalIncome: number;
  totalExpenses: number;
  netAmount: number;
  transactionCount: number;
  expensesByCategory: Record<string, number>;
}
