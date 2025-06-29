import { useState } from 'react'
import { useTransactions } from '../../hooks/useTransactions'
import { useAuth } from '../../contexts/AuthContext'
import Header from '../../components/Header'
import Summary from '../../components/Summary'
import TransactionForm from '../../components/TransactionForm'
import TransactionList from '../../components/TransactionList'
import { Transaction, FormData } from '../../types/Transaction'
import styles from './Dashboard.module.css'

const Dashboard = () => {
  const { user } = useAuth()
  const { transactions, addTransaction, updateTransaction, deleteTransaction, getBalance } = useTransactions()
  const [editingTransaction, setEditingTransaction] = useState<(FormData & { id: number }) | null>(null)

  const { totalIncome, totalExpenses, balance } = getBalance()

  const getWelcomeMessage = () => {
    if (user?.firstName) {
      return `Bonjour ${user.firstName} !`
    }
    return 'Bonjour !'
  }

  const handleSubmit = (formData: FormData) => {
    if (editingTransaction) {
      updateTransaction(editingTransaction.id, formData)
      setEditingTransaction(null)
    } else {
      addTransaction(formData)
    }
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction({
      id: transaction.id,
      description: transaction.description,
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: transaction.category,
      date: transaction.date
    })
  }

  const handleCancelEdit = () => {
    setEditingTransaction(null)
  }

  return (
    <div className={styles.dashboard}>
      <Header 
        title={getWelcomeMessage()} 
        subtitle="Gérez votre budget personnel" 
      />
      
      <Summary 
        totalIncome={totalIncome}
        totalExpenses={totalExpenses}
        balance={balance}
      />

      <div className={styles.mainContent}>
        <TransactionForm 
          onSubmit={handleSubmit}
          editingTransaction={editingTransaction}
          onCancelEdit={handleCancelEdit}
        />
        
        <TransactionList 
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={deleteTransaction}
        />
      </div>
    </div>
  )
}

export default Dashboard
