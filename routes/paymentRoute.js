// routes/paymentRoutes.js

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: API endpoints related to payments
 */
/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentInitiation:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           description: Email of the user initiating the payment
 *           example: john@example.com
 *         amount:
 *           type: number
 *           description: Amount to be paid in Naira
 *           example: 1000
 *       required:
 *         - email
 *         - amount
 *
 *     PaymentCallback:
 *       type: object
 *       properties:
 *         reference:
 *           type: string
 *           description: Reference code for the payment transaction
 *           example: REF123456789
 *       required:
 *         - reference
 */

/**
 * @swagger
*   /user/pay:
*     post:
*       summary: Initiate Payment
*       description: Initiates a payment process with Paystack.
*       tags: [Payments]
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 email:
*                   type: string
*                   description: Email of the user initiating the payment
*                   example: john@example.com
*                 amount:
*                   type: number
*                   description: Amount to be paid in Naira
*                   example: 1000
*               required:
*                 - email
*                 - amount
*       responses:
*         200:
*           description: Payment initiated successfully. Returns authorization URL from Paystack.
*           content:
*             application/json:
*               schema:
*                 type: object
*                 properties:
*                   authorization_url:
*                     type: string
*                     description: URL to redirect the user to authorize the payment
*                     example: https://paystack.com/authorize_payment
*         400:
*           description: Bad request. User not found or registration incomplete.
*         500:
*           description: Internal server error.
* @swagger
*   /user/pay/callback:
*     post:
*       summary: Handle Payment Callback
*       description: Handles the callback from Paystack after a payment is made.
*       tags: [Payments]
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 reference:
*                   type: string
*                   description: Reference code for the payment transaction
*                   example: REF123456789
*               required:
*                 - reference
*       responses:
*         200:
*           description: Payment callback handled successfully.
*         400:
*           description: An error occurred while processing the payment callback.
*         500:
*           description: Internal server error.
*     get:
*       summary: Handle Payment Callback (GET)
*       description: Handles the GET request for the payment callback (optional).
*       tags: [Payments]
*       parameters:
*         - in: query
*           name: reference
*           schema:
*             type: string
*             description: Reference code for the payment transaction
*           required: true
*       responses:
*         200:
*           description: Payment callback GET endpoint reached.
*         500:
*           description: Internal server error.
*/


// Route to initiate payment
router.post('/pay', paymentController.initiatePayment);

// Route to handle payment callback
router.post('/pay/callback', paymentController.paymentCallback);

// GET route for handling payment callback (optional route)
router.get('/pay/callback', paymentController.paymentCallbackGet);


module.exports = router;