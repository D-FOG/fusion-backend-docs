// routes/paymentRoutes.js

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Route to initiate payment
router.post('/pay', paymentController.initiatePayment);

// Route to handle payment callback
router.post('/pay/callback', paymentController.paymentCallback);

// GET route for handling payment callback (optional)
router.get('/pay/callback', paymentController.paymentCallbackGet);


module.exports = router;