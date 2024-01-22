const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Deposit = mongoose.model('Deposit', depositSchema);

module.exports = Deposit;
