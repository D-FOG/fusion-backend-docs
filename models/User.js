const mongoose = require('mongoose');
// create user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /\S+@\S+\.\S+/.test(v); // Check for valid email format
      },
      message: props => `${props.value} is not a valid email address!`
    }
  },
  isCompleted: {
    type: Boolean,
    required: function () {
      return this.isGoogleSignin === false;
    }
  },
  password: {
    type: String,
    required: function () {
      return this.isGoogleSignin === false;
    }
  },
  date: {
    type: Date,
    default: Date.now
  },
  ref: {
    type: String,
    required: false
  },
  referredUsers: {
    type: Array,
    default: []
  },
  referedBy: {
    type: String,
    required: false
  },
  isGoogleSignin: {
    type: Boolean,
    default: false,
    required: false
  },
  role: {
    type: String,
    enum: ['user', 'builder', 'hirer', 'advertiser'], // Add other roles as needed
    default: 'user' // Default role is 'user'
  }
});

module.exports = mongoose.model('User', userSchema);
