const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const { domainToASCII, domainToUnicode } = require('url');
const bookRoutes = require('./routes/bookRoutes');
const borrowerRoutes = require('./routes/borrowerRoutes');
const authorRoutes = require('./routes/authorRoutes');
const countRoutes = require('./routes/countRoutes');

const app = express(); // Initialize the Express app

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Library_DB',
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit the app if the database connection fails
  });

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Example Punycode operations
const unicodeDomain = domainToUnicode('xn--example-9h2c.com');
const asciiDomain = domainToASCII('example.com');
console.log(`Unicode Domain: ${unicodeDomain}`);
console.log(`ASCII Domain: ${asciiDomain}`);

// API Routes
app.use('/api/books', bookRoutes);
app.use('/api/borrowers', borrowerRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/counts', countRoutes);

// Health Check Route
app.get('/status', (req, res) => {
  res.status(200).send({ status: 'Server is live!' });
});

// 404 Route Handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Server Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
