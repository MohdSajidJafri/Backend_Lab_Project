const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
const booksRouter = require('./routes/books');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Enable CORS for frontend access
app.use(express.json()); // Parse JSON request bodies
app.use(express.static(path.join(__dirname, '../frontend'))); // Serve static files from frontend directory

// API Routes
app.use('/api/books', booksRouter);

// Serve frontend HTML for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

