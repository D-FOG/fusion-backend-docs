const express = require('express');
const { verifyToken } = require('../utils/verifyToken');
var router = express.Router();
const {getReferalTree} = require('../controllers/referralController')

router.get('/referrer-trees', verifyToken, getReferalTree)

module.exports = router;