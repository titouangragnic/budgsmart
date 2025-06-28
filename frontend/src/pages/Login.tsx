import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const navigate = useNavigate()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement authentication logic
    console.log('Login attempt:', formData)
    
    // For now, just redirect to dashboard
    navigate('/dashboard')
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>💰 BudgSmart</h1>
        <h2>Connexion</h2>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full">
            Se connecter
          </button>
        </form>

        <div className="login-footer">
          <p>Pas encore de compte ? <a href="#register">S'inscrire</a></p>
        </div>
      </div>
    </div>
  )
}

export default Login
