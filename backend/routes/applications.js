const express = require('express');
const router = express.Router();
const pool = require('../db/index');
const { v4: uuidv4 } = require('uuid');

// API 1 - POST /api/applications - Submit new loan application
router.post('/', async (req, res) => {
  const { name, mobile, amount, purpose, language } = req.body;

  // Validation
  if (!name || !mobile || !amount || !purpose || !language) {
    return res.status(400).json({ 
      error: 'All fields are required: name, mobile, amount, purpose, language' 
    });
  }

  if (!['Hindi', 'Tamil', 'Telugu', 'Marathi', 'English'].includes(language)) {
    return res.status(400).json({ 
      error: 'Language must be one of: Hindi, Tamil, Telugu, Marathi, English' 
    });
  }

  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({ 
      error: 'Loan amount must be a positive number' 
    });
  }

  try {
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO applications (id, name, mobile, amount, purpose, language) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [id, name, mobile, amount, purpose, language]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// API 2 - GET /api/applications - Get all applications
router.get('/', async (req, res) => {
  const { status } = req.query;

  try {
    let query = 'SELECT * FROM applications ORDER BY created_at DESC';
    let values = [];

    if (status) {
      if (!['pending', 'approved', 'rejected'].includes(status)) {
        return res.status(400).json({ 
          error: 'Status must be: pending, approved, or rejected' 
        });
      }
      query = 'SELECT * FROM applications WHERE status = $1 ORDER BY created_at DESC';
      values = [status];
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// API 3 - PATCH /api/applications/:id/status - Approve or reject
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ 
      error: 'Status must be either approved or rejected' 
    });
  }

  try {
    const result = await pool.query(
      `UPDATE applications SET status = $1 
       WHERE id = $2 RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// API 4 - GET /api/summary - Dashboard stats
router.get('/summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        COUNT(*) as total_applications,
        COALESCE(SUM(amount), 0) as total_amount,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_count,
        COUNT(*) FILTER (WHERE status = 'approved') as approved_count,
        COUNT(*) FILTER (WHERE status = 'rejected') as rejected_count
      FROM applications
    `);
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;