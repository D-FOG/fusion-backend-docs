const mongoose = require('mongoose');

const ReferralSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    referredUsers: {
      type: Array,
      required: true
    },
    earnings: {
      type: Number,
      default: 0
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Referral', ReferralSchema);
