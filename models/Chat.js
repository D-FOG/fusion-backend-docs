// Chat model

const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    user2: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    status: {
      type: String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Chat', ChatSchema);
