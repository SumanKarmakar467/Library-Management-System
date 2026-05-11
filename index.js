const express = require("express");

// importing the routes
const usersRouter = require('./routes/users');
const booksRouter = require('./routes/books');

const app = express();

const PORT = 8081;

app.use(express.json());

// home page 
app.get("/",(req, res) => {
    res.status(200).json({
        message:"Home Page :-"
    })
})

app.use('/users', usersRouter);
app.use('/books', booksRouter)







app.listen(PORT, () => {
    console.log(`Server is running up at http://localhost:${PORT}`)
})

