const express = require('express');
var router = express.Router();
const authController = require("../controllers/auth.controller");
const adminController = require("../controllers/admin.controller");

/**
 * Registers a new admin.
 *
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Register a new admin.
 *     description: Creates a new admin account.
 *     requestBody:
 *       required: true 
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the admin.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The email address of the admin.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: The password for the admin account..
 *     responses:
 *       '201':
 *         description: admin registered successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                 admin:
 *                   type: object
 *                   description: Details of the newly registered admin.
 *       '400':
 *         description: admin registration not successful.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message for unsuccessful registration.
 */

router.post("/admin/register", adminController.registerAdmin); 

router.post("/admin/login", adminController.login);


router.get("/admin/admin-profile", authController.verifyToken, authController.checkAdmin, adminController.adminProfile);

router.put("/admin/edit-profile", authController.verifyToken, authController.checkAdmin, adminController.editProfile);

/**
 * Fetch all users with uplines.
 *
 * @swagger
 * /api/admin/get-users/{userId}:
 *   get:
 *     summary: Fetch all users with uplines.
 *     description: Retrieves all users along with their upline details.
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/UserWithUpline'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message for internal server error.
 */

/**
 * Fetch a single user.
 *
 * @swagger
 * /api/admin/get-user/{userId}:
 *   get:
 *     summary: Fetch a single user.
 *     description: Retrieves a single user based on the user ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to fetch.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message for internal server error.
 */

/**
 * Update user details.
 *
 * @swagger
 * /api/admin/update-user/{userId}:
 *   put:
 *     summary: Update user details.
 *     description: Updates details of a single user based on the user ID.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID of the user to update.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message for internal server error.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserWithUpline:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *           description: The username of the user.
 *         email:
 *           type: string
 *           description: The email of the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *         referralId:
 *           type: string
 *           description: The referral ID of the user.
 *         uplineId:
 *           type: string
 *           description: The ID of the upline user.
 *         userId:
 *           type: string
 *           description: The ID of the user.
 *         earnings:
 *           type: number
 *           description: The earnings of the user.
 *         withdrawals:
 *           type: number
 *           description: The number of withdrawals made by the user.
 *         accountBalance:
 *           type: number
 *           description: The account balance of the user.
 *         activeInvestment:
 *           type: number
 *           description: The active investment of the user.
 *         pendingWithdrawal:
 *           type: number
 *           description: The pending withdrawal amount of the user.
 *         totalDeposit:
 *           type: number
 *           description: The total deposit amount of the user.
 *         referralEarnings:
 *           type: number
 *           description: The referral earnings of the user.
 *         upline:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: The username of the upline user.
 *             email:
 *               type: string
 *               description: The email of the upline user.
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The ID of the user.
 *         username:
 *           type: string
 *           description: The username of the user.
 *         email:
 *           type: string
 *           description: The email of the user.
 *         name:
 *           type: string
 *           description: The name of the user.
 *         referralId:
 *           type: string
 *           description: The referral ID of the user.
 *         uplineId:
 *           type: string
 *           description: The ID of the upline user.
 *         userId:
 *           type: string
 *           description: The ID of the user.
 *         earnings:
 *           type: number
 *           description: The earnings of the user.
 *         withdrawals:
 *           type: number
 *           description: The number of withdrawals made by the user.
 *         accountBalance:
 *           type: number
 *           description: The account balance of the user.
 *         activeInvestment:
 *           type: number
 *           description: The active investment of the user.
 *         pendingWithdrawal:
 *           type: number
 *           description: The pending withdrawal amount of the user.
 *         totalDeposit:
 *           type: number
 *           description: The total deposit amount of the user.
 *         referralEarnings:
 *           type: number
 *           description: The referral earnings of the user.
 *     UserUpdate:
 *       type: object
 *       properties:
 *         walletBalance:
 *           type: number
 *           description: The wallet balance of the user.
 *         earnings:
 *           type: number
 *           description: The earnings of the user.
 *         totaldeposit:
 *           type: number
 *           description: The total deposit amount of the user.
 *         activeInvestment:
 *           type: number
 *           description: The active investment of the user.
 *         status:
 *           type: string
 *           description: The status of the user.
 */


router.get("/admin/get-users",  authController.verifyToken, authController.checkAdmin, adminController.fetchAllUsers);

router.get("/admin/get-user/:userId",  authController.verifyToken, authController.checkAdmin, adminController.fetchUser);

router.put("/admin/update-user/:userId",  authController.verifyToken, authController.checkAdmin, adminController.updateUser);


router.put("/admin/deposit/:userId",  authController.verifyToken, authController.checkAdmin, adminController.deposit);

router.get("/admin/get-deposits", authController.verifyToken, authController.checkAdmin, adminController.fetchDeposits);

 

router.post("/admin/create-plan", authController.verifyToken, authController.checkAdmin, adminController.createPlan);

router.get("/admin/get-plans", authController.verifyToken, authController.checkAdmin, adminController.fetchPlans);

router.put("/admin/update-plan/:id", authController.verifyToken, authController.checkAdmin, adminController.updatePlan);

router.get("/admin/get-plan/:id", authController.verifyToken, authController.checkAdmin, adminController.getSinglePlan);

/**
 * Fetch withdrawals.
 *
 * @swagger
 * /api/admin/approve-withdrawal/:
 *   get:
 *     summary: Fetch withdrawals.
 *     description: Retrieves a list of withdrawals with associated user details.
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/WithdrawalWithUser'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message for internal server error.
 */

/**
 * Approve withdrawal.
 *
 * @swagger
 * /api/admin/approve-withdrawal/{id}:
 *   put:
 *     summary: Approve withdrawal.
 *     description: Approves a withdrawal with the specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the withdrawal to approve.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message.
 *                 withdrawal:
 *                   $ref: '#/components/schemas/Withdrawal'
 *       '404':
 *         description: Withdrawal not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message for withdrawal not found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message for internal server error.
 */

/**
 * Reject withdrawal.
 *
 * @swagger
 * /api/admin/reject-withdrawal/{id}:
 *   put:
 *     summary: Reject withdrawal.
 *     description: Rejects a withdrawal with the specified ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the withdrawal to reject.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Confirmation message.
 *                 withdrawal:
 *                   $ref: '#/components/schemas/Withdrawal'
 *       '404':
 *         description: Withdrawal not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message for withdrawal not found.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message for internal server error.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     WithdrawalWithUser:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The ID of the withdrawal.
 *         userId:
 *           type: string
 *           description: The ID of the user associated with the withdrawal.
 *         amount:
 *           type: number
 *           description: The amount of the withdrawal.
 *         status:
 *           type: string
 *           description: The status of the withdrawal (e.g., pending, approved, rejected).
 *         user:
 *           type: object
 *           properties:
 *             username:
 *               type: string
 *               description: The username of the user associated with the withdrawal.
 *             email:
 *               type: string
 *               description: The email of the user associated with the withdrawal.
 *     Withdrawal:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The ID of the withdrawal.
 *         userId:
 *           type: string
 *           description: The ID of the user associated with the withdrawal.
 *         amount:
 *           type: number
 *           description: The amount of the withdrawal.
 *         status:
 *           type: string
 *           description: The status of the withdrawal (e.g., pending, approved, rejected).
 */


router.get("/admin/get-withdrawals", authController.verifyToken, authController.checkAdmin, adminController.fetchWithdrawals);
 
router.put("/admin/approve-withdrawal/:id", authController.verifyToken, authController.checkAdmin, adminController.approveWithdrawal);

router.put("/admin/reject-withdrawal/:id", authController.verifyToken, authController.checkAdmin, adminController.rejectWithdrawal);

/**
 * Get dashboard details.
 *
 * @swagger
 * /api/admin/get-dashboard-details:
 *   get:
 *     summary: Get dashboard details.
 *     description: Retrieves details for the dashboard, including user count.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: integer
 *                   description: Number of users.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message for internal server error.
 */

  
  /**
   * Get users' payments.
   *
   * @swagger
   * /api/admin/get-users-payments:
   *   get:
   *     summary: Get users' payments.
   *     description: Retrieves details of users' payments.
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       '200':
   *         description: Successful response.
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Payment'
   *       '500':
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Error message for internal server error.
   */
  
  
  /**
   * Approve user's payment.
   *
   * @swagger
   * /api/admin/approve-payment/{paymentId}:
   *   put:
   *     summary: Approve user's payment.
   *     description: Approves a user's payment with the specified payment ID.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: paymentId
   *         required: true
   *         description: ID of the payment to approve.
   *         schema:
   *           type: string
   *       - in: body
   *         name: body
   *         required: true
   *         description: Payment details.
   *         schema:
   *           type: object
   *           properties:
   *             amount:
   *               type: number
   *               description: Amount of the payment.
   *     responses:
   *       '200':
   *         description: Successful response.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 message:
   *                   type: string
   *                   description: Confirmation message.
   *                 payment:
   *                   $ref: '#/components/schemas/Payment'
   *       '404':
   *         description: Payment not found.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Error message for payment not found.
   *       '500':
   *         description: Internal server error.
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 error:
   *                   type: string
   *                   description: Error message for internal server error.
   */
 


router.get("/admin/get-dashboard-details", authController.verifyToken, authController.checkAdmin, adminController.getDashboardDetails);



router.get("/admin/get-users-payments", authController.verifyToken, authController.checkAdmin, adminController.getUsersPayment);

router.put("/admin/approve-payment/:paymentId", authController.verifyToken, authController.checkAdmin, adminController.approveUsersPayment);


// transfers

/**
 * @swagger
 * /api/admin/transfers:
 *   get:
 *     summary: Get all transfers.
 *     description: Retrieves a list of all transfers.
 *     responses:
 *       '200':
 *         description: A list of transfers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transfer'
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

router.get('/admin/transfers', authController.verifyToken, authController.checkAdmin, adminController.getAllTransfers);
/**
 * @swagger
 * components:
 *   schemas:
 *     Transfer:
 *       type: object
 *       required:
 *         - receipient_name
 *         - account_number
 *         - amount
 *         - userId
 *         - date
 *       properties:
 *         receipient_name:
 *           type: string
 *           description: The name of the recipient.
 *         account_number:
 *           type: string
 *           description: The account number of the recipient.
 *         purpose:
 *           type: string
 *           description: The purpose of the transfer.
 *         city:
 *           type: string
 *           description: The city of the recipient.
 *         street:
 *           type: string
 *           description: The street address of the recipient.
 *         nickname:
 *           type: string
 *           description: Nickname for the recipient.
 *         amount:
 *           type: number
 *           description: The amount of money to transfer.
 *         currency:
 *           type: string
 *           description: The currency of the transfer.
 *         email:
 *           type: string
 *           description: The email address of the recipient.
 *         IBAN:
 *           type: string
 *           description: The IBAN number of the recipient.
 *         swift:
 *           type: string
 *           description: The SWIFT code of the recipient.
 *         status:
 *           type: string
 *           description: The status of the transfer (e.g., pending, completed).
 *         userId:
 *           type: string
 *           description: The ID of the user initiating the transfer.
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the transfer.
 *     Error:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Description of the error.
 */


module.exports = router;