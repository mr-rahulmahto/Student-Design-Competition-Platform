const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// Helper: generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Helper: build response user object (no password)
const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  avatar: user.avatar,
  institution: user.institution,
  degree: user.degree,
  bio: user.bio,
  skills: user.skills,
  interests: user.interests,
  portfolioUrl: user.portfolioUrl,
  location: user.location,
  organizerName: user.organizerName,
  savedCompetitions: user.savedCompetitions,
  createdAt: user.createdAt
});

// ─────────────────────────────────────────────────────────────
// @route   POST /api/auth/register
// @desc    Register Student or Admin
// @access  Public
// ─────────────────────────────────────────────────────────────
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      avatar,
      institution,
      degree,
      bio,
      skills,
      portfolioUrl,
      organizerName
    } = req.body;

    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required.' });
    }

    // Check if email already taken
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'This email is already registered. Please sign in.' });
    }

    const requestedRole = role === 'admin' ? 'admin' : 'student';

    // Create user
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      role: requestedRole,
      avatar: avatar || undefined,
      institution: institution || '',
      degree: degree || 'Bachelor of Design',
      bio: bio || '',
      skills: skills || [],
      interests: req.body.interests || [],
      portfolioUrl: portfolioUrl || '',
      location: req.body.location || 'India',
      organizerName: organizerName || ''
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      message: `${requestedRole === 'admin' ? 'Admin' : 'Student'} account created successfully!`,
      token,
      user: formatUser(user)
    });

  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// ─────────────────────────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Login User (Student or Admin)
// @access  Public
// ─────────────────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const requestedRole = role === 'admin' ? 'admin' : 'student';

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    // Include password in query (normally excluded)
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'No account found with this email.' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password. Please try again.' });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: 'This account has been disabled.' });
    }

    // Role-check: student and admin accounts must log in from their matching portal.
    if (user.role !== requestedRole) {
      return res.status(403).json({
        success: false,
        message: `This is a ${user.role} account. Please use the ${user.role === 'admin' ? 'Admin' : 'Student'} login.`
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}!`,
      token,
      user: formatUser(user)
    });

  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// ─────────────────────────────────────────────────────────────
// @route   GET /api/auth/me
// @desc    Get currently logged in user profile
// @access  Private
// ─────────────────────────────────────────────────────────────
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({ success: true, user: formatUser(user) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────────────────────────
// @route   PUT /api/auth/profile
// @desc    Update logged-in user's profile
// @access  Private
// ─────────────────────────────────────────────────────────────
router.put('/profile', protect, async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      avatar: req.body.avatar,
      institution: req.body.institution,
      degree: req.body.degree,
      bio: req.body.bio,
      skills: req.body.skills,
      interests: req.body.interests,
      portfolioUrl: req.body.portfolioUrl,
      location: req.body.location,
      organizerName: req.body.organizerName,
      savedCompetitions: req.body.savedCompetitions
    };

    // Remove undefined fields
    Object.keys(updates).forEach(key => updates[key] === undefined && delete updates[key]);

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });

    return res.status(200).json({ success: true, message: 'Profile updated!', user: formatUser(user) });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update profile.' });
  }
});

// ─────────────────────────────────────────────────────────────
// @route   POST /api/auth/saved-competitions/:id
// @desc    Toggle save / bookmark competition in database
// @access  Private
// ─────────────────────────────────────────────────────────────
router.post('/saved-competitions/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    const compId = req.params.id;
    const currentSaved = (user.savedCompetitions || []).map(id => id ? id.toString() : '');
    const isSaved = currentSaved.includes(compId.toString());

    if (isSaved) {
      user.savedCompetitions = user.savedCompetitions.filter(id => (id ? id.toString() : '') !== compId.toString());
    } else {
      user.savedCompetitions.push(compId);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      message: isSaved ? 'Competition removed from bookmarks.' : 'Competition saved to database!',
      savedCompetitions: user.savedCompetitions,
      user: formatUser(user)
    });
  } catch (err) {
    console.error('Save competition error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to save competition to database.' });
  }
});

// @route   POST /api/auth/forgot-password
// @desc    Reset password for Student or Admin account
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email, role, newPassword } = req.body;
    const requestedRole = role === 'admin' ? 'admin' : 'student';

    if (!email || !newPassword) {
      return res.status(400).json({ success: false, message: 'Email and new password are required.' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const user = await User.findOne({ email: email.toLowerCase(), role: requestedRole }).select('+password');
    if (!user) {
      return res.status(404).json({ success: false, message: `No ${requestedRole} account found with this email.` });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Password reset successfully. Please sign in with your new password.'
    });
  } catch (err) {
    console.error('Forgot password error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to reset password.' });
  }
});

module.exports = router;
