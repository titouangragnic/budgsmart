import { useState, useEffect } from 'react'
import { Transaction, FormData } from '../types/Transaction'

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  // Charger les transactions depuis localStorage
  useEffect(() => {
    const savedTransactions = localStorage.getItem('budgetTransactions')
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions))
    }
  }, [])

  // Sauvegarder les transactions dans localStorage
  useEffect(() => {
    localStorage.setItem('budgetTransactions', JSON.stringify(transactions))
  }, [transactions])

  const addTransaction = (formData: FormData) => {
    const transaction: Transaction = {
      id: Date.now(),
      ...formData,
      amount: parseFloat(formData.amount)
    }
    setTransactions(prev => [...prev, transaction])
  }

  const updateTransaction = (id: number, formData: FormData) => {
    const transaction: Transaction = {
      id,
      ...formData,
      amount: parseFloat(formData.amount)
    }
    setTransactions(prev => prev.map(t => t.id === id ? transaction : t))
  }

  const deleteTransaction = (id: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      setTransactions(prev => prev.filter(t => t.id !== id))
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
    getBalance
  }
}
