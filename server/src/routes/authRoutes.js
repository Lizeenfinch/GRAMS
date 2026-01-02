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
  forgotPassword,
  verifyResetOTP,
  resetPassword,
  resendResetOTP,
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

// Forgot Password routes
router.post('/forgot-password', forgotPassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);
router.post('/resend-reset-otp', resendResetOTP);

module.exports = router;
