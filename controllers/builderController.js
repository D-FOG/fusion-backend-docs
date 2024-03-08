// controllers/builderController.js
const builderService = require('../services/builderServices');
const {skillSchema, identitySchema} = require('../validations/builderValidation');
const Builder = require('../models/builderModel');
const User = require('../models/User');
const multer = require('multer');

const upload = multer();
// Define your builder controller functions here
const createBuilder = async (req, res) => {
  try {
    // Use multer to handle form-data
    upload.any()(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload error', details: err.message });
      }

      // Validate request data
      const skillValidation = skillSchema.validate(req.body.skills);
      const identityValidation = identitySchema.validate(req.body.identity);

      if (skillValidation.error || identityValidation.error) {
        return res.status(400).json({ error: 'Validation error', details: skillValidation.error || identityValidation.error });
      }

      // Find user by email
      const user = await User.findOne({ email: req.body.identity.email });
      if (!user) {
        return res.status(400).json({ error: 'User not found', details: 'User with the provided email does not exist' });
      }

      const existingEmailBuilder = await Builder.findOne({ 'identity.email': req.body.identity.email });
      const existingPhoneBuilder = await Builder.findOne({ 'identity.phoneNumber': req.body.identity.phoneNumber });

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

      const builderData = {
        user: user._id, // Associate builder with user
        skills: req.body.skills,
        identity: {
          ...req.body.identity,
          // Add profilePicture field if available
          profilePicture: profilePictureData ? {
            data: profilePictureData,
            contentType: profilePictureContentType,
          } : undefined,
        },
      };

      const newBuilder = await builderService.createBuilder(builderData);
      
      // Update user's role to "builder"
      await User.findByIdAndUpdate(user._id, { role: 'builder' });

      res.status(201).json(newBuilder);
    });
  } catch (error) {
    console.error('Error creating builder:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getBuilderById = async (req, res) => {
  try {
    const { id } = req.params;

    // Use the service function to find a builder by ID
    const result = await builderService.getBuilderById(id);

    if (!result) {
      // If no builder is found with the given ID, send a 404 Not Found response
      return res.status(404).json({ message: 'Builder not found' });
    }

    // Respond with the fetched builder
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

const getAllBuilders = async (req, res) => {
  try {
    // Use the service function to get all builders
    const builders = await builderService.getAllBuilders();

    // Respond with the list of builders
    res.json(builders);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = {
  // Controller functions
  createBuilder,
  getBuilderById,
  getAllBuilders
};
