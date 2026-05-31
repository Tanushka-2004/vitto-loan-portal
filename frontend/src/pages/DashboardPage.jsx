import { useState, useEffect } from 'react'
import axios from 'axios'
import StatsCards from '../components/StatsCards'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const languageColors = {
  Hindi: '#e74c3c',
  Marathi: '#8e44ad',
  Tamil: '#2980b9',
  Telugu: '#16a085',
  English: '#d35400'
}

const statusStyles = {
  pending:  { background: '#fff3cd', color: '#856404', label: '🟡 Pending' },
  approved: { background: '#d1e7dd', color: '#0f5132', label: '🟢 Approved' },
  rejected: { background: '#f8d7da', color: '#842029', label: '🔴 Rejected' }
}

function DashboardPage() {
  const [applications, setApplications] = useState([])
  const [summary, setSummary] = useState({})
  const [statusFilter, setStatusFilter] = useState('')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState(null)
  const [updating, setUpdating] = useState(false)

  const fetchData = async () => {
    try {
    const [appsRes, summaryRes] = await Promise.all([
    axios.get(`${API_URL}/api/applications${statusFilter ? `?status=${statusFilter}` : ''}`),
    axios.get(`${API_URL}/api/applications/summary`)
    ])
      setApplications(appsRes.data)
      setSummary(summaryRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [statusFilter])

  const handleStatusUpdate = async (id, newStatus) => {
    setUpdating(true)
    try {
      const res = await axios.patch(
        `${API_URL}/api/applications/${id}/status`,
        { status: newStatus }
      )
      // Update without page reload
      setApplications(prev =>
        prev.map(app => app.id === id ? res.data : app)
      )
      setSummary(prev => ({ ...prev }))
      await fetchData()
      setSelectedApp(null)
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  // Search filter
  const filtered = applications.filter(app =>
    app.name.toLowerCase().includes(search.toLowerCase()) ||
    app.mobile.includes(search)
  )

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }

  const formatAmount = (amount) => {
    return `₹${Number(amount).toLocaleString('en-IN')}`
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Loan Applications Dashboard</h2>

      {/* Stats Cards */}
      <StatsCards summary={summary} />

      {/* Search and Filter Bar */}
      <div style={styles.toolbar}>
        <input
          style={styles.search}
          type="text"
          placeholder="🔍 Search by name or mobile..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <select
          style={styles.filter}
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          <option value="pending">🟡 Pending</option>
          <option value="approved">🟢 Approved</option>
          <option value="rejected">🔴 Rejected</option>
        </select>
      </div>

      {/* Table */}
      {loading ? (
        <p style={styles.loading}>Loading applications...</p>
      ) : filtered.length === 0 ? (
        <p style={styles.loading}>No applications found.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Applicant</th>
                <th style={styles.th}>Loan Amount</th>
                <th style={styles.th}>Purpose</th>
                <th style={styles.th}>Language</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app, i) => (
                <tr 
                  key={app.id}
                  style={{
                    ...styles.tr,
                    background: i % 2 === 0 ? 'white' : '#fafafa'
                  }}
                >
                  <td style={styles.td}>
                    <p style={styles.name}>{app.name}</p>
                    <p style={styles.mobile}>{app.mobile}</p>
                  </td>
                  <td style={styles.td}>
                    <strong>{formatAmount(app.amount)}</strong>
                  </td>
                  <td style={styles.td}>{app.purpose}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.langBadge,
                      background: languageColors[app.language] + '20',
                      color: languageColors[app.language]
                    }}>
                      {app.language}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      background: statusStyles[app.status].background,
                      color: statusStyles[app.status].color
                    }}>
                      {statusStyles[app.status].label}
                    </span>
                  </td>
                  <td style={styles.td}>{formatDate(app.created_at)}</td>
                  <td style={styles.td}>
                    {app.status === 'pending' && (
                      <button
                        style={styles.actionBtn}
                        onClick={() => setSelectedApp(app)}
                      >
                        Update
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Status Update Modal */}
      {selectedApp && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Update Application Status</h3>
            <p style={styles.modalText}>
              <strong>{selectedApp.name}</strong> — {formatAmount(selectedApp.amount)}
            </p>
            <p style={styles.modalSub}>Select new status:</p>
            <div style={styles.modalButtons}>
              <button
                style={{...styles.approveBtn, opacity: updating ? 0.7 : 1}}
                disabled={updating}
                onClick={() => handleStatusUpdate(selectedApp.id, 'approved')}
              >
                🟢 Approve
              </button>
              <button
                style={{...styles.rejectBtn, opacity: updating ? 0.7 : 1}}
                disabled={updating}
                onClick={() => handleStatusUpdate(selectedApp.id, 'rejected')}
              >
                🔴 Reject
              </button>
            </div>
            <button
              style={styles.cancelBtn}
              onClick={() => setSelectedApp(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  container: {
    padding: '20px 16px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  title: {
    color: '#c0392b',
    marginBottom: '24px'
  },
  toolbar: {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  search: {
    flex: 1,
    minWidth: '200px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none'
  },
  filter: {
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
    outline: 'none',
    cursor: 'pointer'
  },
  tableWrapper: {
    overflowX: 'auto',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    background: 'white'
  },
  thead: { background: '#c0392b' },
  th: {
    padding: '14px 16px',
    color: 'white',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  tr: { borderBottom: '1px solid #f0f0f0' },
  td: {
    padding: '14px 16px',
    fontSize: '14px',
    color: '#333',
    verticalAlign: 'middle'
  },
  name: { margin: '0 0 2px', fontWeight: '600' },
  mobile: { margin: 0, color: '#888', fontSize: '12px' },
  badge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  langBadge: {
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600'
  },
  actionBtn: {
    padding: '6px 14px',
    background: '#c0392b',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  loading: {
    textAlign: 'center',
    color: '#888',
    padding: '40px'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0, left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center'
  },
  modalTitle: { color: '#c0392b', margin: '0 0 12px' },
  modalText: { margin: '0 0 4px', fontSize: '15px' },
  modalSub: { color: '#666', fontSize: '13px', margin: '0 0 20px' },
  modalButtons: {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginBottom: '12px'
  },
  approveBtn: {
    padding: '10px 24px',
    background: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  rejectBtn: {
    padding: '10px 24px',
    background: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600'
  },
  cancelBtn: {
    padding: '8px 20px',
    background: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer'
  }
}

export default DashboardPage