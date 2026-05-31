const express = require('express');
const cors = require('cors');
require('dotenv').config();
const pool = require('./db/index');
const applicationsRouter = require('./routes/applications');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/applications', applicationsRouter);

// Test route
app.get('/', async (req, res) => {
  try {
    await pool.query('SELECT NOW()');
    res.json({ message: 'Vitto API running!' });
  } catch (err) {
    res.status(500).json({ error: 'Database connection failed' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});