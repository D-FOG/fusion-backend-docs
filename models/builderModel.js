// models/builderModel.js
const mongoose = require('mongoose');

const builderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  skills: [{
    skill: { type: String },
    category: { type: String },
    subSkills: [{ type: String }]
  }],
  identity: {
    profilePicture: {
      url: String,
      name: String,
    },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phoneNumber: { type: String },
    description: { type: String },
    occupation: { type: String },
    gender: { type: String },
    birthday: { type: String },
    address: {
      state: { type: String },
      city: { type: String }
    }
  },
  createdAt: { type: Date, default: Date.now }
});

const Builder = mongoose.model('Builder', builderSchema);

module.exports = Builder;
