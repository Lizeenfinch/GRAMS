const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getAllGrievances,
  getUserGrievances,
  getGrievanceById,
  createGrievance,
  updateGrievance,
  deleteGrievance,
  addComment,
} = require('../controllers/grievanceController');

router.get('/', auth, getUserGrievances);
router.get('/all', getAllGrievances);
router.get('/:id', auth, getGrievanceById);
router.post('/', auth, createGrievance);
router.put('/:id', auth, updateGrievance);
router.delete('/:id', auth, deleteGrievance);
router.post('/:id/comment', auth, addComment);

module.exports = router;
