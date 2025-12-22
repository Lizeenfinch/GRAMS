const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const {
  getDashboardStats,
  getAllUsers,
  getAllGrievancesAdmin,
  assignGrievance,
  updateUserRole,
} = require('../controllers/adminController');

router.get('/dashboard', getDashboardStats);
router.get('/users', adminAuth, getAllUsers);
router.get('/grievances', adminAuth, getAllGrievancesAdmin);
router.post('/assign-grievance', adminAuth, assignGrievance);
router.put('/user-role', adminAuth, updateUserRole);

module.exports = router;
