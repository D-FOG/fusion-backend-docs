// services/builderService.js

const Builder = require('../models/builderModel');
const Hirer = require( '../models/hirerModel' );
const Advertiser = require('../models/advertiserModel');
const User = require('../models/User');
const Subscription = require('../models/subscriptionPlan');

// Service function to get user by email
exports.getUserByEmail = async (email) => {
    return User.findOne({ email: email });
  };

// Service function to get builder by user ID
exports.getBuilderByUserId = async (userId) => {
  return Builder.findOne({ user: userId });
};

exports.getHirerByUserID = async (userId) => {
    return Hirer.findOne({user: userId})
}

exports.getAdvertiserByUserID = async (userId) => {
    return Advertiser.findOne({user: userId})
}

//Service funtion to create pricing record schema
exports.createSubscription = async(subscriptionData) => {
  const subscription = new Subscription(subscriptionData);
  return subscription.save();
}