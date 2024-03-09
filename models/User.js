const mongoose = require('mongoose');

// create user schema
const experienceSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, default: mongoose.Types.ObjectId },
  jobTitle: { type: String, required: true },
  company: { type: String, required: true },
  yearStart: { type: Number, required: true },
  yearEnd: { type: Number },
  location: { type: String },
  description: { type: String }
});

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


  bio: {
    type: String,
    required: false
  },
  phone: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
  experiences : [experienceSchema],
  mywork: {
    title: {
      type: String,
      required: false
    },
    description: {
      type: String,
      required: false
    },
    content: {
      type: String,
      required: false
    },
  },
  socialLinks: {
    facebook: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    tiktok: { type: String },
    github: { type: String },
    behance: { type: String },
    dribble: { type: String }
  },
  topSkills: {
    image: { type: String },
    title: { type: String },
    description: { type: String },
    tags: [{ type: String }]
  }
}, {timestamps: true});
//export the user schema
module.exports = mongoose.model('User', userSchema);
