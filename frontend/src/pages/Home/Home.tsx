import { Link } from 'react-router-dom'
import styles from './Home.module.css'

const Home = () => {
  return (
    <div className={styles.home}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>💰 BudgSmart</h1>
          <p className={styles.heroSubtitle}>
            Prenez le contrôle de vos finances personnelles
          </p>
          <p className={styles.heroDescription}>
            Une application simple et efficace pour gérer votre budget, 
            suivre vos dépenses et atteindre vos objectifs financiers.
          </p>
          
          <div className={styles.heroActions}>
            <Link to="/dashboard" className={`${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`}>
              Accéder au Dashboard
            </Link>
            <Link to="/login" className={`${styles.btn} ${styles.btnSecondary} ${styles.btnLarge}`}>
              Se connecter
            </Link>
          </div>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2>Fonctionnalités</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Suivi des dépenses</h3>
              <p>Enregistrez et catégorisez facilement toutes vos transactions</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💳</div>
              <h3>Gestion des revenus</h3>
              <p>Suivez vos sources de revenus et votre flux de trésorerie</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📈</div>
              <h3>Tableaux de bord</h3>
              <p>Visualisez votre situation financière en un coup d'œil</p>
            </div>
            
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🎯</div>
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
