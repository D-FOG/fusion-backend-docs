// controllers/hirerController.js
const hirerService = require('../services/hirerService');
const { identitySchema, jobPostingSchema } = require('../validations/hirerValidation');
const Hirer = require('../models/hirerModel');
const User = require('../models/User');
const multer = require('multer');

const upload = multer();

const createHirer = async (req, res) => {
  try {
    // Use multer to handle form-data
    upload.any()(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload error', details: err.message });
      }

      // Validate request data
      const identityValidation = identitySchema.validate(req.body.identity);
      const jobPostingValidation = jobPostingSchema.validate(req.body.jobPosting);

      //Find user by email
      const user = await User.findOne({ email: req.body.identity.email });
      if (!user) {
        return res.status(400).json({ error: 'User not found', details: 'User with the provided email does not exist' });
      }


      if (identityValidation.error || jobPostingValidation.error) {
        return res.status(400).json({ error: 'Validation error', details: identityValidation.error || jobPostingValidation.error });
      }

      const existingEmailBuilder = await Hirer.findOne({ 'identity.email': req.body.identity.email });
      const existingPhoneBuilder = await Hirer.findOne({ 'identity.phoneNumber': req.body.identity.phoneNumber });

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

      // Create hirer
      const hirerData = {
        user: user._id, // Associate builder with user
        identity: {
          ...req.body.identity,
          // Add profilePicture field
         // Add profilePicture field if available
          profilePicture: profilePictureData ? {
            data: profilePictureData,
            contentType: profilePictureContentType,
          } : undefined,
        },
        jobPostings: req.body.jobPostings
      };

      const newHirer = await hirerService.createHirer(hirerData);

      // Update user's role to "builder"
      await User.findByIdAndUpdate(user._id, { role: 'hirer' });

      res.status(201).json(newHirer);
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getHirerById = async (req, res) => {
    try {
      const hirerId = req.params.id;
  
      // Fetch hirer from the service
      const hirer = await hirerService.getHirerById(hirerId);
  
      if (!hirer) {
        return res.status(404).json({ error: 'Hirer not found' });
      }
  
      res.status(200).json(hirer);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  const getAllHirers = async (req, res) => {
    try {
      // Fetch all hirers from the service
      const hirers = await hirerService.getAllHirers();
  
      res.status(200).json(hirers);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  

module.exports = {
  createHirer,
  getHirerById,
  getAllHirers
};
