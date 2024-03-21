// controllers/paymentController.js

const paystack = require('paystack')(process.env.Test_Secret_Key_Paystack);
const userService = require('../services/paymentService');
const builderService = require('../services/paymentService');
const hirerService = require('../services/paymentService');
const advertiserService = require('../services/paymentService');
const subscriptionService =require('../services/paymentService')
const User = require('../models/User');
//const SubscriptionDetails = require('../models/subscriptionPlan')

let sharedFirstname;
let sharedLastname;
let userId;

// Controller function to initiate payment
exports.initiatePayment = async (req, res) => {
  try {
    const { email, amount } = req.body;

    // Check if user exists
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(400).json({ error: 'User not found or registration incomplete' });
    }

    // Get user's role and ID
    const { role, _id } = user;
    userId = _id;
    // Initialize response data
    let responseData = {};

    // Get user's first name and last name based on role
    switch (role) {
      case 'builder':
        const builder = await builderService.getBuilderByUserId(userId);
        if (builder) {
          sharedFirstname = builder.identity.firstName;
          sharedLastname = builder.identity.lastName;
        }
        break;
      case 'hirer':
        const hirer = await hirerService.getHirerByUserID(userId);
        if (hirer) {
          sharedFirstname = hirer.identity.firstName;
          sharedLastname = hirer.identity.lastName;
        }
        break;
      case 'advertiser':
        const advertiser = await advertiserService.getAdvertiserByUserID(userId);
        if (advertiser) {
          sharedFirstname = advertiser.identity.firstName;
          sharedLastname = advertiser.identity.lastName;
        }
        break;
      default:
        return res.status(400).json({ error: 'Invalid or unsupported user role' });
    }

    // Initialize payment with Paystack
    const paymentData = {
      email: email,
      amount: amount * 100, // Paystack amount is in kobo (multiply by 100 for Naira)
      firstName: sharedFirstname,
      lastName: sharedLastname,
      reference: `${sharedFirstname}-${sharedLastname}-${Date.now()}`, // Generate unique reference
      callback_url: `http://localhost:8000/user/pay/callback` // Callback URL
    };

    // Make API call to Paystack to initialize payment
    const response = await paystack.transaction.initialize(paymentData);

    // Return payment authorization URL to frontend
    res.status(200).json(response);
    //res.json({ authorization_url: response.data.authorization_url });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller function to handle payment callback
exports.paymentCallback = async (req, res) => {
  try {
    const { reference } = req.body;
   
    // Verify transaction status with Paystack
    const response = await paystack.transaction.verify(reference);

    // Send response back to Paystack
    const status = response.data.status;
    const amount = parseInt(response.data.amount) / 100;

    let plan;

    switch(amount){
      case 2600:
        plan = "basic";
        break;
      case 1400:
        plan = "social media influencer";
        break;
      case 4900:
        plan = "forex and crypto";
        break;
      default:
        plan = "unknown";
    }
    const subscriptionData = {
      status: response.data.gateway_response,
      transactionDate: response.data.paid_at,
      firstname: sharedFirstname,
      lastname: sharedLastname,
      amount,
      plan,
      userId
    }

    const subscriptionData2 = {
      status: response.data.gateway_response,
      transactionDate: response.data.created_at,
      firstname: sharedFirstname,
      lastname: sharedLastname,
      amount,
      plan,
      userId
    }
    let newSubscription;
    let userPlan

    switch  (status) {
      case 'success':
        newSubscription = await subscriptionService.createSubscription(subscriptionData);
        // Update user's plan and status to "builder"
        userPlan = await User.findByIdAndUpdate(userId, { subscriptionPlan: plan, subscriptionStatus: response.data.gateway_response});
        break;
      case  'failed':
        newSubscription = await subscriptionService.createSubscription(subscriptionData2)
        break;
      default:
        return res.status(400).json({error: 'An error ocurred while storin data'});
    }
    
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller function to handle GET request for payment callback
exports.paymentCallbackGet = async (req, res) => {
  try {
    // Extract data from the URL parameters
    const { reference } = req.query;

    // You can then process the extracted data as needed

    // Respond with a success message
    res.status(200).json({ message: 'Payment callback GET endpoint reached', reference });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
