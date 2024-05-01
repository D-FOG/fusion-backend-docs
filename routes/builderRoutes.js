// routes/builderRoutes.js
const express = require('express');
const router = express.Router();
const builderController = require('../controllers/builderController');

/**
 * @swagger
 * tags:
 *   name: Builders
 *   description: Endpoints related to builders
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Skill:
 *       type: object
 *       properties:
 *         skill:
 *           type: string
 *         category:
 *           type: string
 *         subSkills:
 *           type: array
 *           items:
 *             type: string
 *     ProfilePicture:
 *       type: object
 *       properties:
 *         data:
 *           type: string
 *           format: binary
 *         contentType:
 *           type: string
 *     Address:
 *       type: object
 *       properties:
 *         state:
 *           type: string
 *         city:
 *           type: string
 *     Identity:
 *       type: object
 *       properties:
 *         profilePicture:
 *           $ref: '#/components/schemas/ProfilePicture'
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
 *           $ref: '#/components/schemas/Address'
 */

/**
 * @swagger
*   /api/builders:
*     post:
*       summary: Create a new builder
*       description: Create a new builder profile
*       tags: 
*         - Builders
*       requestBody:
*         required: true
*         content:
*           multipart/form-data:
*             schema:
*               type: object
*               properties:
*                 skills:
*                   type: array
*                   items:
*                     $ref: '#/components/schemas/Skill'
*                   description: Array of skills possessed by the builder
*                 identity:
*                   type: object
*                   properties:
*                     profilePicture:
*                       type: string
*                       format: binary
*                       description: Profile picture of the builder
*                     firstName:
*                       type: string
*                     lastName:
*                       type: string
*                     email:
*                       type: string
*                       format: email
*                     phoneNumber:
*                       type: string
*                     description:
*                       type: string
*                     occupation:
*                       type: string
*                     gender:
*                       type: string
*                     birthday:
*                       type: string
*                     address:
*                       $ref: '#/components/schemas/Address'
*       responses:
*         '201':
*           description: Builder created successfully
*           content:
*             application/json:
*               example:
*                 _id: '12345'
*                 skills:
*                   - Plumbing
*                   - Carpentry
*                 identity:
*                   profilePicture: 'base64-encoded-image'
*                   firstName: John
*                   lastName: Doe
*                   email: john.doe@example.com
*                   phoneNumber: '1234567890'
*                   description: Experienced builder
*                   occupation: Carpenter
*                   gender: Male
*                   birthday: '1985-05-15'
*                   address:
*                     state: California
*                     city: Los Angeles
*         '400':
*           description: Validation error
*           content:
*             application/json:
*               example:
*                 error: Validation error
*                 details: Invalid request data
*         '500':
*           description: Internal server error
*           content:
*             application/json:
*               example:
*                 error: Internal server error
*     get:
*       summary: Get all builders
*       description: Get a list of all builders
*       tags:
*         - Builders
*       responses:
*         '200':
*           description: List of all builders
*           content:
*             application/json:
*               example:
*                 - _id: '12345'
*                   skills:
*                     - Plumbing
*                     - Carpentry
*                   identity:
*                     profilePicture: 'base64-encoded-image'
*                     firstName: John
*                     lastName: Doe
*                     email: john.doe@example.com
*                     phoneNumber: '1234567890'
*                     description: Experienced builder
*                     occupation: Carpenter
*                     gender: Male
*                     birthday: '1985-05-15'
*                     address:
*                       state: California
*                       city: Los Angeles
*                 - _id: '67890'
*                   skills:
*                     - Electrician
*                     - Roofing
*                   identity:
*                     profilePicture: 'base64-encoded-image'
*                     firstName: Jane
*                     lastName: Smith
*                     email: jane.smith@example.com
*                     phoneNumber: '9876543210'
*                     description: Skilled electrician
*                     occupation: Electrician
*                     gender: Female
*                     birthday: '1990-10-20'
*                     address:
*                       state: New York
*                       city: New York City
*         '500':
*           description: Internal server error
*           content:
*             application/json:
*               example:
*                 error: Internal server error
* @swagger
*   /api/builders/{id}:
*     get:
*       summary: Get builder by ID
*       description: Get a builder by their ID
*       tags:
*         - Builders
*       parameters:
*         - in: path
*           name: id
*           required: true
*           description: ID of the builder
*           schema:
*             type: string
*       responses:
*         '200':
*           description: Builder retrieved successfully
*           content:
*             application/json:
*               example:
*                 _id: '12345'
*                 skills:
*                   - Plumbing
*                   - Carpentry
*                 identity:
*                   profilePicture: 'base64-encoded-image'
*                   firstName: John
*                   lastName: Doe
*                   email: john.doe@example.com
*                   phoneNumber: '1234567890'
*                   description: Experienced builder
*                   occupation: Carpenter
*                   gender: Male
*                   birthday: '1985-05-15'
*                   address:
*                     state: California
*                     city: Los Angeles
*         '404':
*           description: Builder not found
*           content:
*             application/json:
*               example:
*                 error: Builder not found
*         '500':
*           description: Internal server error
*           content:
*             application/json:
*               example:
*                 error: Internal server error
*/


// Define your builder routes here
router.post('/', builderController.createBuilder);

router.get('/:id', builderController.getBuilderById);

// Define your builder routes here
router.get('/', builderController.getAllBuilders);

module.exports = router;
