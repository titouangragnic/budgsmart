import './Summary.css'

interface SummaryProps {
  totalIncome: number
  totalExpenses: number
  balance: number
}

const Summary = ({ totalIncome, totalExpenses, balance }: SummaryProps) => {
  return (
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
  )
}

export default Summary
