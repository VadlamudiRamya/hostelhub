HostelHub – Comprehensive Hostel Management System
HostelHub is a modern, full-stack hostel management platform designed to streamline administrative tasks and improve the student living experience. It provides a robust interface for both administrators and students to manage room allocations, track attendance, handle complaints, monitor fees, and stay updated with hostel notices.

🚀 Features
For Administrators
Student Management: View, add, and manage student profiles.
Room Management: Create rooms, set capacities, and monitor occupancy levels.
Room Allotment: Assign or reassign rooms to students with automatic occupancy updates.
Attendance Tracking: Monitor student attendance logs and percentages.
Fee Management: Track fee statuses and amounts for all students.
Complaint Resolution: View and update the status of student complaints (Pending, In Progress, Resolved).
Notices & Announcements: Post and manage notices for all hostel residents.
Food Menu Management: Update and display the weekly mess menu.
For Students
Personal Dashboard: Overview of room details, attendance, and recent notices.
Profile Management: View and edit personal information (Name, Phone, Course).
Room Details: View assigned room information, capacity, and current roommates.
Attendance Log: Track daily attendance and view overall attendance percentage.
Complaints System: File new complaints and track their resolution status.
Hostel Menu: Access the weekly food menu.
Fee Status: Check payment history and upcoming fee requirements.
🛠 Tech Stack
Backend: Node.js, Express.js
Database: MongoDB Atlas (Mongoose ODM)
Authentication: JSON Web Tokens (JWT), bcryptjs for password hashing
Frontend: HTML5, CSS3 (Bootstrap 5), JavaScript (Vanilla)
Environment Management: dotenv
CORS: Enabled for cross-origin resource sharing
📂 Project Structure
HostelHub/
├── backend/                # Node.js + Express Server
│   ├── config/             # Database configuration
│   ├── controllers/        # Business logic for all modules
│   ├── middleware/         # JWT Auth & route protection
│   ├── models/             # Mongoose schemas (User, Room, etc.)
│   ├── routes/             # API endpoint definitions
│   ├── seedData.js         # Database seeding script
│   └── server.js           # Main entry point
├── css/                    # Shared CSS styles
├── js/                     # Frontend API & data helper scripts
├── frontend/               # Frontend-specific assets
├── admin-*.html            # Admin-facing dashboard pages
├── student-*.html          # Student-facing dashboard pages
├── login.html              # Shared login page
├── signup.html             # Student registration page
└── README.md               # Project documentation
⚙️ Setup & Installation
1. Prerequisites
Node.js installed on your machine.
A MongoDB Atlas account and a cluster set up.
2. Backend Configuration
Navigate to the backend directory:
cd backend
Install dependencies:
npm install
Create a .env file in the backend/ folder:
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
(Optional) Seed the database with sample data:
npm run seed
Start the server:
npm run dev   # for development with nodemon
# OR
npm start     # for production
3. Frontend Configuration
Ensure the API_BASE_URL in js/api.js matches your backend server URL (default: http://localhost:5000).
Open login.html or index.html in your browser to access the application.
📊 Database Schema Overview
Users: Stores authentication data, roles, and room assignments.
Rooms: Manages room numbers, types (AC/Non-AC), capacities, and occupant lists.
Attendance: Logs daily attendance status for students.
Complaints: Tracks student issues and their resolution status.
FoodMenu: Stores the weekly breakfast, lunch, snacks, and dinner schedule.
Fees & Payments: Manages student financial records and transaction logs.
🛡 Security
JWT Protection: Sensitive routes are protected by JWT authentication.
Role-Based Access Control (RBAC): Distinct dashboards and capabilities for Admins and Students.
Password Hashing: Uses bcryptjs with salt rounds for secure storage.
📜 License
This project is licensed under the LICENSE file.
