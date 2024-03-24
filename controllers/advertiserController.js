// controllers/advertiserController.js
const advertiserService = require('../services/advertiserService');
const { identitySchema, businessDescriptionSchema, serviceSchema } = require('../validations/advertiserValidation');
const Advertiser = require('../models/advertiserModel');
const User = require('../models/User');
const multer = require('multer');
const { uploadObject } = require('../utils/s3');

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Invalid image format. Allowed formats are .jpeg and .png'), false); // Reject the file
  }
};
 
const upload = multer({  
  fileFilter, 
  limits: {fileSize: 1024 * 1024 * 2} // 2MB
});


const createAdvertiser = async (req, res) => {
  try {
    // Use multer to handle form-data
    upload.fields([{ name: 'profilePicture', maxCount: 1 }, { name: 'serviceImages'}])
    (req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: 'File upload error', details: err.message });
      }
      
      if (req.body.identity) {
        try {
          req.body.identity = JSON.parse(req.body.identity)
        }catch(err) {
          return res.status(422).json({message: 'identity should be a JSON array'})
        }
      }

      if (req.body.businessDescription) {
        try {
          req.body.businessDescription = JSON.parse(req.body.businessDescription)
        }catch(err) {
          return res.status(422).json({message: 'businessDescription should be a JSON array'})
        }
      }

      if (req.body.services) {
        try {
          req.body.services = JSON.parse(req.body.services)
        }catch(err) {
          return res.status(422).json({message: 'services should be a JSON array'})
        }
      }

      let servicesValidation;
      const identityValidation = identitySchema.validate(req.body.identity);
      const businessDescriptionValidation = businessDescriptionSchema.validate(req.body.businessDescription);
      if(req.body?.services?.length) servicesValidation = serviceSchema.validate(req.body.services);
  
      if (identityValidation.error || businessDescriptionValidation.error || servicesValidation?.error) {
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
      let serviceWithUploadedImage;
      if (req.files) {
        if(req.files?.profilePicture.length) {
          profilePictureData = await uploadObject(req.files.profilePicture[0])
        }
      
        if(req.body?.services?.length && req.files?.serviceImages) {
          const completeServiceObjs = req.body.services.map((service) => {
            const serviceImage = req.files?.serviceImages.find((image) => image.originalname === service.imageName)
            if(serviceImage) return {...service, serviceImage}
            else return service
          })

          serviceWithUploadedImage = await Promise.all(completeServiceObjs.map(async (service) => {
            if(service.serviceImage) {
              const imageObj = await uploadObject(service.serviceImage)
              return {...service, serviceImage: imageObj}
            }
            return service
          }))
        }
      }

      // Create advertiser
      const advertiserData = {
        user: user._id, // Associate builder with user
        identity: {
          ...req.body.identity,
          // Add profilePicture field
          profilePicture: profilePictureData ? {
            url: profilePictureData.url,
            name: profilePictureData.name,
          } : undefined,
        },
        businessDescription: req.body.businessDescription,
        services: serviceWithUploadedImage
      };
      
      const newAdvertiser = await advertiserService.createAdvertiser(advertiserData);

      // Update user's role to "builder"
      await User.findByIdAndUpdate(user._id, { role: 'advertiser', isCompletedProfile: true });

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
