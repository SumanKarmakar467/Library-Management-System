const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = '0.0.0.0';

// import database connection file
const DbConnection = require('./databaseConnection.js')

DbConnection();

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error('CORS blocked for this origin'));
    },
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Library API is running' });
});

app.use('/users', usersRouter);
app.use('/books', booksRouter);

app.listen(PORT, HOST, () => {
  console.log(`Server is running up at http://${HOST}:${PORT}`);
});
