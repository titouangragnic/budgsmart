import { useState } from 'react'
import { Transaction, FilterType } from '../../types/Transaction'
import styles from './TransactionList.module.css'

interface TransactionListProps {
  transactions: Transaction[]
  onEdit: (transaction: Transaction) => void
  onDelete: (id: number) => void
}

const TransactionList = ({ transactions, onEdit, onDelete }: TransactionListProps) => {
  const [filter, setFilter] = useState<FilterType>('all')

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true
    return t.type === filter
  })

  return (
    <div className={styles.transactionsSection}>
      <div className={styles.transactionsHeader}>
        <h2>Transactions ({filteredTransactions.length})</h2>
        <div className={styles.filterButtons}>
          <button 
            className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            Toutes
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'income' ? styles.active : ''}`}
            onClick={() => setFilter('income')}
          >
            Revenus
          </button>
          <button 
            className={`${styles.filterBtn} ${filter === 'expense' ? styles.active : ''}`}
            onClick={() => setFilter('expense')}
          >
            Dépenses
          </button>
        </div>
      </div>

      <div className={styles.transactionsList}>
        {filteredTransactions.length === 0 ? (
          <p className={styles.noTransactions}>Aucune transaction trouvée</p>
        ) : (
          filteredTransactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(transaction => (
              <div key={transaction.id} className={styles.transactionCard}>
                <div className={styles.transactionInfo}>
                  <div className={styles.transactionMain}>
                    <h4>{transaction.description}</h4>
                    <p className={styles.transactionCategory}>{transaction.category}</p>
                  </div>
                  <div className={styles.transactionDetails}>
                    <p className={`${styles.transactionAmount} ${styles[transaction.type]}`}>
                      {transaction.type === 'expense' ? '-' : '+'}
                      {transaction.amount.toFixed(2)} €
                    </p>
                    <p className={styles.transactionDate}>
                      {new Date(transaction.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className={styles.transactionActions}>
                  <button 
                    onClick={() => onEdit(transaction)}
                    className={`${styles.btn} ${styles.btnEdit}`}
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => onDelete(transaction.id)}
                    className={`${styles.btn} ${styles.btnDelete}`}
                    title="Supprimer"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  )
}

export default TransactionList
