import { Link, useLocation } from 'react-router-dom'
import './Navigation.css'

const Navigation = () => {
  const location = useLocation()

  return (
    <nav className="navigation">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          💰 BudgSmart
        </Link>
        
        <div className="nav-links">
          <Link 
            to="/dashboard" 
            className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/login" 
            className={`nav-link ${location.pathname === '/login' ? 'active' : ''}`}
          >
            Connexion
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navigation
