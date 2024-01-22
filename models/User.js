const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /\S+@\S+\.\S+/.test(v); // Check for valid email format
      },
      message: props => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  referralId: {
    type: String,
    required: true,
  },
  uplineId: {
    type: String,
    default: 'default',

  },
  is_admin: {
    type: Boolean,
    required: true,
  },
  userId: {
    type: Number,
    required: true,
  },
  regDate: {
    type: Date,
    required: true,
  },
  earnings: {
    type: Number,
    required: true,
  },
  withdrawals: {
    type: Number,
    required: true,
  },
  accountBalance: {
    type: Number,
    required: true,
  },
  activeInvestment: {
    type: Number,
    required: true,
  },
  pendingWithdrawal: {
    type: Number,
    required: true,
  },
  totalDeposit: {
    type: Number,
    required: true,
  },
  referralEarnings: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  otpcode: {
    type: Number,
    required: true,
  },
  bitcoinAddress: {
    type: String,
    default: 'default',
    required: true,
  },
  usdtAddress: {
    type: String,
    default: 'default',
    required: true,
  },
  ethereumAddress: {
    type: String,
    default: 'default',
    required: true,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
