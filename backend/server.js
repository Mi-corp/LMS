const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors');
const { domainToASCII, domainToUnicode } = require('url');
const bookRoutes = require('./routes/bookRoutes');
const borrowerRoutes = require('./routes/borrowerRoutes');
const authorRoutes = require('./routes/authorRoutes');
const countRoutes = require('./routes/countRoutes');

const app = express();
app.use(express.json());
app.use(cors());

// Serve the static HTML file
app.use(express.static('public'));

// Health check route
app.get('/status', (req, res) => {
  res.status(200).send({ status: 'Server is live!' });
});

// Connect to MongoDB
mongoose.connect(`${process.env.MONGODB_URI}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'Library_DB',
});
const db = mongoose.connection;

db.on('error', (error) => console.error('MongoDB connection error:', error));
db.once('open', () => console.log('Connected to MongoDB'));

// Example Punycode operations using url module
const unicodeDomain = domainToUnicode('xn--example-9h2c.com');
const asciiDomain = domainToASCII('example.com');

console.log(`Unicode Domain: ${unicodeDomain}`);
console.log(`ASCII Domain: ${asciiDomain}`);

app.use('/api/books', bookRoutes);
app.use('/api/borrowers', borrowerRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/counts', countRoutes);

// Start the server
const PORT = `${process.env.PORT}` || 5500;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
