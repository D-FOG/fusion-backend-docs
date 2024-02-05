const express = require('express');
var router = express.Router();
const authController = require("../controllers/auth.controller");
const userController = require("../controllers/user.controller");

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * Registers a new user.
 *
 * @swagger
 * /api/user/register:
 *   post:
 *     summary: Register a new user.
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *                 description: The firstname of the user.
 *               lastname:
 *                 type: string
 *                 description: The lastname of the user.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password for the user account.
 *     responses:
 *       '201':
 *         description: User registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 user:
 *                   type: object
 *                   description: Details of the newly registered user.
 *       '400':
 *         description: User registration not successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties: 
 *                 error:
 *                   type: string
 *                   description: Error message for unsuccessful registration.
 */

/**
 * Logs in a user.
 *
 * @swagger
 * /api/user/login:
 *   post:
 *     summary: Logs in a user.
 *     description: Logs in an existing user by verifying credentials.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email of the user.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password of the user.
 *     responses:
 *       '200':
 *         description: Login successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating successful login.
 *                 user:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: The authentication token for the logged-in user.
 *       '401':
 *         description: Unauthorized.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Reason for unauthorized access (e.g., invalid password, unverified account).
 *       '404':
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message indicating that the user was not found.
 *       '500':
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message indicating a server error.
 */

/**
 * Verifies user email and activates the account.
 *
 * @swagger
 * /api/user/verify-email:
 *   post:
 *     summary: Verify user email and activate the account.
 *     description: Verifies the user's email using OTP and activates the account if valid.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The token for verification.
 *               otp:
 *                 type: number
 *                 description: The one-time password (OTP) for email verification.
 *     responses:
 *       '201':
 *         description: Account verified successfully.
 *         content:
 *           application/json: 
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating account verification.
 *                 data:
 *                   type: object
 *                   description: Details of the verified user account.
 *       '401':
 *         description: Invalid OTP or token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message for invalid OTP or token.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message indicating a server error during verification.
 */

/**
 * Resets user password and sends reset link via email.
 *
 * @swagger
 * /api/user/forgot-password:
 *   post:
 *     summary: Reset user password and send reset link.
 *     description: Sends a password reset link via email and generates an OTP for password reset.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               emails:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user requesting password reset.
 *     responses:
 *       '201':
 *         description: Password reset link sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating that the password reset link has been sent.
 *       '401':
 *         description: User not found or invalid request.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message for user not found or invalid request.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message indicating a server error during password reset.
 */

/**
 * Verifies and changes user password after reset request.
 *
 * @swagger
 * /api/user/reset-password:
 *   post:
 *     summary: Verify and change user password after reset.
 *     description: Verifies the user's OTP and token to change the password after reset request.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: The token received for verification.
 *               otp:
 *                 type: string
 *                 description: The one-time password (OTP) received for email verification.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The new password for the user account.
 *               emails:
 *                 type: string
 *                 format: email
 *                 description: The email address of the user requesting password reset.
 *     responses:
 *       '201':
 *         description: Password changed successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message indicating that the password has been changed successfully.
 *                 data:
 *                   type: object
 *                   description: Details of the user with the updated password.
 *       '401':
 *         description: Invalid OTP, token, email, or password missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message for invalid OTP, token, email, or missing password.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message indicating a server error during password change.
 */


// auth

router.post("/user/register", userController.registerUser);

router.post("/user/verify-email", userController.verifyEmail);

router.post("/user/login", userController.login);

router.post("/user/forgot-password", userController.forgotPassword);

router.post("/user/reset-password", userController.resetPassword);

// user profile and account details

/**
 * Retrieves user profile information.
 *
 * @swagger
 * /api/user/user-profile:
 *   get:
 *     summary: Get user profile information.
 *     description: Retrieves the profile information of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: User profile retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               description: Details of the user profile.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Message indicating a server error during profile retrieval.
 */

// /**
//  * Edits user profile details.
//  *
//  * @swagger
//  * /api/user/edit-profile:
//  *   put:
//  *     summary: Edit user profile details.
//  *     description: Allows the user to update their Bitcoin, USDT, and Ethereum wallet addresses.
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               bitcoinAddress:
//  *                 type: string
//  *                 description: The updated Bitcoin wallet address of the user.
//  *               usdtAddress:
//  *                 type: string
//  *                 description: The updated USDT wallet address of the user.
//  *               ethereumAddress:
//  *                 type: string
//  *                 description: The updated Ethereum wallet address of the user.
//  *     responses:
//  *       '200':
//  *         description: User profile details updated successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               description: Updated user profile details.
//  *       '404':
//  *         description: User not found.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   description: Error message indicating that the user was not found.
//  *       '500':
//  *         description: Internal server error.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   description: Message indicating a server error during profile update.
//  */

// /**
//  * Retrieves account details by user ID.
//  *
//  * @swagger
//  * /api/user/fetch-account-details:
//  *   get:
//  *     summary: Get account details by user ID.
//  *     description: Retrieves the account details of a user by their user ID.
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       '200':
//  *         description: User account details retrieved successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               description: User account details.
//  *       '404':
//  *         description: User not found.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   description: Error message indicating that the user was not found.
//  *       '500':
//  *         description: Internal server error.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   description: Message indicating a server error during account details retrieval.
//  */


router.get("/user/user-profile", authController.verifyToken, authController.checkUser, userController.userProfile);

// router.put("/user/edit-profile", authController.verifyToken, authController.checkUser, userController.editProfile);

// router.get("/user/fetch-account-details", authController.verifyToken, authController.checkUser, userController.accountDetails);

// // plans 

// /**
//  * Retrieves all available plans.
//  *
//  * @swagger
//  * /api/user/get-plans:
//  *   get:
//  *     summary: Get all available plans.
//  *     description: Retrieves a list of all available plans.
//  *     responses:
//  *       '200':
//  *         description: List of available plans retrieved successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Plan'
//  *       '500':
//  *         description: Internal server error.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   description: Message indicating a server error during plans retrieval.
//  */

// /**
//  * Retrieves a single plan by ID.
//  *
//  * @swagger
//  * /api/user/get-plan/{id}:
//  *   get:
//  *     summary: Get a single plan by ID.
//  *     description: Retrieves details of a single plan by its ID.
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The ID of the plan to fetch.
//  *     responses:
//  *       '200':
//  *         description: Plan details retrieved successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               $ref: '#/components/schemas/Plan'
//  *       '404':
//  *         description: Plan not found.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   description: Error message indicating that the plan was not found.
//  *       '500':
//  *         description: Internal server error.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   description: Message indicating a server error during plan retrieval.
//  */


// router.get("/user/get-plans", authController.verifyToken, authController.checkUser, userController.getPlans);

// router.get("/user/get-plan/:id", authController.verifyToken, authController.checkUser, userController.getSinglePlan);


// // user deposit and payments

// /**
//  * Initiates a deposit for a plan.
//  *
//  * @swagger
//  * /api/user/deposit/{id}/{transactionId}:
//  *   post:
//  *     summary: Initiate a deposit for a plan.
//  *     description: Initiates a deposit process for a specific plan using the provided transaction details.
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The ID of the plan for the deposit.
//  *       - in: path
//  *         name: transactionId
//  *         required: true
//  *         schema:
//  *           type: string
//  *         description: The transaction ID associated with the deposit.
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             properties:
//  *               method:
//  *                 type: string
//  *                 description: The method used for the deposit.
//  *     responses:
//  *       '201':
//  *         description: Deposit initiated successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   description: Message confirming successful initiation of deposit.
//  *                 payment:
//  *                   $ref: '#/components/schemas/Payment'
//  *       '200':
//  *         description: Deposit already completed.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   description: Message indicating that the deposit has already been done.
//  *       '401':
//  *         description: Required information missing for deposit.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   description: Error message indicating missing information for successful deposit.
//  *       '500':
//  *         description: Internal server error.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   description: Message indicating a server error during deposit initiation.
//  */

// /**
//  * Retrieves deposits made by the user.
//  *
//  * @swagger
//  * /api/user/get-deposits:
//  *   get:
//  *     summary: Get deposits made by the user.
//  *     description: Retrieves a list of deposits made by the authenticated user.
//  *     responses:
//  *       '200':
//  *         description: List of user deposits retrieved successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Payment'
//  *       '500':
//  *         description: Internal server error.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   description: Message indicating a server error during deposits retrieval.
//  */

// router.post("/user/deposit/:id/:transactionId", authController.verifyToken, authController.checkUser, userController.deposit);

// router.get("/user/get-deposits", authController.verifyToken, authController.checkUser, userController.getDeposits);

// // user withdrawals

// /**
// * Initiates a withdrawal request.
// *
// * @swagger
// * /api/user/withdraw:
// *   post:
// *     summary: Initiate a withdrawal request.
// *     description: Initiates a withdrawal request for the authenticated user.
// *     requestBody:
// *       required: true
// *       content:
// *         application/json:
// *           schema:
// *             type: object
// *             properties:
// *               amount:
// *                 type: number
// *                 description: The amount to be withdrawn.
// *     responses:
// *       '201':
// *         description: Withdrawal request placed successfully.
// *         content:
// *           application/json:
// *             schema:
// *               type: object
// *               properties:
// *                 message:
// *                   type: string
// *                   description: Message confirming successful placement of the withdrawal request.
// *                 withdrawal:
// *                   $ref: '#/components/schemas/Withdrawal'
// *       '500':
// *         description: Internal server error.
// *         content:
// *           application/json:
// *             schema:
// *               type: object
// *               properties:
// *                 error:
// *                   type: string
// *                   description: Message indicating a server error during withdrawal initiation.
// */

// /**
//  * Retrieves user's withdrawal history.
//  *
//  * @swagger
//  * /api/user/get-withdrawals:
//  *   get:
//  *     summary: Get user's withdrawal history.
//  *     description: Retrieves the withdrawal history of the authenticated user.
//  *     responses:
//  *       '200':
//  *         description: User's withdrawal history retrieved successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: array
//  *               items:
//  *                 $ref: '#/components/schemas/Withdrawal'
//  *       '500':
//  *         description: Internal server error.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   description: Message indicating a server error during withdrawal history retrieval.
//  */

// router.post("/user/withdraw", authController.verifyToken, authController.checkUser, userController.withdraw);

// router.get("/user/get-withdrawals", authController.verifyToken, authController.checkUser, userController.getWithdrawals);

// // user referrals

// /**
//  * Retrieves user's referrals and active referrals.
//  *
//  * @swagger
//  * /api/user/get-referrals:
//  *   get:
//  *     summary: Get user's referrals and active referrals.
//  *     description: Retrieves a list of user's referrals and active referrals.
//  *     responses:
//  *       '200':
//  *         description: User's referrals and active referrals retrieved successfully.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 referrals:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/User'
//  *                   description: List of user's referrals.
//  *                 activeReferrals:
//  *                   type: array
//  *                   items:
//  *                     $ref: '#/components/schemas/User'
//  *                   description: List of user's active referrals.
//  *       '500':
//  *         description: Internal server error.
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 error:
//  *                   type: string
//  *                   description: Message indicating a server error during referrals retrieval.
//  */

// router.get("/user/get-referrals", authController.verifyToken, authController.checkUser, userController.getReferrals);

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The unique identifier for the user.
 *         firstname:
 *           type: string
 *           description: The firstname of the user.
 *         lastname:
 *           type: string
 *           description: The lastname of the user.
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user.
 *         status:
 *           type: string
 *           description: The status of the user account.
 *         pendingWithdrawal:
 *           type: number
 *           description: The pending withdrawal amount for the user.
 *         accountBalance:
 *           type: number
 *           description: The current account balance of the user.
 *       required:
 *         - firstname
 *         - lastname
 *         - email
 *         - status
 */



module.exports = router;