// Load environment variables based on NODE_ENV
if (process.env.NODE_ENV === 'production') {
  require('dotenv').config({ path: '.env.production' });
} else {
  require('dotenv').config({ path: '.env.development' });
}

const express = require('express');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
const { initializeDatabase } = require('./config/database');
const authRoutes = require('./routes/auth');

// Import passport configuration
require('./config/passport');

const app = express();

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://postreact-65ee402eb124.herokuapp.com', 'https://postreact.herokuapp.com', 'https://capecraft.herokuapp.com', 'https://www.cape-control.com']
    : 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json());

// Initialize Passport
app.use(passport.initialize());

app.use('/api/auth', authRoutes);

// Serve static files from the React build
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.resolve('/app/client/build');
  console.log('Looking for client build at:', clientBuildPath);

  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    const indexPath = path.join(clientBuildPath, 'index.html');
    console.log('Serving index.html from:', indexPath);
    res.sendFile(indexPath);
  });
}

// Basic error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Initialize the database before starting the server
const startServer = async () => {
  try {
    // Initialize the database
    await initializeDatabase();

    // Start the server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
