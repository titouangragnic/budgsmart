import styles from './Summary.module.css'

interface SummaryProps {
  totalIncome: number
  totalExpenses: number
  balance: number
}

const Summary = ({ totalIncome, totalExpenses, balance }: SummaryProps) => {
  return (
    <div className={styles.summary}>
      <div className={`${styles.summaryCard} ${styles.income}`}>
        <h3>Revenus</h3>
        <p className={styles.amount}>+{totalIncome.toFixed(2)} €</p>
      </div>
      <div className={`${styles.summaryCard} ${styles.expense}`}>
        <h3>Dépenses</h3>
        <p className={styles.amount}>-{totalExpenses.toFixed(2)} €</p>
      </div>
      <div className={`${styles.summaryCard} ${styles.balance} ${balance >= 0 ? styles.positive : styles.negative}`}>
        <h3>Solde</h3>
        <p className={styles.amount}>{balance.toFixed(2)} €</p>
      </div>
    </div>
  )
}

export default Summary
