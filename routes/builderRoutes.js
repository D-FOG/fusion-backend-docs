// routes/builderRoutes.js
const express = require('express');
const router = express.Router();
const builderController = require('../controllers/builderController');

/**
 * @swagger
 * tags:
 *   name: Builders
 *   description: API for managing builders
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
 * /builders:
 *   post:
 *     summary: Create a new builder
 *     tags: [Builders]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               skills:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Skill'
 *               identity:
 *                 type: object
 *                 properties:
 *                   profilePicture:
 *                     type: string
 *                     format: binary
 *                   firstName:
 *                     type: string
 *                   lastName:
 *                     type: string
 *                   email:
 *                     type: string
 *                     format: email
 *                   phoneNumber:
 *                     type: string
 *                   description:
 *                     type: string
 *                   occupation:
 *                     type: string
 *                   gender:
 *                     type: string
 *                   birthday:
 *                     type: string
 *                   address:
 *                     type: object
 *                     properties:
 *                       state:
 *                         type: string
 *                       city:
 *                         type: string
 *     responses:
 *       201:
 *         description: Builder created successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: 12345
 *               skills: [...]
 *               identity: {...}
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             example:
 *               error: Validation error
 *               details: {...}
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal server error
 */

// Define your builder routes here
router.post('/', builderController.createBuilder);

/**
 * @swagger
 * /builders/{id}:
 *   get:
 *     summary: Get builder by ID
 *     tags: [Builders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Builder ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Builder retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               _id: 12345
 *               skills: [...]
 *               identity: 
 *                 profilePicture: "base64-encoded-image-string"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 email: "john.doe@example.com"
 *                 phoneNumber: "123456789"
 *                 description: "A skilled builder"
 *                 occupation: "Construction Worker"
 *                 gender: "Male"
 *                 birthday: "1990-01-01"
 *                 address: {
 *                   state: "California",
 *                   city: "Los Angeles"
 *                 }
 *       404:
 *         description: Builder not found
 *         content:
 *           application/json:
 *             example:
 *               error: Builder not found
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal server error
 */


router.get('/:id', builderController.getBuilderById);

/**
 * @swagger
 * /builders:
 *   get:
 *     summary: Get all builders
 *     tags: [Builders]
 *     responses:
 *       200:
 *         description: List of all builders
 *         content:
 *           application/json:
 *             example:
 *               - _id: 12345
 *                 skills: [...]
 *                 identity: 
 *                   profilePicture: "base64-encoded-image-string"
 *                   firstName: "John"
 *                   lastName: "Doe"
 *                   email: "john.doe@example.com"
 *                   phoneNumber: "123456789"
 *                   description: "A skilled builder"
 *                   occupation: "Construction Worker"
 *                   gender: "Male"
 *                   birthday: "1990-01-01"
 *                   address: {
 *                     state: "California",
 *                     city: "Los Angeles"
 *                   }
 *               - _id: 67890
 *                 skills: [...]
 *                 identity: 
 *                   profilePicture: "base64-encoded-image-string"
 *                   firstName: "Jane"
 *                   lastName: "Smith"
 *                   email: "jane.smith@example.com"
 *                   phoneNumber: "987654321"
 *                   description: "Experienced builder"
 *                   occupation: "Architect"
 *                   gender: "Female"
 *                   birthday: "1985-05-15"
 *                   address: {
 *                     state: "New York",
 *                     city: "New York City"
 *                   }
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: Internal server error
 */

// Define your builder routes here
router.get('/', builderController.getAllBuilders);

module.exports = router;



module.exports = router;
