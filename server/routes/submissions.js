const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Competition = require('../models/Competition');
const { protect, adminOnly } = require('../middleware/auth');

const STUDENT_STATUSES = ['Draft', 'Submitted'];
const ADMIN_STATUSES = ['Submitted', 'Under Process', 'Confirmed', 'Rejected'];

// ─────────────────────────────────────────────────────────────
// @route   GET /api/submissions
// @desc    Get submissions - admin sees all, student sees own
// @access  Private
// ─────────────────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      query.studentId = req.user._id;
    }

    const submissions = await Submission.find(query)
      .sort({ submittedAt: -1 })
      .populate('competitionId', 'title organizer deadline category')
      .populate('studentId', 'name email avatar institution');

    return res.status(200).json({ success: true, count: submissions.length, submissions });
  } catch (err) {
    console.error('Get submissions error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to fetch submissions.' });
  }
});

// ─────────────────────────────────────────────────────────────
// @route   GET /api/submissions/:id
// @desc    Get single submission
// @access  Private
// ─────────────────────────────────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id)
      .populate('competitionId', 'title organizer deadline')
      .populate('studentId', 'name email avatar');

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }

    // Students can only view their own submissions
    if (req.user.role === 'student' && submission.studentId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this submission.' });
    }

    return res.status(200).json({ success: true, submission });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to fetch submission.' });
  }
});

// ─────────────────────────────────────────────────────────────
// @route   POST /api/submissions
// @desc    Create new submission (Student)
// @access  Private
// ─────────────────────────────────────────────────────────────
router.post('/', protect, async (req, res) => {
  try {
    const {
      competitionId,
      projectTitle,
      tagline,
      category,
      summary,
      status,
      files,
      links
    } = req.body;

    if (req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Only student accounts can submit projects.' });
    }

    if (!competitionId || !projectTitle || !summary) {
      return res.status(400).json({ success: false, message: 'Competition ID, project title, and summary are required.' });
    }

    // Robust competition lookup
    let competition = null;
    if (mongoose.Types.ObjectId.isValid(competitionId)) {
      competition = await Competition.findById(competitionId);
    }
    if (!competition && req.body.competitionTitle) {
      competition = await Competition.findOne({ title: req.body.competitionTitle });
    }
    if (!competition) {
      competition = await Competition.findOne();
    }

    if (!competition) {
      return res.status(404).json({ success: false, message: 'No active competition found to link submission to.' });
    }

    const submissionStatus = STUDENT_STATUSES.includes(status) ? status : 'Submitted';

    const submission = await Submission.create({
      competitionId: competition._id,
      competitionTitle: competition.title,
      organizer: competition.organizer,
      studentId: req.user._id,
      studentName: req.user.name,
      studentEmail: req.user.email,
      studentAvatar: req.user.avatar || '',
      projectTitle: projectTitle.trim(),
      tagline: tagline || '',
      category: category || competition.category,
      summary: summary.trim(),
      status: submissionStatus,
      files: files || [],
      links: links || [],
      submittedAt: new Date()
    });

    // Increment submission count on competition
    await Competition.findByIdAndUpdate(competition._id, { $inc: { submissionCount: 1 } });

    return res.status(201).json({
      success: true,
      message: `Submission for "${competition.title}" received!`,
      submission
    });
  } catch (err) {
    console.error('Create submission error:', err.message);
    return res.status(500).json({ success: false, message: 'Failed to create submission.' });
  }
});

// ─────────────────────────────────────────────────────────────
// @route   PUT /api/submissions/:id
// @desc    Edit submission (Student - before deadline)
// @access  Private
// ─────────────────────────────────────────────────────────────
router.put('/:id', protect, async (req, res) => {
  try {
    const submission = await Submission.findById(req.params.id);

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }

    if (req.user.role !== 'student') {
      return res.status(403).json({ success: false, message: 'Only the student owner can edit project details. Admins can update status separately.' });
    }

    // Ownership check for students
    if (submission.studentId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this submission.' });
    }

    if (req.body.status && !STUDENT_STATUSES.includes(req.body.status)) {
      return res.status(400).json({ success: false, message: 'Students can only save Draft or Submitted status.' });
    }

    const updates = {
      projectTitle: req.body.projectTitle,
      tagline: req.body.tagline,
      summary: req.body.summary,
      status: req.body.status,
      files: req.body.files,
      links: req.body.links
    };

    // Remove undefined keys
    Object.keys(updates).forEach(k => updates[k] === undefined && delete updates[k]);

    const updated = await Submission.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });

    return res.status(200).json({ success: true, message: 'Submission updated!', submission: updated });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update submission.' });
  }
});

// ─────────────────────────────────────────────────────────────
// @route   PUT /api/submissions/:id/status
// @desc    Update submission status & jury notes (Admin only)
// @access  Private + Admin
// ─────────────────────────────────────────────────────────────
router.put('/:id/status', protect, adminOnly, async (req, res) => {
  try {
    const { status, evaluatorNotes } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    if (!ADMIN_STATUSES.includes(status)) {
      return res.status(400).json({ success: false, message: `Status must be one of: ${ADMIN_STATUSES.join(', ')}.` });
    }

    const submission = await Submission.findByIdAndUpdate(
      req.params.id,
      { status, evaluatorNotes: evaluatorNotes || undefined },
      { new: true, runValidators: true }
    );

    if (!submission) {
      return res.status(404).json({ success: false, message: 'Submission not found.' });
    }

    return res.status(200).json({
      success: true,
      message: `Submission status updated to "${status}".`,
      submission
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Failed to update status.' });
  }
});

module.exports = router;
