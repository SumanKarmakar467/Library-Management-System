const express = require("express");
const {users} = require("../data/users.json");

const router = express.Router();


/**
 * Route: /users
 * Method: GET
 * Description: Get all the list of users in the system
 * Access: Public 
 * Parameters: None
 */
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data: users
    })
})


/**
 * Route: /users/:id
 * Method: GET
 * Description: Get a user by their ID
 * Access: Public 
 * Parameters: id
 */
router.get('/:id', (req, res) => {

    const {id} = req.params;
    const user = users.find((each) => each.id === id)

    if(!user){
        return res.status(404).json({
            success: false,
            message: `User Not Found for id: ${id}`
        })
    }
    res.status(200).json({
        success: true,
        data: user
    })
})

/**
 * Route: /users
 * Method: POST
 * Description: Create/Register a new user
 * Access: Public 
 * Parameters: None
 */
router.post('/',(req, res) => {
    // req.body should have the follwing fields
    const{id, name, email, role, membership,subscriptionDate} = req.body;

    // check if all the required fiels are present 
    if(!id || !name || !email || !role || !membership || !subscriptionDate){
        return res.status(400).json({
            success: false,
            message: "Please provide all the required fields"
        })
    }

    // check if the user already exists
    const user = users.find((each) => each.id === id)
    if(user){
        return res.status(409).json({
            success: false,
            message: `User Already Exists with id:${id}`
        })
    }

    // If all checks pass, create the user
    // and push it to the users array
    users.push({
        id,
        name,
        email,  
        role, 
        membership,
        subscriptionDate
    })

    res.status(201).json({
        success: true,
        message: "User Created Successfully"
    })
})


/**
 * Route: /users/:id
 * Method: PUT
 * Description: Upadating a user by their ID
 * Access: Public 
 * Parameters: ID
*/
router.put('/:id', (req, res) => {
    const {id} = req.params;
    const {data} = req.body;

    // check if the user exists
    const user = users.find((each) => each.id ===id)
    if(!user){
        return res.status(404).json({
            success: false,
            message: `User Not Found for id:${id}`
        })
    }

    // If user exists, update the user data
    // Object.assign(user, data);

    // With Spread Operator
    const UpdatedUser = users.map((each) => {
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
        data: UpdatedUser,
        message: "User Updated Successfully"
    })
})

/**
 * Route: /users/:id
 * Method: DELETE
 * Description: Deleting a user by their ID
 * Access: Public 
 * Parameters: ID
*/
router.delete('/:id', (req, res) => {
    const  {id} = req.params;

    // check if the user exists
    const user = users.find((each) => each.id ===id)
    if(!user){
        return res.status(404).json({
            success: false,
            message: `User Not Found for id:${id}`
        })
    }

    // If user exists, filter it out from the users array
    // 1 method 
    const updatedUsers= users.filter((each) => each.id !== id)

    // 2 method 
    // const index = users.indexOf(user);
    // users.splice(index, 1);


    res.status(200).json({
        success: true,
        data: updatedUsers,
        message: "User Deleted Successfully"
    })
})

/**
 * Route: /users/subscrpition-details/:id
 * Method: GET
 * Description: Get all the Subcription details fo a user by their ID
 * Access: Public 
 * Parameters: ID
*/
router.get('/subscriptiton-details/:id', (req, res) => {
    const {id} = req.params;

    // Find the user by ID
    const user = users.find((each) => each.id === id);
    if(!user){
        return res.status (404).json({
            success: false,
            message: `User Not Found for id: ${id}`
        });
    }

    // Extract the subscription details
    const getDateInDays = (data = '') => {
        let date;
        if(data == ''){
            date = new Date (data);
        }
        else{
            data = new Date();
        }
        return Math.floor(date.getTime() / (1000 * 60 * 24));
    }

    const subscriptionType = (data) => {

    }

    res.status(200).json({
        success: true,
        data: issuedBooks
    });
})


module.exports = router;
