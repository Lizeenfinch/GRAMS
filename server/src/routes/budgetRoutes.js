const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const {
  getBudgetOverview,
  updateGrievanceBudget,
  addExpense,
  getBudgetTrends,
} = require('../controllers/budgetController');

// Public routes
router.get('/overview', getBudgetOverview);
router.get('/trends', getBudgetTrends);

// Admin/Engineer only routes
router.put('/:id', auth, updateGrievanceBudget);
router.post('/:id/expense', auth, addExpense);

module.exports = router;
