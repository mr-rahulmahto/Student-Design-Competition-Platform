const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Competition = require('../models/Competition');
const { protect, adminOnly } = require('../middleware/auth');

// ─────────────────────────────────────────────────────────────
// @route   GET /api/competitions
// @desc    Get all competitions (public)
// @access  Public
// ─────────────────────────────────────────────────────────────
router.get('/', async (req, res) => {
  try {
    const { category, status, search } = req.query;

    let query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organizer: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const competitions = await Competition.find(query)
      .sort({ deadline: 1 })
      .populate('createdBy', 'name email');

    return res.status(200).json({
      success: true,
      count: competitions.length,
      competitions
    });
  } catch (err) {
    console.error('Get competitions error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch competitions.' });
  }
});

// ─────────────────────────────────────────────────────────────
// @route   GET /api/competitions/:id
// @desc    Get single competition by ID
// @access  Public
// ─────────────────────────────────────────────────────────────
router.get('/:id', async (req, res) => {
  try {
    let competition = null;
    if (mongoose.Types.ObjectId.isValid(req.params.id)) {
      competition = await Competition.findById(req.params.id).populate('createdBy', 'name');
    }

    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found.' });
    }

    return res.status(200).json({ success: true, competition });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch competition details.' });
  }
});

// ─────────────────────────────────────────────────────────────
// @route   POST /api/competitions
// @desc    Create new design event / competition (Admin only)
// @access  Private + Admin
// ─────────────────────────────────────────────────────────────
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      title,
      organizer,
      organizerLogo,
      organizerColor,
      category,
      deadline,
      startDate,
      prizePool,
      prizes,
      eligibility,
      description,
      deliverables,
      judgingCriteria,
      bannerImage,
      tags,
      featured
    } = req.body;

    if (!title || !organizer || !category || !deadline || !description) {
      return res.status(400).json({ success: false, message: 'Title, organizer, category, deadline, and description are required.' });
    }

    const competition = await Competition.create({
      title,
      organizer,
      organizerLogo: organizerLogo || organizer.substring(0, 3).toUpperCase(),
      organizerColor: organizerColor || 'from-indigo-600 to-purple-600',
      category,
      deadline: new Date(deadline),
      startDate: startDate ? new Date(startDate) : new Date(),
      prizePool: prizePool || 'TBD',
      prizes: prizes || [],
      eligibility: eligibility || 'Open to all Design Students',
      description,
      deliverables: deliverables || [],
      judgingCriteria: judgingCriteria || [],
      bannerImage: bannerImage || 'https://images.unsplash.com/photo-1542744094-3a3121699563?auto=format&fit=crop&w=1200&q=80',
      tags: tags || [],
      featured: featured || false,
      createdBy: req.user._id
    });

    return res.status(201).json({
      success: true,
      message: `Competition "${title}" published successfully!`,
      competition
    });
  } catch (err) {
    console.error('Create competition error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to create competition.' });
  }
});

// ─────────────────────────────────────────────────────────────
// @route   PUT /api/competitions/:id
// @desc    Update competition (Admin only)
// @access  Private + Admin
// ─────────────────────────────────────────────────────────────
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Competition not found.' });
    }

    const competition = await Competition.findById(req.params.id);

    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found.' });
    }

    const updated = await Competition.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    return res.status(200).json({ success: true, message: 'Competition updated!', competition: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update competition.' });
  }
});

// ─────────────────────────────────────────────────────────────
// @route   DELETE /api/competitions/:id
// @desc    Delete competition (Admin only)
// @access  Private + Admin
// ─────────────────────────────────────────────────────────────
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ success: false, message: 'Competition not found.' });
    }

    const competition = await Competition.findById(req.params.id);

    if (!competition) {
      return res.status(404).json({ success: false, message: 'Competition not found.' });
    }

    await Competition.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true, message: 'Competition deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to delete competition.' });
  }
});

module.exports = router;
