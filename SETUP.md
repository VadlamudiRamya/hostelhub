# HostelHub Setup Guide

## Prerequisites
- Node.js installed
- MongoDB installed and running

## Quick Start

### Step 1: Install Backend Dependencies
```
bash
cd hostelhub-backend
npm install
```

### Step 2: Configure Environment Variables
Edit the `.env` file in `hostelhub-backend/` folder:
```
MONGO_URI=mongodb://localhost:27017/hostelhub
JWT_SECRET=your-super-secret-jwt-key-change-this
PORT=5000
```

### Step 3: Seed the Database
```
bash
cd hostelhub-backend
node seed.js
```

This will create:
- Admin user: admin@hostelhub.com / admin123
- Student users: arjun@example.com / student123

### Step 4: Start the Backend
```
bash
# Development mode (with auto-reload)
npm run dev

# OR Production mode
npm start
```

The backend will run on http://localhost:5000

### Step 5: Access the Application
Open http://localhost:5000 in your browser

## Login Credentials
- **Admin**: admin@hostelhub.com / admin123
- **Student**: arjun@example.com / student123

## Troubleshooting

### "Login failed" or "Cannot connect to server"
1. Make sure MongoDB is running: `mongod`
2. Make sure backend is running: `npm start` (in hostelhub-backend folder)
3. Check console for errors

### "Invalid credentials"
1. Make sure you ran `node seed.js` to create users
2. Use correct password: admin123 or student123

### CORS Errors
If you see CORS errors, make sure the backend is running and serving the frontend.

## API Endpoints
- POST /api/auth/login - User login
- POST /api/auth/register - User registration
- GET /api/auth/profile - Get current user (requires auth)
- GET /api/students - List students (admin)
- GET /api/rooms - List rooms (admin)
- GET /api/complaints - List complaints
- GET /api/notices - List notices
- GET /api/menu - List menu items
