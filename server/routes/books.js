const express = require('express');
const { books } = require('../data/books.json');
const { users } = require('../data/users.json');

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

router.get('/', (req, res) => {
  res.status(200).json({ success: true, data: books });
});

router.post('/', (req, res) => {
  const { id, name, author, genre, price, publisher } = req.body;
  if (!id || !name || !author || !genre || !price || !publisher) {
    return res.status(400).json({ success: false, message: 'Please provide all the required fields' });
  }

  const exists = books.find((each) => each.id === id);
  if (exists) {
    return res.status(409).json({ success: false, message: `Book is Already Exists with id:${id}` });
  }

  books.push({ id, name, author, genre, price, publisher });
  return res.status(201).json({ success: true, message: 'Book Added Successfully' });
});

router.post('/issued', (req, res) => {
  const { userId, bookId, issueDate, returnDate } = req.body;
  if (!userId || !bookId || !issueDate || !returnDate) {
    return res.status(400).json({ success: false, message: 'userId, bookId, issueDate, returnDate are required' });
  }

  const user = users.find((u) => u.id === String(userId));
  if (!user) return res.status(404).json({ success: false, message: `User Not Found for id:${userId}` });

  const book = books.find((b) => b.id === String(bookId));
  if (!book) return res.status(404).json({ success: false, message: `Book Not Found for id:${bookId}` });

  const alreadyIssued = users.some((u) => String(u.issueBook) === String(bookId));
  if (alreadyIssued) {
    return res.status(409).json({ success: false, message: 'Book is already issued to another user' });
  }

  user.issueBook = String(bookId);
  user.issuedDate = issueDate;
  user.returnDate = returnDate;
  user.borrowedBooks = Array.isArray(user.borrowedBooks) ? user.borrowedBooks : [];
  if (!user.borrowedBooks.includes(String(bookId))) user.borrowedBooks.push(String(bookId));

  return res.status(200).json({ success: true, message: 'Book issued successfully', data: issuedRecord(user, book) });
});

router.get('/issued', (req, res) => {
  const issuedBooks = users
    .filter((u) => u.issueBook)
    .map((u) => {
      const book = books.find((b) => b.id === String(u.issueBook));
      if (!book) return null;
      return issuedRecord(u, book);
    })
    .filter(Boolean);

  return res.status(200).json({ success: true, data: issuedBooks });
});

router.get('/issued/withFine', (req, res) => {
  const withFine = users
    .filter((u) => u.issueBook)
    .map((u) => {
      const book = books.find((b) => b.id === String(u.issueBook));
      if (!book) return null;
      const record = issuedRecord(u, book);
      return record.fine > 0 ? record : null;
    })
    .filter(Boolean);

  return res.status(200).json({ success: true, data: withFine });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  const book = books.find((each) => each.id === id);
  if (!book) {
    return res.status(404).json({ success: false, message: `Books Not Found for id: ${id}` });
  }
  return res.status(200).json({ success: true, data: book });
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const book = books.find((each) => each.id === id);
  if (!book) {
    return res.status(404).json({ success: false, message: `Book Not Found for id:${id}` });
  }

  const updatedBook = books.map((each) => (each.id === id ? { ...each, ...data } : each));
  return res.status(200).json({ success: true, data: updatedBook, message: 'Book Updated Successfully' });
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const book = books.find((each) => each.id === id);
  if (!book) {
    return res.status(404).json({ success: false, message: `Book Not Found for id:${id}` });
  }

  const isIssued = users.some((u) => String(u.issueBook) === String(id));
  if (isIssued) {
    return res.status(400).json({ success: false, message: 'Cannot delete book. It is currently issued.' });
  }

  const updatedBooks = books.filter((each) => each.id !== id);
  return res.status(200).json({ success: true, data: updatedBooks, message: 'Book Deleted Successfully' });
});

module.exports = router;
