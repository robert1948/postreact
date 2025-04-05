const express = require('express');
const cors = require('cors');
const path = require('path');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// API routes
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

// Authentication routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  // For testing purposes, accept any login
  res.json({
    token: 'test-token',
    user: {
      id: 1,
      email,
      name: 'Test User',
      subscription: 'free',
      credits: 0
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { email, username, password, mobile } = req.body;

  // For testing purposes, accept any registration
  res.status(201).json({
    token: 'test-token',
    user: {
      id: 1,
      email,
      name: username || email.split('@')[0],
      mobile: mobile || '',
      subscription: 'free',
      credits: 0
    }
  });
});

// Store verification codes in memory (for demo purposes only)
const verificationCodes = {};

app.post('/api/auth/request-verification', (req, res) => {
  const { email, mobile } = req.body;

  // Generate a random 6-digit code
  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Store the code with the email (in a real app, this would be in a database with expiration)
  verificationCodes[email] = {
    code: verificationCode,
    expires: Date.now() + 10 * 60 * 1000 // 10 minutes expiration
  };

  console.log(`Verification code for ${email}: ${verificationCode}`);

  res.json({
    success: true,
    message: 'Verification code sent',
    verificationCode // In production, this would not be returned to the client
  });
});

app.post('/api/auth/verify-code', (req, res) => {
  const { email, code } = req.body;

  console.log(`Verifying code for ${email}: ${code}`);
  console.log('Stored codes:', verificationCodes);

  // Check if the code exists and matches
  if (!verificationCodes[email]) {
    return res.status(400).json({
      success: false,
      message: 'No verification code found for this email'
    });
  }

  if (verificationCodes[email].code !== code) {
    return res.status(400).json({
      success: false,
      message: 'Invalid verification code'
    });
  }

  // Check if the code is expired
  if (Date.now() > verificationCodes[email].expires) {
    delete verificationCodes[email];
    return res.status(400).json({
      success: false,
      message: 'Verification code expired'
    });
  }

  // Code is valid, clean up
  delete verificationCodes[email];

  res.json({
    success: true,
    message: 'Verification successful'
  });
});

// The "catchall" handler: for any request that doesn't
// match one above, send back the index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
