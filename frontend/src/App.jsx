import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [transactions, setTransactions] = useState([])
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0]
  })
  const [editingId, setEditingId] = useState(null)
  const [filter, setFilter] = useState('all')

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

  const categories = [
    'Alimentation', 'Transport', 'Logement', 'Divertissement', 
    'Santé', 'Éducation', 'Shopping', 'Utilities', 'Autre'
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.description || !formData.amount || !formData.category) {
      alert('Veuillez remplir tous les champs')
      return
    }

    const transaction = {
      id: editingId || Date.now(),
      ...formData,
      amount: parseFloat(formData.amount)
    }

    if (editingId) {
      setTransactions(prev => prev.map(t => t.id === editingId ? transaction : t))
      setEditingId(null)
    } else {
      setTransactions(prev => [...prev, transaction])
    }

    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0]
    })
  }

  const handleEdit = (transaction) => {
    setFormData({
      description: transaction.description,
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: transaction.category,
      date: transaction.date
    })
    setEditingId(transaction.id)
  }

  const handleDelete = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      setTransactions(prev => prev.filter(t => t.id !== id))
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0]
    })
  }

  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true
    return t.type === filter
  })

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  const balance = totalIncome - totalExpenses

  return (
    <div className="app">
      <header className="header">
        <h1>💰 BudgSmart</h1>
        <p>Gérez votre budget personnel</p>
      </header>

      <div className="summary">
        <div className="summary-card income">
          <h3>Revenus</h3>
          <p className="amount">+{totalIncome.toFixed(2)} €</p>
        </div>
        <div className="summary-card expense">
          <h3>Dépenses</h3>
          <p className="amount">-{totalExpenses.toFixed(2)} €</p>
        </div>
        <div className={`summary-card balance ${balance >= 0 ? 'positive' : 'negative'}`}>
          <h3>Solde</h3>
          <p className="amount">{balance.toFixed(2)} €</p>
        </div>
      </div>

      <div className="main-content">
        <div className="form-section">
          <h2>{editingId ? 'Modifier la transaction' : 'Nouvelle transaction'}</h2>
          <form onSubmit={handleSubmit} className="transaction-form">
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Ex: Courses alimentaires"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="amount">Montant (€)</label>
                <input
                  type="number"
                  id="amount"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                >
                  <option value="expense">Dépense</option>
                  <option value="income">Revenu</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Catégorie</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Choisir une catégorie</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="form-buttons">
              <button type="submit" className="btn btn-primary">
                {editingId ? 'Modifier' : 'Ajouter'}
              </button>
              {editingId && (
                <button type="button" onClick={cancelEdit} className="btn btn-secondary">
                  Annuler
                </button>
              )}
            </div>
          </form>
        </div>

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
                .sort((a, b) => new Date(b.date) - new Date(a.date))
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
                        onClick={() => handleEdit(transaction)}
                        className="btn btn-edit"
                        title="Modifier"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDelete(transaction.id)}
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
      </div>
    </div>
  )
}

export default App
