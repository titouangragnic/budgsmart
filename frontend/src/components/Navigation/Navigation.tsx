import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import UserProfile from '../UserProfile'
import styles from './Navigation.module.css'

const Navigation = () => {
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth()

  return (
    <nav className={styles.navigation}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.navLogo}>
          💰 BudgSmart
        </Link>
        
        <div className={styles.navLinks}>
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                className={`${styles.navLink} ${location.pathname === '/dashboard' ? styles.active : ''}`}
              >
                Dashboard
              </Link>
              <UserProfile />
            </>
          ) : (
            !isLoading && (
              <Link 
                to="/login" 
                className={`${styles.navLink} ${location.pathname === '/login' ? styles.active : ''}`}
              >
                Connexion
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navigation
