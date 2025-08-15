import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import styles from './Login.module.css'

const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { isAuthenticated, isLoading } = useAuth()
  const googleButtonRef = useRef<HTMLDivElement>(null)

  // Rediriger si déjà connecté
  useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/dashboard'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  // Render Google Sign-In button
  useEffect(() => {
    if (!isLoading && googleButtonRef.current && window.google) {
      try {
        window.google.accounts.id.renderButton(googleButtonRef.current, {
          theme: 'outline',
          size: 'large',
          type: 'standard',
          shape: 'rectangular',
          width: '100%',
          logo_alignment: 'left',
          text: 'signin_with',
        })
      } catch (error) {
        console.error('Failed to render Google button:', error)
      }
    }
  }, [isLoading])

  if (isLoading) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginCard}>
          <h1>💰 BudgSmart</h1>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            Chargement...
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <h1>💰 BudgSmart</h1>
        <h2>Connexion</h2>
        
        <div className={styles.loginForm}>
          <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#6b7280' }}>
            Connectez-vous avec votre compte Google
          </p>
          
          <div ref={googleButtonRef} style={{ width: '100%', marginBottom: '1rem' }}></div>
          
          <div style={{ textAlign: 'center', fontSize: '0.875rem', color: '#6b7280', marginTop: '1rem' }}>
            Si le bouton ne fonctionne pas, essayez de :
            <ul style={{ textAlign: 'left', marginTop: '0.5rem', paddingLeft: '1rem' }}>
              <li>Rafraîchir la page</li>
              <li>Autoriser les popups pour ce site</li>
              <li>Vider le cache du navigateur</li>
            </ul>
          </div>
        </div>

        <div className={styles.loginFooter}>
          <p>
            Pas encore de compte ? L'inscription se fait automatiquement lors de votre première connexion.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
