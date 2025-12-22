const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendOTP, verifyOTP } = require('../utils/smsService');
const admin = require('firebase-admin');

// Store OTP data temporarily (use Redis for production)
const otpStore = new Map();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, department } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
      phone,
      department,
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Current User
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout
exports.logout = (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// Send OTP to Mobile Number
exports.sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number is required' 
      });
    }

    // Validate phone number format (should be +91 followed by 10 digits)
    const phoneRegex = /^\+91[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid phone number format' 
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with expiry (5 minutes)
    otpStore.set(phone, {
      otp,
      createdAt: Date.now(),
      expiresIn: 5 * 60 * 1000, // 5 minutes
      attempts: 0
    });

    // Send OTP via SMS service
    try {
      const result = await sendOTP(phone, otp);
      
      res.status(200).json({
        success: true,
        message: 'OTP sent successfully',
        phone: phone,
        // In production, remove demo OTP from response
        demoOTP: otp // Only for development/testing
      });
    } catch (smsError) {
      console.error('SMS sending error:', smsError);
      res.status(500).json({
        success: false,
        message: 'Failed to send OTP. Please try again.'
      });
    }
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Verify OTP and Login Citizen
exports.verifyCitizenOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ 
        success: false, 
        message: 'Phone number and OTP are required' 
      });
    }

    // Check if OTP exists and is not expired
    const storedData = otpStore.get(phone);
    if (!storedData) {
      return res.status(401).json({ 
        success: false, 
        message: 'OTP not found or expired. Please request a new OTP.' 
      });
    }

    // Check if OTP has expired
    if (Date.now() - storedData.createdAt > storedData.expiresIn) {
      otpStore.delete(phone);
      return res.status(401).json({ 
        success: false, 
        message: 'OTP has expired. Please request a new OTP.' 
      });
    }

    // Check OTP attempts
    if (storedData.attempts >= 3) {
      otpStore.delete(phone);
      return res.status(401).json({ 
        success: false, 
        message: 'Maximum OTP attempts exceeded. Please request a new OTP.' 
      });
    }

    // Verify OTP
    if (otp !== storedData.otp) {
      storedData.attempts += 1;
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid OTP. Please try again.',
        attemptsRemaining: 3 - storedData.attempts
      });
    }

    // OTP is valid, find or create citizen user
    let user = await User.findOne({ phone });
    
    if (!user) {
      // Create new citizen user
      user = new User({
        phone,
        name: `Citizen-${phone.slice(-4)}`,
        email: `citizen-${Date.now()}@grams.local`,
        role: 'citizen',
        isPhoneVerified: true
      });
      await user.save();
    } else {
      // Update phone verification status
      user.isPhoneVerified = true;
      await user.save();
    }

    // Clear OTP from store
    otpStore.delete(phone);

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        phone: user.phone,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
};

// Google OAuth Login
exports.googleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ message: 'ID token is required' });
    }

    // Verify the ID token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, uid } = decodedToken;

    if (!email) {
      return res.status(400).json({ message: 'Email not found in token' });
    }

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = new User({
        name: name || email.split('@')[0],
        email,
        role: 'user',
        // For OAuth users, we don't store password
        password: Math.random().toString(36).slice(-10), // Random placeholder
      });
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: picture,
      },
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ message: 'Google authentication failed' });
  }
};

