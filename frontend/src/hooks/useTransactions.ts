import { useState, useEffect } from 'react'
import { Transaction, FormData } from '../types/Transaction'
import TransactionService, { CreateTransactionData } from '../services/TransactionService'

// Fonction utilitaire pour normaliser les transactions reçues de l'API
const normalizeTransaction = (transaction: any): Transaction => ({
  id: transaction.id,
  description: transaction.description,
  amount: typeof transaction.amount === 'string' ? parseFloat(transaction.amount) : transaction.amount,
  type: transaction.type,
  category: transaction.category,
  date: transaction.date
})

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Charger les transactions depuis l'API
  useEffect(() => {
    loadTransactions()
  }, [])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await TransactionService.getTransactions({ limit: 1000 })
      const normalizedTransactions = response.transactions.map(normalizeTransaction)
      setTransactions(normalizedTransactions)
    } catch (err) {
      setError('Erreur lors du chargement des transactions')
      console.error('Error loading transactions:', err)
    } finally {
      setLoading(false)
    }
  }

  const addTransaction = async (formData: FormData) => {
    try {
      setLoading(true)
      setError(null)
      const transactionData: CreateTransactionData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        date: formData.date
      }
      const newTransaction = await TransactionService.createTransaction(transactionData)
      const normalizedTransaction = normalizeTransaction(newTransaction)
      setTransactions(prev => [...prev, normalizedTransaction])
    } catch (err) {
      setError('Erreur lors de l\'ajout de la transaction')
      console.error('Error adding transaction:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const updateTransaction = async (id: string, formData: FormData) => {
    try {
      setLoading(true)
      setError(null)
      const transactionData: CreateTransactionData = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        type: formData.type,
        category: formData.category,
        date: formData.date
      }
      const updatedTransaction = await TransactionService.updateTransaction(id, transactionData)
      const normalizedTransaction = normalizeTransaction(updatedTransaction)
      setTransactions(prev => prev.map(t => t.id === id ? normalizedTransaction : t))
    } catch (err) {
      setError('Erreur lors de la modification de la transaction')
      console.error('Error updating transaction:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const deleteTransaction = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      try {
        setLoading(true)
        setError(null)
        await TransactionService.deleteTransaction(id)
        setTransactions(prev => prev.filter(t => t.id !== id))
      } catch (err) {
        setError('Erreur lors de la suppression de la transaction')
        console.error('Error deleting transaction:', err)
        throw err
      } finally {
        setLoading(false)
      }
    }
  }

  const getBalance = () => {
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)

    return {
      totalIncome,
      totalExpenses,
      balance: totalIncome - totalExpenses
    }
  }

  return {
    transactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    getBalance,
    loading,
    error,
    refetch: loadTransactions
  }
}
