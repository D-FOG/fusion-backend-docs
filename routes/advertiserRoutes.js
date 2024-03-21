// routes/advertiserRoutes.js
const express = require('express');
const router = express.Router();
const advertiserController = require('../controllers/advertiserController');

/**
 * @swagger
 * tags:
 *   name: Advertisers
 *   description: Endpoints related to advertisers
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Identity:
 *       type: object
 *       properties:
 *         profilePicture:
 *           type: string
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phoneNumber:
 *           type: string
 *         description:
 *           type: string
 *         occupation:
 *           type: string
 *         gender:
 *           type: string
 *         birthday:
 *           type: string
 *         address:
 *           type: object
 *           properties:
 *             state:
 *               type: string
 *             city:
 *               type: string
 * 
 *     BusinessDescription:
 *       type: object
 *       properties:
 *         businessTitle:
 *           type: string
 *         businessDescription:
 *           type: string
 * 
 *     Service:
 *       type: object
 *       properties:
 *         serviceTitle:
 *           type: string
 *         serviceDescription:
 *           type: string
 *         serviceImage:
 *           type: string
 * 
 *     AdvertiserInput:
 *       type: object
 *       required:
 *         - identity
 *         - businessDescription
 *         - services
 *       properties:
 *         identity:
 *           $ref: '#/components/schemas/Identity'
 *         businessDescription:
 *           $ref: '#/components/schemas/BusinessDescription'
 *         services:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Service'
 */

/**
 * @swagger
 * /advertisers:
 *   post:
 *     summary: Create a new advertiser
 *     tags: [Advertisers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdvertiserInput'
 *     responses:
 *       '201':
 *         description: Advertiser created successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: '12345'
 *               identity: {...}
 *               businessDescription: {...}
 *               services: [{...}, {...}]
 *       '400':
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               error: Validation error
 *               details: {...}
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal server error
 */


/**
 * @swagger
 * /advertisers/{id}:
 *   get:
 *     summary: Get advertiser by ID
 *     tags: [Advertisers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Advertiser ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Advertiser retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: 12345
 *               identity: {...}
 *               businessDescription: {...}
 *               services: [{...}, {...}]
 *       404:
 *         description: Advertiser not found
 *         content:
 *           application/json:
 *             example:
 *               error: Advertiser not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal server error
 */

/**
 * @swagger
 * /advertisers:
 *   get:
 *     summary: Get all advertisers
 *     tags: [Advertisers]
 *     responses:
 *       200:
 *         description: Advertisers retrieved successfully
 *         content:
 *           application/json:
 *             example: [{...}, {...}]
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal server error
 */

// Create Advertiser
router.post('/', advertiserController.createAdvertiser);

// Get Advertiser by ID
router.get('/:id', advertiserController.getAdvertiserById);

// Get all Advertisers
router.get('/', advertiserController.getAllAdvertisers);

module.exports = router;
