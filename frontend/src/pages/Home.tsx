import { Link } from 'react-router-dom'
import './Home.css'

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <h1>💰 BudgSmart</h1>
          <p className="hero-subtitle">
            Prenez le contrôle de vos finances personnelles
          </p>
          <p className="hero-description">
            Une application simple et efficace pour gérer votre budget, 
            suivre vos dépenses et atteindre vos objectifs financiers.
          </p>
          
          <div className="hero-actions">
            <Link to="/dashboard" className="btn btn-primary btn-large">
              Accéder au Dashboard
            </Link>
            <Link to="/login" className="btn btn-secondary btn-large">
              Se connecter
            </Link>
          </div>
        </div>
      </div>

      <div className="features">
        <div className="features-container">
          <h2>Fonctionnalités</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Suivi des dépenses</h3>
              <p>Enregistrez et catégorisez facilement toutes vos transactions</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💳</div>
              <h3>Gestion des revenus</h3>
              <p>Suivez vos sources de revenus et votre flux de trésorerie</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📈</div>
              <h3>Tableaux de bord</h3>
              <p>Visualisez votre situation financière en un coup d'œil</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Objectifs financiers</h3>
              <p>Définissez et atteignez vos objectifs d'épargne</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
