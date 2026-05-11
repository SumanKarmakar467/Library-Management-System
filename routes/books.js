const express = require("express");
const { books } = require('../data/books.json');
const {users} = require("../data/users.json");

const router = express.Router();


/**
 * Route: /books
 * Method: GET
 * Description: Get all the list of books in the system
 * Access: Public 
 * Parameters: None
 */
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: books,
    })
})


/**
 * Route: /books/:id
 * Method: GET
 * Description: Get a books by their ID
 * Access: Public 
 * Parameters: id
 */
router.get('/:id', (req, res) => {

    const {id} = req.params;
    const book = books.find((each) => each.id === id)

    if(!book){
        return res.status(404).json({
            success: false,
            message: `Books Not Found for id: ${id}`
        })
    }
    res.status(200).json({
        success: true,
        data: book
    })
})



/**
 * Route: /books
 * Method: POST
 * Description: Add/Register a new books
 * Access: Public 
 * Parameters: None
 */
router.post('/',(req, res) => {
    // req.body should have the follwing fields
    const{id, name, author, genre, price, publisher} = req.body;

    // check if all the required fiels are present 
    if(!id || !name || !author || !genre || !price || !publisher){
        return res.status(400).json({
            success: false,
            message: "Please provide all the required fields"
        })
    }

    // check if the books already exists
    const book = books.find((each) => each.id === id)
    if(book){
        return res.status(409).json({
            success: false,
            message: `Book is Already Exists with id:${id}`
        })
    }

    // If all checks pass, create the user
    // and push it to the books array
    books.push({
        id,
        name,
        author,  
        genre, 
        price,
        publisher
    })

    res.status(201).json({
        success: true,
        message: "Book Added Successfully"
    })
})



/**
 * Route: /books/:id
 * Method: PUT
 * Description: Upadating a book by their ID
 * Access: Public 
 * Parameters: ID
*/
router.put('/:id', (req, res) => {
    const {id} = req.params;
    const {data} = req.body;

    // check if the user exists
    const book = books.find((each) => each.id ===id)
    if(!book){
        return res.status(404).json({
            success: false,
            message: `Book Not Found for id:${id}`
        })
    }

    // If book exists, update the book data
    // Object.assign(book, data);

    // With Spread Operator
    const UpdatedBook = books.map((each) => {
        if(each.id === id){
            return {
                ...each,
                ...data,
            }
        }
        return each
    })

    res.status(200).json({
        success: true,
        data: UpdatedBook,
        message: "Book Updated Successfully"
    })
})



/**
 * Route: /books/:id
 * Method: DELETE
 * Description: Deleting a book by their ID
 * Access: Public 
 * Parameters: ID
*/
router.delete('/:id', (req, res) => {
    const  {id} = req.params;

    // check if the book exists
    const book = books.find((each) => each.id ===id)
    if(!book){
        return res.status(404).json({
            success: false,
            message: `Book Not Found for id:${id}`
        })
    }

    // If book exists, filter it out from the books array
    // 1 method 
    const updatedBooks= books.filter((each) => each.id !== id)

    // 2 method 
    // const index = books.indexOf(book);
    // books.splice(index, 1);


    res.status(200).json({
        success: true,
        data: updatedBooks,
        message: "Book Deleted Successfully"
    })
})



/**
 * Route: /books/issued/for-users
 * Method: GET
 * Description: Get all issued books
 * Access: Public 
 * Parameters: None
*/
router.get('/issued/for-users', (req, res) => {

    // Get users who have issued books
    const usersWithIssuedBooks = users.filter((each) => each.issueBook);

    const issuedBooks = [];

    usersWithIssuedBooks.forEach((each) => {
        const book = books.find((book) => book.id === each.issueBook);

        if (book) {
            issuedBooks.push({
                ...book,
                issuedBy: each.name,
                issuedDate: each.issuedDate,
                returnDate: each.returnDate
            });
        }
    });

    if (issuedBooks.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No Books issued yet"
        });
    }

    res.status(200).json({
        success: true,
        data: issuedBooks
    });
});

module.exports = router;