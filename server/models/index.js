const UserModel = require('./user-model');
const BookModel = require('./book-model');

module.exports ={
    UserModel,
    BookModel
};
// This file serves as an index for the models, allowing for easier imports in other parts of the application.
// It exports the UserModel & BookModel, which can be used in routes or controllers to interact with the database.
