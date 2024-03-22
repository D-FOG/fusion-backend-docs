// models/advertiserModel.js
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  serviceTitle: { type: String, },
  serviceDescription: { type: String, },
  serviceImage: { type: String, }, // Assuming image is a URL, adjust as needed
  dateAdded: { type: Date, default: Date.now }
});

const advertiserSchema = new mongoose.Schema({
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
  businessDescription: {
    businessTitle: { type: String, },
    businessDescription: { type: String, }
  },
  services: [serviceSchema],
  createdAt: { type: Date, default: Date.now }
});

const Advertiser = mongoose.model('Advertiser', advertiserSchema);

module.exports = Advertiser;
