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
*   /api/advertisers:
*     post:
*       summary: Create a new advertiser
*       tags:
*         - Advertisers
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: "#/components/schemas/AdvertiserInput"
*       responses:
*         201:
*           description: Advertiser created successfully
*           content:
*             application/json:
*               example:
*                 _id: "12345"
*                 identity:
*                   profilePicture: "https://example.com/profile.jpg"
*                   firstName: "John"
*                   lastName: "Doe"
*                   email: "john@example.com"
*                   phoneNumber: "1234567890"
*                   description: "Lorem ipsum"
*                   occupation: "Business Owner"
*                   gender: "Male"
*                   birthday: "1990-01-01"
*                   address:
*                     state: "California"
*                     city: "Los Angeles"
*                 businessDescription:
*                   businessTitle: "Business Title"
*                   businessDescription: "Business Description"
*                 services:
*                   - serviceTitle: "Service 1"
*                     serviceDescription: "Service Description 1"
*                     serviceImage: "https://example.com/service1.jpg"
*                   - serviceTitle: "Service 2"
*                     serviceDescription: "Service Description 2"
*                     serviceImage: "https://example.com/service2.jpg"
*         400:
*           description: Validation error
*           content:
*             application/json:
*               example:
*                 error: "Validation error"
*                 details: "Invalid input data"
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               example:
*                 error: "Internal server error"
* @swagger
*   /api/advertisers/{id}:
*     get:
*       summary: Get advertiser by ID
*       tags:
*         - Advertisers
*       parameters:
*         - in: path
*           name: id
*           required: true
*           description: Advertiser ID
*           schema:
*             type: string
*       responses:
*         200:
*           description: Advertiser retrieved successfully
*           content:
*             application/json:
*               example:
*                 _id: "12345"
*                 identity:
*                   profilePicture: "https://example.com/profile.jpg"
*                   firstName: "John"
*                   lastName: "Doe"
*                   email: "john@example.com"
*                   phoneNumber: "1234567890"
*                   description: "Lorem ipsum"
*                   occupation: "Business Owner"
*                   gender: "Male"
*                   birthday: "1990-01-01"
*                   address:
*                     state: "California"
*                     city: "Los Angeles"
*                 businessDescription:
*                   businessTitle: "Business Title"
*                   businessDescription: "Business Description"
*                 services:
*                   - serviceTitle: "Service 1"
*                     serviceDescription: "Service Description 1"
*                     serviceImage: "https://example.com/service1.jpg"
*                   - serviceTitle: "Service 2"
*                     serviceDescription: "Service Description 2"
*                     serviceImage: "https://example.com/service2.jpg"
*         404:
*           description: Advertiser not found
*           content:
*             application/json:
*               example:
*                 error: "Advertiser not found"
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               example:
*                 error: "Internal server error"
 * @swagger
*   /api/advertisers:
*     get:
*       summary: Get all advertisers
*       tags:
*         - Advertisers
*       responses:
*         200:
*           description: Advertisers retrieved successfully
*           content:
*             application/json:
*               example:
*                 _id: "6123465aeed368001c49f875"
*                 identity:
*                   profilePicture: "https://example.com/profile.jpg"
*                   firstName: "John"
*                   lastName: "Doe"
*                   email: "john@example.com"
*                   phoneNumber: "1234567890"
*                   description: "Lorem ipsum"
*                   occupation: "Business Owner"
*                   gender: "Male"
*                   birthday: "1990-01-01"
*                   address:
*                     state: "California"
*                     city: "Los Angeles"
*                 businessDescription:
*                   businessTitle: "Business Title"
*                   businessDescription: "Business Description"
*                 services:
*                   - serviceTitle: "Service 1"
*                     serviceDescription: "Service Description 1"
*                     serviceImage: "https://example.com/service1.jpg"
*                   - serviceTitle: "Service 2"
*                     serviceDescription: "Service Description 2"
*                     serviceImage: "https://example.com/service2.jpg"
*         500:
*           description: Internal server error
*           content:
*             application/json:
*               example:
*                 error: "Internal server error"
*/

// Create Advertiser
router.post('/', advertiserController.createAdvertiser);

// Get Advertiser by ID
router.get('/:id', advertiserController.getAdvertiserById);

// Get all Advertisers
router.get('/', advertiserController.getAllAdvertisers);

module.exports = router;
