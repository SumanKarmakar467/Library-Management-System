const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const {
  getAllUsers,
  getSingleUserById,
  createUser,
  updateUserById,
  deleteUserById,
  getSubscriptionDetailsById,
} = require('../controllers/user-controller');

const router = express.Router();

router.get('/', asyncHandler(getAllUsers));
router.get('/subscription-details/:id', asyncHandler(getSubscriptionDetailsById));
router.get('/:id', asyncHandler(getSingleUserById));
router.post('/', asyncHandler(createUser));
router.put('/:id', asyncHandler(updateUserById));
router.delete('/:id', asyncHandler(deleteUserById));

module.exports = router;
