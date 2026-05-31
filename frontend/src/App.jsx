import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ApplyPage from './pages/ApplyPage'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <BrowserRouter>
      <nav style={{ 
        padding: '15px 30px', 
        background: '#c0392b', 
        display: 'flex', 
        gap: '20px',
        alignItems: 'center'
      }}>
        <span style={{ 
          color: 'white', 
          fontWeight: 'bold', 
          fontSize: '20px',
          marginRight: 'auto'
        }}>
          Vitto Loan Portal
        </span>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
          Apply
        </Link>
        <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>
          Dashboard
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={<ApplyPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App