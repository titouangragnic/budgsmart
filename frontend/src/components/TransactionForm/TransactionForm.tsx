import { useState } from 'react'
import { FormData } from '../../types/Transaction'
import styles from './TransactionForm.module.css'

interface TransactionFormProps {
  onSubmit: (formData: FormData) => void
  editingTransaction?: FormData & { id: number } | null
  onCancelEdit?: () => void
}

const TransactionForm = ({ onSubmit, editingTransaction, onCancelEdit }: TransactionFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    description: editingTransaction?.description || '',
    amount: editingTransaction?.amount || '',
    type: editingTransaction?.type || 'expense',
    category: editingTransaction?.category || '',
    date: editingTransaction?.date || new Date().toISOString().split('T')[0]
  })

  const categories = [
    'Alimentation', 'Transport', 'Logement', 'Divertissement', 
    'Santé', 'Éducation', 'Shopping', 'Utilities', 'Autre'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description || !formData.amount || !formData.category) {
      alert('Veuillez remplir tous les champs')
      return
    }

    onSubmit(formData)
    
    // Reset form if not editing
    if (!editingTransaction) {
      setFormData({
        description: '',
        amount: '',
        type: 'expense',
        category: '',
        date: new Date().toISOString().split('T')[0]
      })
    }
  }

  const handleCancel = () => {
    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      category: '',
      date: new Date().toISOString().split('T')[0]
    })
    onCancelEdit?.()
  }

  return (
    <div className={styles.formSection}>
      <h2>{editingTransaction ? 'Modifier la transaction' : 'Nouvelle transaction'}</h2>
      <form onSubmit={handleSubmit} className={styles.transactionForm}>
        <div className={styles.formGroup}>
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

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
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

          <div className={styles.formGroup}>
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

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
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

          <div className={styles.formGroup}>
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

        <div className={styles.formButtons}>
          <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
            {editingTransaction ? 'Modifier' : 'Ajouter'}
          </button>
          {editingTransaction && (
            <button type="button" onClick={handleCancel} className={`${styles.btn} ${styles.btnSecondary}`}>
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default TransactionForm
