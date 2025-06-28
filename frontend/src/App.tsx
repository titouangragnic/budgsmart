import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import './App.css'

function App() {
  return (
    <Router basename="/budgsmart">
      <div className="app">
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
