# SkillMatch AI

A full-stack web application with backend authentication, role-based access control, and separate portals for students and admin.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Authentication:** bcryptjs, JSON Web Tokens (JWT)
- **Frontend:** HTML, CSS, JavaScript

## Project Structure

```
skillmatch/
  server.js              # Express server & MongoDB connection
  package.json           # Dependencies
  .env                   # Environment variables
  models/User.js         # Mongoose User model
  routes/auth.js         # Authentication routes
  middleware/authMiddleware.js  # JWT verification & role-based access
  public/
    signup.html          # Student registration page
    login.html           # Login page
    student.html         # Student portal (protected)
    admin.html           # Admin dashboard (protected)
    style.css            # Styles
    script.js            # Frontend logic
```

## Setup Instructions

### 1. Install Dependencies

```bash
cd skillmatch
npm install
```

### 2. Configure Environment Variables

The `.env` file is pre-configured with:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/skillmatch
JWT_SECRET=your_secret_key
```

Update `JWT_SECRET` with a strong secret for production use.

### 3. Start MongoDB

Make sure MongoDB is running locally on port 27017.

### 4. Create Admin User

Open a MongoDB shell and run the following commands to create an admin account:

```bash
mongosh
```

```javascript
use skillmatch

db.users.insertOne({
  name: "Admin",
  email: "admin@gmail.com",
  password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
  role: "admin"
})
```

> **Note:** The password hash above corresponds to `admin123`. To generate a fresh hash, run:
>
> ```bash
> node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('admin123', 10).then(h => console.log(h));"
> ```
>
> Then use the output as the password value in the insert command.

### 5. Start the Server

```bash
npm start
```

The server will run on `http://localhost:5000`.

### 6. Access the Application

- **Sign Up (Students):** `http://localhost:5000/signup.html`
- **Log In:** `http://localhost:5000/login.html`
- **Student Portal:** `http://localhost:5000/student.html` (requires student login)
- **Admin Dashboard:** `http://localhost:5000/admin.html` (requires admin login)

## API Endpoints

| Method | Endpoint            | Description              | Auth Required |
|--------|---------------------|--------------------------|---------------|
| POST   | `/api/auth/signup`  | Register a new student   | No            |
| POST   | `/api/auth/login`   | Login and get JWT token  | No            |
| GET    | `/api/auth/me`      | Get current user info    | Yes           |
| GET    | `/api/auth/student` | Student protected route  | Yes (student) |
| GET    | `/api/auth/admin`   | Admin protected route    | Yes (admin)   |

## Security Features

- Password hashing with bcryptjs
- JWT-based authentication (1 hour expiry)
- Role-based access control (student/admin)
- Duplicate email prevention
- Protected routes via middleware
