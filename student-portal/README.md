# 🎓 Student Portal

A modern, full-stack student management portal built with **React**, **Vite**, **Express**, and **MongoDB**. Features include authentication, course schedules, dynamic calendar, lecture notes download, live GPS/camera attendance verification, grade tracking, fee payments, and library book management.

---

## 🚀 Features

- **Authentication & Registration**: Multi-step wizard registration and login with bcrypt encryption.
- **Dynamic Academic Dashboard**: Personalized greetings, CGPA analytics, attendance charts (Recharts), and course progress.
- **Course & Class Management**: Schedule view with notes download, assignment submissions, and class discussions.
- **Attendance Verification**: Live GPS and webcam verification module.
- **Notification System**: Real-time notifications and notification detail view.
- **Fee Management & Library Portal**: Interactive modals for tuition fees and digital book renewals.
- **Official Transcript Generator**: One-click download of student transcripts.

---

## 🛠️ Technology Stack

- **Frontend**:
  - React 18
  - Vite
  - React Router DOM v7
  - Lucide React (Icons)
  - Recharts (Data Visualization)
  - React Hot Toast
  - React Calendar
  - Vanilla CSS (Glassmorphism design system)

- **Backend**:
  - Node.js & Express.js
  - MongoDB & Mongoose
  - bcryptjs (Password Hashing)
  - CORS & dotenv

---

## 📦 Project Structure

```
student-portal/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Navbar, CreditPopup, etc.
│   │   ├── pages/          # Dashboard, Login, Signup, Registration, ClassDetails, etc.
│   │   ├── App.jsx         # App router and global toasts
│   │   ├── index.css       # Global design system & theme
│   │   └── main.jsx
│   └── package.json
├── server/                 # Express backend
│   ├── models/             # Mongoose schemas (Student.js)
│   ├── routes/             # Express API routes (studentRoutes.js)
│   ├── server.js           # Server entry point
│   └── package.json
└── package.json            # Root workspace scripts
```

---

## ⚡ Quick Start

### 1. Install Dependencies
Run the install command from the root directory:
```bash
npm run install:all
```
*Or install separately:*
```bash
cd server && npm install
cd ../client && npm install
```

### 2. Configure Environment (Optional)
In `server/.env`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/student_portal
```

### 3. Run Development Servers
From the root directory:
```bash
npm run dev
```
*Or run individually:*
- **Backend**: `cd server && npm run dev` (Runs on `http://localhost:5000`)
- **Frontend**: `cd client && npm run dev` (Runs on `http://localhost:5173`)

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/students` | Get all registered students |
| `POST` | `/api/students/signup` | Register a new student profile |
| `POST` | `/api/students/login` | Authenticate student credentials |
| `GET` | `/` | Health check endpoint |

---

## 👥 Credits

Developed by **Kamlesh** & **Sunny Choudhary**.
