const mongoose = require('mongoose');

const transferSchema = new mongoose.Schema({
  receipient_name: {
    type: String,
    required: true,
  },
  account_number: {
    type: String,
    required: true,
  },
  purpose: {
    type: String,   
  },
  city: {
    type: String,   
  },
  street: {
    type: String,
  },
  nickname: {
    type: String,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
  },
  email: {
    type: String,
  },
  IBAN: {
    type: String,
  },
  swift: {
    type: String,
  },
  status: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
  },
});

const Transfer = mongoose.model('Transfer', transferSchema);

module.exports = Transfer;
