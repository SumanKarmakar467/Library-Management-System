const express = require('express');
const { BookModel, UserModel } = require('../models');

const router = express.Router();

const SUB_DAYS = {
  Basic: 90,
  Standard: 180,
  Premium: 365,
};

function parseDate(value) {
  if (!value) return null;
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) return d;

  const parts = String(value).split('/');
  if (parts.length === 3) {
    const [dd, mm, yyyy] = parts.map(Number);
    const parsed = new Date(yyyy, mm - 1, dd);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return null;
}

function normalizeDate(value) {
  const d = parseDate(value);
  return d ? d.toISOString() : null;
}

function calcFine(user) {
  const now = new Date();
  const returnDate = parseDate(user.returnDate);
  const subStart = parseDate(user.subscriptionDate);
  const membership = user.membership || user.subscriptionType;

  const overdue = returnDate ? returnDate < now : false;
  const subExpired = subStart && membership
    ? new Date(subStart.getTime() + (SUB_DAYS[membership] || 0) * 24 * 60 * 60 * 1000) < now
    : false;

  if (overdue && subExpired) return 200;
  if (overdue || subExpired) return 100;
  return 0;
}

function issuedRecord(user, book) {
  return {
    id: book.id,
    name: book.name,
    author: book.author,
    genre: book.genre,
    price: book.price,
    issuedTo: user.id,
    userId: user.id,
    issuedBy: user.name,
    issueDate: normalizeDate(user.issuedDate),
    returnDate: normalizeDate(user.returnDate),
    fine: calcFine(user),
  };
}

router.get('/', async (req, res) => {
  const books = await BookModel.find().sort({ createdAt: -1 }).lean();
  res.status(200).json({ success: true, data: books });
});

router.post('/', async (req, res) => {
  const { id, name, author, genre, price, publisher, subscription } = req.body;
  if (!id || !name || !author || !genre || price == null || !publisher) {
    return res.status(400).json({ success: false, message: 'Please provide all the required fields' });
  }

  const exists = await BookModel.findOne({ id }).lean();
  if (exists) {
    return res.status(409).json({ success: false, message: `Book is Already Exists with id:${id}` });
  }

  await BookModel.create({ id, name, author, genre, price: Number(price), publisher, subscription });
  return res.status(201).json({ success: true, message: 'Book Added Successfully' });
});

router.post('/issued', async (req, res) => {
  const { userId, bookId, issueDate, returnDate } = req.body;
  if (!userId || !bookId || !issueDate || !returnDate) {
    return res.status(400).json({ success: false, message: 'userId, bookId, issueDate, returnDate are required' });
  }

  const user = await UserModel.findOne({ id: String(userId) });
  if (!user) return res.status(404).json({ success: false, message: `User Not Found for id:${userId}` });

  const book = await BookModel.findOne({ id: String(bookId) }).lean();
  if (!book) return res.status(404).json({ success: false, message: `Book Not Found for id:${bookId}` });

  const alreadyIssued = await UserModel.exists({ issueBook: String(bookId) });
  if (alreadyIssued) {
    return res.status(409).json({ success: false, message: 'Book is already issued to another user' });
  }

  user.issueBook = String(bookId);
  user.issuedDate = issueDate;
  user.returnDate = returnDate;
  user.borrowedBooks = Array.isArray(user.borrowedBooks) ? user.borrowedBooks : [];
  if (!user.borrowedBooks.includes(String(bookId))) user.borrowedBooks.push(String(bookId));
  await user.save();

  return res.status(200).json({ success: true, message: 'Book issued successfully', data: issuedRecord(user.toObject(), book) });
});

router.get('/issued', async (req, res) => {
  const users = await UserModel.find({ issueBook: { $ne: null } }).lean();
  const issuedBooks = [];

  for (const u of users) {
    const book = await BookModel.findOne({ id: String(u.issueBook) }).lean();
    if (book) issuedBooks.push(issuedRecord(u, book));
  }

  return res.status(200).json({ success: true, data: issuedBooks });
});

router.get('/issued/withFine', async (req, res) => {
  const users = await UserModel.find({ issueBook: { $ne: null } }).lean();
  const withFine = [];

  for (const u of users) {
    const book = await BookModel.findOne({ id: String(u.issueBook) }).lean();
    if (!book) continue;
    const record = issuedRecord(u, book);
    if (record.fine > 0) withFine.push(record);
  }

  return res.status(200).json({ success: true, data: withFine });
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const book = await BookModel.findOne({ id }).lean();
  if (!book) {
    return res.status(404).json({ success: false, message: `Books Not Found for id: ${id}` });
  }
  return res.status(200).json({ success: true, data: book });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const book = await BookModel.findOneAndUpdate({ id }, { $set: data || {} }, { new: true }).lean();
  if (!book) {
    return res.status(404).json({ success: false, message: `Book Not Found for id:${id}` });
  }

  return res.status(200).json({ success: true, data: book, message: 'Book Updated Successfully' });
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const book = await BookModel.findOne({ id }).lean();
  if (!book) {
    return res.status(404).json({ success: false, message: `Book Not Found for id:${id}` });
  }

  const isIssued = await UserModel.exists({ issueBook: String(id) });
  if (isIssued) {
    return res.status(400).json({ success: false, message: 'Cannot delete book. It is currently issued.' });
  }

  await BookModel.deleteOne({ id });
  const books = await BookModel.find().sort({ createdAt: -1 }).lean();
  return res.status(200).json({ success: true, data: books, message: 'Book Deleted Successfully' });
});

module.exports = router;
