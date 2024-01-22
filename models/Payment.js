const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  transactionId: {
    type: Number,
    required: true,
  },
  planId: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
  },
  status: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
