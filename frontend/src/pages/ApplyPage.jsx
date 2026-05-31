import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function ApplyPage() {
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    amount: '',
    purpose: '',
    language: ''
  })
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [referenceId, setReferenceId] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const newErrors = {}
    if (!formData.name || formData.name.trim().length < 3)
      newErrors.name = 'Name must be at least 3 characters'
    if (!formData.mobile || !/^\d{10}$/.test(formData.mobile))
      newErrors.mobile = 'Enter valid 10-digit mobile number'
    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = 'Enter valid loan amount'
    if (!formData.purpose)
      newErrors.purpose = 'Purpose is required'
    if (!formData.language)
      newErrors.language = 'Please select a language'
    return newErrors
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }
    setLoading(true)
    try {
      const response = await axios.post(`${API_URL}/api/applications`, formData)
      setReferenceId(response.data.id)
      setSubmitted(true)
    } catch (err) {
      setErrors({ 
        submit: err.response?.data?.error || 'Something went wrong' 
      })
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div style={styles.container}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✅</div>
          <h2 style={styles.successTitle}>Application Submitted!</h2>
          <p style={styles.successText}>Your loan application has been received.</p>
          <div style={styles.referenceBox}>
            <p style={styles.referenceLabel}>Reference ID</p>
            <p style={styles.referenceId}>{referenceId}</p>
          </div>
          <button 
            style={styles.newButton}
            onClick={() => {
              setSubmitted(false)
              setFormData({ name:'', mobile:'', amount:'', purpose:'', language:'' })
            }}
          >
            Submit Another Application
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Loan Application</h2>
        <p style={styles.subtitle}>Fill in the details below to apply</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Full Name</label>
            <input
              style={{...styles.input, ...(errors.name ? styles.inputError : {})}}
              type="text"
              name="name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p style={styles.error}>{errors.name}</p>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Mobile Number</label>
            <input
              style={{...styles.input, ...(errors.mobile ? styles.inputError : {})}}
              type="text"
              name="mobile"
              placeholder="10-digit mobile number"
              value={formData.mobile}
              onChange={handleChange}
            />
            {errors.mobile && <p style={styles.error}>{errors.mobile}</p>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Loan Amount (₹)</label>
            <input
              style={{...styles.input, ...(errors.amount ? styles.inputError : {})}}
              type="number"
              name="amount"
              placeholder="Enter loan amount"
              value={formData.amount}
              onChange={handleChange}
            />
            {errors.amount && <p style={styles.error}>{errors.amount}</p>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Loan Purpose</label>
            <input
              style={{...styles.input, ...(errors.purpose ? styles.inputError : {})}}
              type="text"
              name="purpose"
              placeholder="e.g. Business, Education, Medical"
              value={formData.purpose}
              onChange={handleChange}
            />
            {errors.purpose && <p style={styles.error}>{errors.purpose}</p>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Preferred Language</label>
            <select
              style={{...styles.input, ...(errors.language ? styles.inputError : {})}}
              name="language"
              value={formData.language}
              onChange={handleChange}
            >
              <option value="">Select language</option>
              <option value="Hindi">Hindi</option>
              <option value="Marathi">Marathi</option>
              <option value="Tamil">Tamil</option>
              <option value="Telugu">Telugu</option>
              <option value="English">English</option>
            </select>
            {errors.language && <p style={styles.error}>{errors.language}</p>}
          </div>

          {errors.submit && (
            <p style={{...styles.error, textAlign:'center'}}>{errors.submit}</p>
          )}

          <button 
            type="submit" 
            style={{...styles.button, opacity: loading ? 0.7 : 1}}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </form>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f5f5',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '20px'
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
  },
  title: {
    margin: '0 0 8px',
    color: '#c0392b',
    fontSize: '24px'
  },
  subtitle: {
    margin: '0 0 24px',
    color: '#666',
    fontSize: '14px'
  },
  field: { marginBottom: '16px' },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '600',
    fontSize: '14px',
    color: '#333'
  },
  input: {
    width: '100%',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none'
  },
  inputError: { borderColor: '#e74c3c' },
  error: {
    color: '#e74c3c',
    fontSize: '12px',
    margin: '4px 0 0'
  },
  button: {
    width: '100%',
    padding: '12px',
    background: '#c0392b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px'
  },
  successCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '40px',
    width: '100%',
    maxWidth: '480px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  successIcon: { fontSize: '48px', marginBottom: '16px' },
  successTitle: { color: '#27ae60', margin: '0 0 8px' },
  successText: { color: '#666', margin: '0 0 24px' },
  referenceBox: {
    background: '#f8f8f8',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '24px'
  },
  referenceLabel: { color: '#666', fontSize: '12px', margin: '0 0 4px' },
  referenceId: {
    color: '#c0392b',
    fontWeight: 'bold',
    fontSize: '14px',
    wordBreak: 'break-all',
    margin: 0
  },
  newButton: {
    padding: '10px 24px',
    background: '#c0392b',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px'
  }
}

export default ApplyPage