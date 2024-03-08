// services/builderService.js
const Builder = require('../models/builderModel');

// Define your builder service functions here
const createBuilder = async (builderData) => {
    const builder = new Builder(builderData);
    return builder.save();
  };

const getBuilderById = async (builderId) => {
  return Builder.findById(builderId);
};

const getAllBuilders = async () => {
  return Builder.find();
};

module.exports = {
  // Service functions
  createBuilder,
  getBuilderById,
  getAllBuilders
};
