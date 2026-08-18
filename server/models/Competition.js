const mongoose = require('mongoose');

const CompetitionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Competition title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  organizer: {
    type: String,
    required: [true, 'Organizer name is required'],
    trim: true
  },
  organizerLogo: {
    type: String,
    default: 'DP'
  },
  organizerColor: {
    type: String,
    default: 'from-indigo-600 to-purple-600'
  },
  category: {
    type: String,
    enum: ['UI/UX Design', 'Product/Industrial', 'Graphic & Brand', 'Architecture', 'Service Design', 'Game Design', 'Fashion Design'],
    required: [true, 'Category is required']
  },
  status: {
    type: String,
    enum: ['Open', 'Closing Soon', 'Upcoming', 'Closed'],
    default: 'Open'
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  prizePool: {
    type: String,
    default: 'TBD'
  },
  prizes: [
    {
      rank: { type: String },
      reward: { type: String }
    }
  ],
  eligibility: {
    type: String,
    default: 'Open to all Design Students'
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  deliverables: {
    type: [String],
    default: []
  },
  judgingCriteria: [
    {
      name: { type: String },
      weight: { type: String }
    }
  ],
  bannerImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1542744094-3a3121699563?auto=format&fit=crop&w=1200&q=80'
  },
  tags: {
    type: [String],
    default: []
  },
  featured: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  submissionCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Auto-update status based on deadline
CompetitionSchema.pre('save', function () {
  const now = new Date();
  const deadline = new Date(this.deadline);
  const diffDays = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));

  if (deadline < now) {
    this.status = 'Closed';
  } else if (diffDays <= 10) {
    this.status = 'Closing Soon';
  } else if (new Date(this.startDate) > now) {
    this.status = 'Upcoming';
  } else {
    this.status = 'Open';
  }
});

module.exports = mongoose.model('Competition', CompetitionSchema);
