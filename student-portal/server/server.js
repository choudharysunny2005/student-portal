const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend assets from client/dist
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// Database Connection with graceful fallback
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/student_portal';
mongoose.connect(MONGO_URI, {
  serverSelectionTimeoutMS: 2500 // Fail fast if no local MongoDB is running
})
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.log('⚠️ MongoDB not detected. Operating in high-speed In-Memory Mode.'));

// API Routes
app.use('/api/students', require('./routes/studentRoutes'));

// Unified Catch-all route to serve React Single Page App
app.get('*', (req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <div style="font-family: sans-serif; text-align: center; padding: 50px;">
        <h2>🎓 Student Portal API is Live!</h2>
        <p>Frontend dev server is running on <a href="http://localhost:3000">http://localhost:3000</a></p>
      </div>
    `);
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Unified Student Portal is running on http://localhost:${PORT}`);
});

