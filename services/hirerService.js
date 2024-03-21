// services/hirerService.js
const Hirer = require('../models/hirerModel');

const createHirer = async (hirerData) => {
  const hirer = new Hirer(hirerData);
  return hirer.save();
};

const getHirerById = async (hirerId) => {
    return Hirer.findById(hirerId);
  };
  
  const getAllHirers = async () => {
    return Hirer.find();
  };

module.exports = {
  createHirer,
  getHirerById,
  getAllHirers
};
