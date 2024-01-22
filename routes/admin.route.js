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


router.get("/admin/get-users",  authController.verifyToken, authController.checkAdmin, adminController.fetchAllUsers);

router.get("/admin/get-user/:userId",  authController.verifyToken, authController.checkAdmin, adminController.fetchUser);

router.put("/admin/update-user/:userId",  authController.verifyToken, authController.checkAdmin, adminController.updateUser);


router.put("/admin/deposit/:userId",  authController.verifyToken, authController.checkAdmin, adminController.deposit);

router.get("/admin/get-deposits", authController.verifyToken, authController.checkAdmin, adminController.fetchDeposits);



router.post("/admin/create-plan", authController.verifyToken, authController.checkAdmin, adminController.createPlan);

router.get("/admin/get-plans", authController.verifyToken, authController.checkAdmin, adminController.fetchPlans);

router.put("/admin/update-plan/:id", authController.verifyToken, authController.checkAdmin, adminController.updatePlan);

router.get("/admin/get-plan/:id", authController.verifyToken, authController.checkAdmin, adminController.getSinglePlan);


router.get("/admin/get-withdrawals", authController.verifyToken, authController.checkAdmin, adminController.fetchWithdrawals);
 
router.put("/admin/approve-withdrawal/:id", authController.verifyToken, authController.checkAdmin, adminController.approveWithdrawal);

router.put("/admin/reject-withdrawal/:id", authController.verifyToken, authController.checkAdmin, adminController.rejectWithdrawal);



router.get("/admin/get-dashboard-details", authController.verifyToken, authController.checkAdmin, adminController.getDashboardDetails);



router.get("/admin/get-users-payments", authController.verifyToken, authController.checkAdmin, adminController.getUsersPayment);

router.put("/admin/approve-payment/:paymentId", authController.verifyToken, authController.checkAdmin, adminController.approveUsersPayment);

module.exports = router;