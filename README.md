# Library-Management-System

    This is a library management API Backend for the management of users and the books

# Routes and the Endpoints

## /users
GET:Get all the list of users in the system
POST:Create/Register a new user

## /users{id}
GET: Get a user by their ID
PUT: Updating a user by their ID 
DELETE: Deleting a user by their ID (Check if the user still has an issued book) && {is there any fine/penalty to be collected}

## /users/subscription-details/{id}
GET: Get a user subscription details by their ID
    >> Date of subscription 
    >> Valid till ?
    >> Fine if any ?


## /books
GET: Get all the books in the system

POST: Add a new book to the system

## /books{id}
GET: Get a book by it's ID

PUT: Update a book by it's ID

DELETE: Delete a book it's ID

## /books/issued
GET: Get all the issued books 

## /books/issued/withFine
GET: Get all issued books with their fine amount 

### Subscription Types 
    >> Basic (3 months)
    >> Standard (6 months)
    >> Premium (12 months)


>> If a user misses the renewel date, then user should be collected with $100
>> If the fuser misses his subscription, then user is expected to pay $100
>> If the user misses both renewel & subscription, then the collected amount should be $200


## Commands: installing express and node
npm init
npm i express
node i nodemon  --save-dev

npm run dev  :- for run 

To restore node_modules and package-lock.json --> npm i/ npm install
## Frontend Setup (React)

The React frontend is in the same project root (there is no separate `client` folder).

Frontend files are here:
- `src/` (App, pages, components, api)
- `public/index.html` (Tabler Icons CDN added)

### Added dependencies
- `cors`
- `react`
- `react-dom`
- `react-scripts`

### Added scripts
- `npm run client:start` -> run React dev server
- `npm run client:build` -> create production build

### Run the app
Open terminal in project root:

1. Start backend:
```bash
npm run dev
```

2. Start frontend in a second terminal:
```bash
npm run client:start
```

Note:
- Backend is running on `http://localhost:3000`.
- React dev server also prefers `3000`, so it will ask to use another port (usually `3001`). Choose `Y`.
- Then open the shown frontend URL (usually `http://localhost:3001`).
