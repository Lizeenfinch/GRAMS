const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  register,
  login,
  getMe,
  logout,
  sendOTP,
  verifyCitizenOTP,
  googleLogin,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.get('/me', auth, getMe);
router.post('/logout', logout);

// OTP routes for citizen login
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyCitizenOTP);

module.exports = router;
