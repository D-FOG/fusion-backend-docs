// models/hirerModel.js
const mongoose = require('mongoose');

const hirerSchema = new mongoose.Schema({
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
  jobPosting: {
    jobTitle: { type: String, },
    jobCategory: { type: String, },
    jobDescription: { type: String, },
    projectType: { type: String, },
    tags: [{ type: String }],
    jobLocation: { type: String, },
    budget: { type: Number, }
  }
});

const Hirer = mongoose.model('Hirer', hirerSchema);

module.exports = Hirer;
