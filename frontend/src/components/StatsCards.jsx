function StatsCards({ summary }) {
  const cards = [
    { 
      label: 'Total Applications', 
      value: summary.total_applications || 0,
      color: '#3498db'
    },
    { 
      label: 'Total Amount', 
      value: `₹${Number(summary.total_amount || 0).toLocaleString('en-IN')}`,
      color: '#8e44ad'
    },
    { 
      label: 'Approved', 
      value: summary.approved_count || 0,
      color: '#27ae60'
    },
    { 
      label: 'Pending', 
      value: summary.pending_count || 0,
      color: '#f39c12'
    },
  ]

  return (
    <div style={styles.grid}>
      {cards.map((card, i) => (
        <div key={i} style={{...styles.card, borderTop: `4px solid ${card.color}`}}>
          <p style={styles.label}>{card.label}</p>
          <p style={{...styles.value, color: card.color}}>{card.value}</p>
        </div>
      ))}
    </div>
  )
}

const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '16px',
    marginBottom: '24px'
  },
  card: {
    background: 'white',
    borderRadius: '10px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    textAlign: 'center'
  },
  label: { color: '#666', fontSize: '13px', margin: '0 0 8px' },
  value: { fontSize: '28px', fontWeight: 'bold', margin: 0 }
}

export default StatsCards