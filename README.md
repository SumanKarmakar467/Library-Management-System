mongodb+srv://karmakarsuman12138_db_user:<db_password>@cluster0.qyld1fz.mongodb.net/?appName=Cluster0

QPt9wozpGspPI4hn

mongodb+srv://karmakarsuman12138_db_user:QPt9wozpGspPI4hn@cluster0.qyld1fz.mongodb.net/?appName=Cluster0

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

npm run dev  :- for run server
npm start :- for run client  

npm i mongoose :- for mongoose download 

npm i dotenv :- for dot env file

## MVC Architecture
    >> M: Model ( Structure of our MongoDB )
    >> V: View ( Frontend )
    >> C: Controllers ( Brain/Logic of a route )





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

## Deploy on Vercel (Frontend) + Hosted Backend

You can deploy the React frontend on Vercel.
Your Express backend should be deployed separately (Render/Railway/Fly.io/etc.).

### 1) Prepare backend URL
Deploy backend first and copy its public URL, for example:
`https://your-library-api.onrender.com`

### 2) Vercel project settings
In Vercel, import this repo and set:
- Build Command: `npm run client:build`
- Output Directory: `build`

### 3) Add environment variable in Vercel
Project Settings -> Environment Variables:
- Key: `REACT_APP_API_BASE_URL`
- Value: your backend URL (without trailing slash)
  Example: `https://your-library-api.onrender.com`

### 4) Redeploy
After adding env var, redeploy the Vercel project.

### 5) Local env
Create `.env.local` from `.env.example` if needed:
- `REACT_APP_API_BASE_URL=http://localhost:3000`

### Important
- Frontend reads API base from `REACT_APP_API_BASE_URL`.
- CORS must allow your Vercel domain on backend.

## Deploy Backend on Render (Express API)

### Files added for deployment
- `render.yaml`
- `index.js` now supports `PORT` and `CORS_ORIGINS`

### Render steps
1. Push code to GitHub.
2. In Render -> New -> Web Service -> connect your repo.
3. Render can auto-detect from `render.yaml`.
4. Add env var in Render:
   - `CORS_ORIGINS` = your Vercel frontend URL
   - Example: `https://your-frontend.vercel.app`
5. Deploy.

After deploy, your backend URL will look like:
- `https://library-management-api.onrender.com`

### Connect backend URL to Vercel frontend
In Vercel Environment Variables:
- `REACT_APP_API_BASE_URL` = your Render URL

Then redeploy Vercel.

## Split Deployment Structure

This repo now includes:
- `client/` -> React frontend (deploy to Vercel)
- `server/` -> Express backend (deploy to Render)

### Deploy Frontend (Vercel)
- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `build`
- Env Var: `REACT_APP_API_BASE_URL=https://<your-render-backend>.onrender.com`

### Deploy Backend (Render)
- Root Directory: `server`
- Build Command: `npm install`
- Start Command: `npm start`
- Env Var: `CORS_ORIGINS=https://<your-vercel-frontend>.vercel.app`

### Local Run (split mode)
Terminal 1:
```bash
cd server
npm install
npm run dev
```
Terminal 2:
```bash
cd client
npm install
npm start
```
