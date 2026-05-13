const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String },
  dob: { type: String },
  university: { type: String },
  degree: { type: String },
  graduationYear: { type: String },
  major: { type: String, default: 'General' },
  password: { type: String, required: true },
  enrollmentDate: { type: Date, default: Date.now }
}, {
  timestamps: true
});

module.exports = mongoose.model('Student', studentSchema);
