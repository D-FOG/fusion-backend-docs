const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
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
  pendingWithdrawal: {
    type: Number,
    required: true,
  },
  totalDeposit: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  country: {
    type: String,
  },
  residential_address: {
    type: String,
  },
  state: {
    type: String,
  },
  next_of_kin: {
    type: String,
  },
  otpcode: {
    type: Number,
    required: true,
  },
  accountNumber: {
    type: Number,
    default: 1111111111,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;
