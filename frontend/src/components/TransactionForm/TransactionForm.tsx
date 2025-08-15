import { useState } from 'react'
import { FormData } from '../../types/Transaction'
import styles from './TransactionForm.module.css'

interface TransactionFormProps {
  onSubmit: (formData: FormData) => Promise<void> | void
  editingTransaction?: FormData & { id: string } | null
  onCancelEdit?: () => void
}

const TransactionForm = ({ onSubmit, editingTransaction, onCancelEdit }: TransactionFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    description: editingTransaction?.description || '',
    amount: editingTransaction?.amount || '',
    type: editingTransaction?.type || 'expense',
    category: editingTransaction?.category || '',
    date: editingTransaction?.date || new Date().toISOString().split('T')[0]
  })

  const categories = [
    { value: 'food', label: 'Alimentation' },
    { value: 'transport', label: 'Transport' },
    { value: 'entertainment', label: 'Divertissement' },
    { value: 'health', label: 'Santé' },
    { value: 'shopping', label: 'Shopping' },
    { value: 'bills', label: 'Factures' },
    { value: 'salary', label: 'Salaire' },
    { value: 'freelance', label: 'Freelance' },
    { value: 'investment', label: 'Investissement' },
    { value: 'other', label: 'Autre' }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.description || !formData.amount || !formData.category) {
      alert('Veuillez remplir tous les champs')
      return
    }

    try {
      setIsSubmitting(true)
      await onSubmit(formData)
      
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
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Erreur lors de la soumission du formulaire')
    } finally {
      setIsSubmitting(false)
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
                <option key={cat.value} value={cat.value}>{cat.label}</option>
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
          <button 
            type="submit" 
            className={`${styles.btn} ${styles.btnPrimary}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'En cours...' : (editingTransaction ? 'Modifier' : 'Ajouter')}
          </button>
          {editingTransaction && (
            <button 
              type="button" 
              onClick={handleCancel} 
              className={`${styles.btn} ${styles.btnSecondary}`}
              disabled={isSubmitting}
            >
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default TransactionForm
