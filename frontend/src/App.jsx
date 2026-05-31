import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import ApplyPage from './pages/ApplyPage'
import DashboardPage from './pages/DashboardPage'

function Navbar() {
  const location = useLocation()

  const linkStyle = (path) => ({
    color: 'white',
    textDecoration: 'none',
    padding: '6px 14px',
    borderRadius: '6px',
    fontWeight: '500',
    background: location.pathname === path 
      ? 'rgba(255,255,255,0.25)' 
      : 'transparent',
    borderBottom: location.pathname === path 
      ? '2px solid white' 
      : '2px solid transparent'
  })

  return (
    <nav style={{ 
      padding: '15px 20px', 
      background: '#c0392b', 
      display: 'flex', 
      gap: '16px',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      <span style={{ 
        color: 'white', 
        fontWeight: 'bold', 
        fontSize: '20px',
        marginRight: 'auto'
      }}>
        Vitto Loan Portal
      </span>
      <Link to="/" style={linkStyle('/')}>Apply</Link>
      <Link to="/dashboard" style={linkStyle('/dashboard')}>Dashboard</Link>
    </nav>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<ApplyPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App