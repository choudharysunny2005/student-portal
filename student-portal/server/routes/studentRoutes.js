const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');

// @route   POST /api/students/signup
// @desc    Register a new student
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, dob, university, degree, graduationYear, password } = req.body;
    
    // Check if student exists
    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ message: 'Student with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    student = new Student({
      name,
      email,
      phone,
      dob,
      university,
      degree,
      graduationYear,
      password: hashedPassword
    });

    await student.save();
    
    // Don't return password
    student.password = undefined;
    res.status(201).json({ message: 'Registration successful', student });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/students/login
// @desc    Login student
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if student exists
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Login successful
    student.password = undefined;
    res.json({ message: 'Login successful', student });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server Error' });
  }
});

module.exports = router;
