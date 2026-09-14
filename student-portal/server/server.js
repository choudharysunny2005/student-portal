const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection with graceful fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_portal';
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 2500 // Fail fast if no local MongoDB is running
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.log('⚠️ MongoDB not detected. Operating in high-speed In-Memory Mode.'));

// Routes
app.use('/api/students', require('./routes/studentRoutes'));

// Basic Route
app.get('/', (req, res) => {
  res.send('Student Portal API is running!');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
