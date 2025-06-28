import { useState } from 'react'
import { Transaction, FilterType } from '../types/Transaction'
import './TransactionList.css'

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
    <div className="transactions-section">
      <div className="transactions-header">
        <h2>Transactions ({filteredTransactions.length})</h2>
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Toutes
          </button>
          <button 
            className={`filter-btn ${filter === 'income' ? 'active' : ''}`}
            onClick={() => setFilter('income')}
          >
            Revenus
          </button>
          <button 
            className={`filter-btn ${filter === 'expense' ? 'active' : ''}`}
            onClick={() => setFilter('expense')}
          >
            Dépenses
          </button>
        </div>
      </div>

      <div className="transactions-list">
        {filteredTransactions.length === 0 ? (
          <p className="no-transactions">Aucune transaction trouvée</p>
        ) : (
          filteredTransactions
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map(transaction => (
              <div key={transaction.id} className="transaction-card">
                <div className="transaction-info">
                  <div className="transaction-main">
                    <h4>{transaction.description}</h4>
                    <p className="transaction-category">{transaction.category}</p>
                  </div>
                  <div className="transaction-details">
                    <p className={`transaction-amount ${transaction.type}`}>
                      {transaction.type === 'expense' ? '-' : '+'}
                      {transaction.amount.toFixed(2)} €
                    </p>
                    <p className="transaction-date">
                      {new Date(transaction.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
                <div className="transaction-actions">
                  <button 
                    onClick={() => onEdit(transaction)}
                    className="btn btn-edit"
                    title="Modifier"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => onDelete(transaction.id)}
                    className="btn btn-delete"
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
