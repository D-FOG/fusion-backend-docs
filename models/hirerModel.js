// models/hirerModel.js
const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  jobTitle: { type: String, },
  jobCategory: { type: String, },
  jobDescription: { type: String, },
  projectType: { type: String, },
  tags: [{ type: String }],
  jobLocation: { type: String, },
  budget: { type: Number, },
  dateAdded: { type: Date, default: Date.now }
});

const hirerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  identity: {
    profilePicture: {
      data: Buffer,
      contentType: String,
    },
    firstName: { type: String, },
    lastName: { type: String, },
    email: { type: String, },
    phoneNumber: { type: String, },
    description: { type: String, },
    occupation: { type: String, },
    gender: { type: String, },
    birthday: { type: String, },
    address: {
      state: { type: String, },
      city: { type: String, }
    }
  },
  jobPostings: [jobPostingSchema],
  createdAt: { type: Date, default: Date.now }
});

const Hirer = mongoose.model('Hirer', hirerSchema);

module.exports = Hirer;
