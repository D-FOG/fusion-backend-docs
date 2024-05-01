// routes/hirerRoutes.js
const express = require('express');
const router = express.Router();
const hirerController = require('../controllers/hirerController');


/**
 * @swagger
 * tags:
 *   name: Hirers
 *   description: API for managing hirers
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     HirerInput:
 *       type: object
 *       properties:
 *         identity:
 *           $ref: '#/components/schemas/Identity'
 *         jobPosting:
 *           $ref: '#/components/schemas/JobPosting'
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
 *           format: date
 *         address:
 *           type: object
 *           properties:
 *             state:
 *               type: string
 *             city:
 *               type: string
 *     JobPosting:
 *       type: object
 *       properties:
 *         jobTitle:
 *           type: string
 *         jobCategory:
 *           type: string
 *         jobDescription:
 *           type: string
 *         projectType:
 *           type: string
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *         jobLocation:
 *           type: string
 *         budget:
 *           type: number
 */

/**
 * @swagger
*   /api/hirers:
*     post:
*       summary: Create a new hirer
*       tags:
*         - Hirers
*       requestBody:
*         required: true
*         content:
*           application/json:
*             schema:
*               $ref: '#/components/schemas/HirerInput'
*       responses:
*         '201':
*           description: Hirer created successfully
*           content:
*             application/json:
*               schema:
*                 $ref: '#/components/schemas/Hirer'
*         '400':
*           description: Validation error
*           content:
*             application/json:
*               example:
*                 error: Validation error
*                 details: Invalid input data
*         '500':
*           description: Internal server error
*           content:
*             application/json:
*               example:
*                 error: Internal server error
*     get:
*       summary: Get all hirers
*       tags:
*         - Hirers
*       responses:
*         '200':
*           description: Hirers retrieved successfully
*           content:
*             application/json:
*               example:
*                 - _id: '6123465aeed368001c49f875'
*                   identity:
*                     profilePicture: 'https://example.com/profile.jpg'
*                     firstName: John
*                     lastName: Doe
*                     email: john@example.com
*                     phoneNumber: '1234567890'
*                     description: Lorem ipsum
*                     occupation: Developer
*                     gender: Male
*                     birthday: '1990-01-01'
*                     address:
*                       state: California
*                       city: Los Angeles
*                   jobPosting:
*                     jobTitle: Software Engineer
*                     jobCategory: Information Technology
*                     jobDescription: Lorem ipsum
*                     projectType: Full-time
*                     tags:
*                       - Node.js
*                       - React
*                     jobLocation: Los Angeles
*                     budget: 100000
*         '500':
*           description: Internal server error
*           content:
*             application/json:
*               example:
*                 error: Internal server error
* @swagger
*   /api/hirers/{id}:
*     get:
*       summary: Get hirer by ID
*       tags:
*         - Hirers
*       parameters:
*         - in: path
*           name: id
*           required: true
*           description: Hirer ID
*           schema:
*             type: string
*       responses:
*         '200':
*           description: Hirer retrieved successfully
*           content:
*             application/json:
*               example:
*                 _id: '6123465aeed368001c49f875'
*                 identity:
*                   profilePicture: 'https://example.com/profile.jpg'
*                   firstName: John
*                   lastName: Doe
*                   email: john@example.com
*                   phoneNumber: '1234567890'
*                   description: Lorem ipsum
*                   occupation: Developer
*                   gender: Male
*                   birthday: '1990-01-01'
*                   address:
*                     state: California
*                     city: Los Angeles
*                 jobPosting:
*                   jobTitle: Software Engineer
*                   jobCategory: Information Technology
*                   jobDescription: Lorem ipsum
*                   projectType: Full-time
*                   tags:
*                     - Node.js
*                     - React
*                   jobLocation: Los Angeles
*                   budget: 100000
*         '404':
*           description: Hirer not found
*           content:
*             application/json:
*               example:
*                 error: Hirer not found
*         '500':
*           description: Internal server error
*           content:
*             application/json:
*               example:
*                 error: Internal server error
*/

// Create Hirer
router.post('/', hirerController.createHirer);

    // Get Hirer by ID
router.get('/:id', hirerController.getHirerById);

// Get all Hirers
router.get('/', hirerController.getAllHirers);


module.exports = router;
