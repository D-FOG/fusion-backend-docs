const express = require('express');
var router = express.Router();

const {
  register,
  login,
  email,
  verifyOtp,
  getUser,
  forgotPassword,
  resetPassword,
  verifyurlcode,
  signinWithGoogle,
  checkUsername
} = require('../controllers/auth.controller');
const { friendRequest } = require('../controllers/friend.controller');

router.route('/check-username').post(checkUsername);
router.route('/register').post(register);
router.route('/login').post(login);
router.route('/sign-with-google').post(signinWithGoogle);
router.route('/email').post(email);
router.route('/verifyotp').post(verifyOtp);
router.route('/getuser').post(getUser);
router.route('/request').post(friendRequest);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').post(resetPassword);
router.route('/verify-urlcode').post(verifyurlcode);
router.route('*').all((req, res) => {
  res.status(404).json({ message: 'Invalid route' });
});

module.exports = router;
