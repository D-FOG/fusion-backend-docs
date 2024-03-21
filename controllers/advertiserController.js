// controllers/advertiserController.js
const advertiserService = require('../services/advertiserService');
const { identitySchema, businessDescriptionSchema, serviceSchema } = require('../validations/advertiserValidation');
const Advertiser = require('../models/advertiserModel');
const User = require('../models/User');
const multer = require('multer');

const upload = multer();


const createAdvertiser = async (req, res) => {
  try {
    // Use multer to handle form-data
    upload.any()(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload error', details: err.message });
      }

      const identityValidation = identitySchema.validate(req.body.identity);
      const businessDescriptionValidation = businessDescriptionSchema.validate(req.body.businessDescription);
      const servicesValidation = serviceSchema.validate(req.body.services);
  
      if (identityValidation.error || businessDescriptionValidation.error || servicesValidation.error) {
            return res.status(400).json({ error: 'Validation error', details: identityValidation.error || businessDescriptionValidation.error || servicesValidation.error });
      }

       //Find user by email
       const user = await User.findOne({ email: req.body.identity.email });
       if (!user) {
         return res.status(400).json({ error: 'User not found', details: 'User with the provided email does not exist' });
       }

      const existingEmailBuilder = await Advertiser.findOne({ 'identity.email': req.body.identity.email });
      const existingPhoneBuilder = await Advertiser.findOne({ 'identity.phoneNumber': req.body.identity.phoneNumber });

      if (existingEmailBuilder) {
            return res.status(400).json({ error: 'Validation error', details: 'Email already exists' });
      } 

      if (existingPhoneBuilder) {
            return res.status(400).json({ error: 'Validation error', details: 'Phone number already exists' });
      }

      // Access uploaded files via req.files
      let profilePictureData;
      let profilePictureContentType;
      if (req.files && req.files.length > 0) {
        profilePictureData = req.files[0].buffer;
        profilePictureContentType = req.files[0].mimetype;
      }

      // Create advertiser
      const advertiserData = {
        user: user._id, // Associate builder with user
        identity: {
          ...req.body.identity,
          // Add profilePicture field
          profilePicture: profilePictureData ? {
            data: profilePictureData,
            contentType: profilePictureContentType,
          } : undefined,
        },
        businessDescription: req.body.businessDescription,
        services: req.body.services
      };

      
      const newAdvertiser = await advertiserService.createAdvertiser(advertiserData);

      // Update user's role to "builder"
      await User.findByIdAndUpdate(user._id, { role: 'advertiser' });

      res.status(201).json(newAdvertiser);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
  
  

const getAdvertiserById = async (req, res) => {
  try {
    const advertiserId = req.params.id;

    // Fetch advertiser from the service
    const advertiser = await advertiserService.getAdvertiserById(advertiserId);

    if (!advertiser) {
      return res.status(404).json({ error: 'Advertiser not found' });
    }

    res.status(200).json(advertiser);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllAdvertisers = async (req, res) => {
  try {
    // Fetch all advertisers from the service
    const advertisers = await advertiserService.getAllAdvertisers();

    res.status(200).json(advertisers);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  createAdvertiser,
  getAdvertiserById,
  getAllAdvertisers
};
