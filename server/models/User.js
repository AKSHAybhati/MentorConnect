const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  profilePicture: {
    type: String,
    default: ''
  },
  headline: {
    type: String,
    default: ''
  },
  summary: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    default: ''
  },
  userType: {
    type: String,
    enum: ['mentee', 'mentor'],
    required: true
  },
  experience: [{
    title: String,
    company: String,
    location: String,
    startDate: Date,
    endDate: Date,
    current: Boolean,
    description: String
  }],
  education: [{
    school: String,
    degree: String,
    fieldOfStudy: String,
    startDate: Date,
    endDate: Date,
    description: String
  }],
  skills: [String],
  interests: [String],
  connections: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  mentorshipAreas: [String], // For mentors
  careerGoals: [String], // For mentees
  availability: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  },
  isRetired: {
    type: Boolean,
    default: false
  },
  yearsOfExperience: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);