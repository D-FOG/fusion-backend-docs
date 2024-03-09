// services/advertiserService.js
const Advertiser = require('../models/advertiserModel');

const createAdvertiser = async (advertiserData) => {
  const advertiser = new Advertiser(advertiserData);
  return advertiser.save();
};

const getAdvertiserById = async (advertiserId) => {
  return Advertiser.findById(advertiserId);
};

const getAllAdvertisers = async () => {
  return Advertiser.find();
};

module.exports = {
  createAdvertiser,
  getAdvertiserById,
  getAllAdvertisers
};
