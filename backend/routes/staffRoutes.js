
const express = require('express');
const {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} = require('../controllers/staffController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router
  .route('/')
  .get(protect, getStaff)
  .post(protect, admin, createStaff);

router
  .route('/:id')
  .get(protect, getStaffById)
  .put(protect, admin, updateStaff)
  .delete(protect, admin, deleteStaff);

module.exports = router;
