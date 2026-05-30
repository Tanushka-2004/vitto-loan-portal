const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db/index');

const app = express();
app.use(cors());
app.use(express.json());

// Test route
app.get('/', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ message: 'Database connected successfully!' });
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});