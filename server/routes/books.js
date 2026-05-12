const express = require('express');
const asyncHandler = require('../utils/asyncHandler');
const {
  getAllBooks,
  getSingleBookById,
  addNewBook,
  updateBookById,
  deleteBookById,
  issueBookToUser,
  getAllIssuedBooks,
  getBooksWithFine,
} = require('../controllers/book-controller');

const router = express.Router();

router.get('/', asyncHandler(getAllBooks));
router.post('/', asyncHandler(addNewBook));
router.post('/issued', asyncHandler(issueBookToUser));
router.get('/issued', asyncHandler(getAllIssuedBooks));
router.get('/issued/withFine', asyncHandler(getBooksWithFine));
router.get('/:id', asyncHandler(getSingleBookById));
router.put('/:id', asyncHandler(updateBookById));
router.delete('/:id', asyncHandler(deleteBookById));

module.exports = router;
