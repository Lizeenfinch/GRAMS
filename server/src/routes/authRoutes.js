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
  sendEmailOTP,
  verifyEmailOTP,
  completeRegistration,
  resendEmailOTP,
} = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.get('/me', auth, getMe);
router.post('/logout', logout);

// OTP routes for citizen login (phone)
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyCitizenOTP);

// Email OTP routes for registration
router.post('/send-email-otp', sendEmailOTP);  
router.post('/verify-email-otp', verifyEmailOTP); 
router.post('/complete-registration', completeRegistration);
router.post('/resend-email-otp', resendEmailOTP);

module.exports = router;
