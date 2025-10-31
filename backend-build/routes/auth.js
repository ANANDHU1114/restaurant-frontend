const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    console.log('Received registration request:', req.body);
    const { name, username, email, password } = req.body;
    if (!name || !username || !email || !password) {
      console.log('Missing required fields:', { name, username, email, password: !!password });
      return res.status(400).json({ error: 'All fields are required' });
    }
    console.log('Register attempt:', { name, username, email });
    
    // Check if user exists
    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }]
    });
    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ error: 'Username already taken' });
      }
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user
    const user = new User({ name, username, email, password });
    await user.save();

    // Generate token
    const token = generateToken(user._id);
    
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Login (accept username OR email)
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username (or email) and password are required' });
    }

    // Allow users to login with username or email
    const user = await User.findOne({ $or: [{ username }, { email: username }] });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Update lastLogin timestamp (best-effort)
    try {
      user.lastLogin = new Date();
      await user.save();
    } catch (e) {
      // ignore
    }

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(400).json({ error: err.message });
  }
});

// Get current user (protected route example)
router.get('/me', async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;