const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  profit: {
    type: Number,
    required: true,
  },
  maximum_amount: {
    type: Number,
    required: true,
  },
  minimum_amount: {
    type: Number,
    required: true,
  },
});

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
