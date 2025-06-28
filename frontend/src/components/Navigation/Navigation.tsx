import { Link, useLocation } from 'react-router-dom'
import styles from './Navigation.module.css'

const Navigation = () => {
  const location = useLocation()

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.navLogo}>
          💰 BudgSmart
        </Link>
        
        <div className={styles.navLinks}>
          <Link 
            to="/dashboard" 
            className={`${styles.navLink} ${location.pathname === '/dashboard' ? styles.active : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/login" 
            className={`${styles.navLink} ${location.pathname === '/login' ? styles.active : ''}`}
          >
            Connexion
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
