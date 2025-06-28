export interface Transaction {
  id: number
  description: string
  amount: number
  type: 'expense' | 'income'
  category: string
  date: string
}

export interface FormData {
  description: string
  amount: string
  type: 'expense' | 'income'
  category: string
  date: string
}

export type FilterType = 'all' | 'expense' | 'income'
