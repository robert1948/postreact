const jwt = require('jsonwebtoken');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Verify password
    const isMatch = await User.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    const updatedUser = await User.save(user);

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        subscription: updatedUser.subscription,
        credits: updatedUser.credits
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const register = async (req, res) => {
  try {
    const { email, password, username, mobile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
      name: username || email.split('@')[0], // Use username or fallback to email prefix
      mobile: mobile || ''
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        mobile: user.mobile,
        subscription: user.subscription,
        credits: user.credits
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Request verification code
const requestVerification = async (req, res) => {
  try {
    const { email, mobile } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate a random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // In a real application, you would:
    // 1. Store the code in the database with an expiration time
    // 2. Send the code via email or SMS
    // 3. Return success response without the code

    // For demo purposes, we'll store the code in memory (not secure for production)
    // In a real app, use Redis or a database table for verification codes
    global.verificationCodes = global.verificationCodes || {};
    global.verificationCodes[email] = {
      code: verificationCode,
      expires: Date.now() + 10 * 60 * 1000 // 10 minutes expiration
    };

    console.log(`Verification code for ${email}: ${verificationCode}`);

    // In a real app, you would send the code via email/SMS here
    // For demo, we'll return it (NEVER do this in production)
    res.json({
      success: true,
      message: 'Verification code sent',
      verificationCode: verificationCode // Remove this in production
    });
  } catch (error) {
    console.error('Verification request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Verify code
const verifyCode = async (req, res) => {
  try {
    const { email, code } = req.body;

    // Check if verification code exists and is valid
    if (!global.verificationCodes ||
        !global.verificationCodes[email] ||
        global.verificationCodes[email].code !== code) {
      return res.status(400).json({ message: 'Invalid verification code' });
    }

    // Check if code is expired
    if (Date.now() > global.verificationCodes[email].expires) {
      delete global.verificationCodes[email];
      return res.status(400).json({ message: 'Verification code expired' });
    }

    // Code is valid, clean up
    delete global.verificationCodes[email];

    res.json({
      success: true,
      message: 'Verification successful'
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  login,
  register,
  requestVerification,
  verifyCode
};
