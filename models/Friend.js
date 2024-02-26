const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  friends: {
    type: Array,
    default: [],
  },
  friendRequest: {
    type: Array,
    default: [],
  },
  pendingRequest: {
    type: Array,
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
});
module.exports = mongoose.model('Friend', friendSchema);
