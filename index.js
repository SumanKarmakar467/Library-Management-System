const express = require('express');
const cors = require('cors');

const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Home Page :-' });
});

app.use('/users', usersRouter);
app.use('/books', booksRouter);

app.listen(PORT, () => {
  console.log(`Server is running up at http://localhost:${PORT}`);
});
