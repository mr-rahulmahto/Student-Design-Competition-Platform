const mongoose = require('mongoose');

const SubmissionSchema = new mongoose.Schema({
  competitionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Competition',
    required: [true, 'Competition reference is required']
  },
  competitionTitle: {
    type: String,
    required: true
  },
  organizer: {
    type: String,
    default: ''
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Student reference is required']
  },
  studentName: {
    type: String,
    required: true
  },
  studentEmail: {
    type: String,
    required: true
  },
  studentAvatar: {
    type: String,
    default: ''
  },
  projectTitle: {
    type: String,
    required: [true, 'Project title is required'],
    maxlength: [200, 'Project title cannot exceed 200 characters']
  },
  tagline: {
    type: String,
    default: '',
    maxlength: [300, 'Tagline cannot exceed 300 characters']
  },
  category: {
    type: String,
    default: 'UI/UX Design'
  },
  summary: {
    type: String,
    required: [true, 'Project summary is required'],
    maxlength: [3000, 'Summary cannot exceed 3000 characters']
  },
  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Under Process', 'Confirmed', 'Rejected'],
    default: 'Draft'
  },
  files: [
    {
      name: { type: String },
      size: { type: String },
      type: { type: String },   // 'image' or 'pdf'
      url: { type: String }
    }
  ],
  links: [
    {
      label: { type: String },
      url: { type: String }
    }
  ],
  evaluatorNotes: {
    type: String,
    default: 'Submission received. Pending admin review.'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Prevent duplicate submission per student per competition
SubmissionSchema.index({ competitionId: 1, studentId: 1 }, { unique: false });

module.exports = mongoose.model('Submission', SubmissionSchema);
