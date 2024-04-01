const express = require('express');
var router = express.Router();

const {
  acceptRequest,
  messageRequest,
  rejectRequest
} = require('../controllers/messageRequest.controller');

router.route('/message-request').post(messageRequest);
router.route('/accept-request').post(acceptRequest);
router.route('/reject-request').post(rejectRequest);

module.exports = router;
