const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const Student = require('../models/Student');

// @route   GET /api/students
// @desc    Get all registered students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().select('-password').sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/students/signup
// @desc    Register a new student
router.post('/signup', async (req, res) => {
  try {
    const { name, email, phone, dob, university, degree, graduationYear, major, semester, enrollmentNo, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    // Check if student exists
    let student = await Student.findOne({ email });
    if (student) {
      return res.status(400).json({ message: 'Student with this email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Auto-generate roll number if missing
    const rollNo = `CS${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const generatedEnrollmentNo = enrollmentNo || `ENR${Math.floor(1000000 + Math.random() * 9000000)}`;

    student = new Student({
      name,
      email,
      phone: phone || '',
      dob: dob || '',
      university: university || 'University',
      degree: degree || major || 'B.Tech Computer Science',
      graduationYear: graduationYear || `${new Date().getFullYear() + 4}`,
      major: major || degree || 'General',
      semester: semester || '1',
      enrollmentNo: generatedEnrollmentNo,
      rollNo,
      password: hashedPassword
    });

    await student.save();
    
    // Convert to object and omit password
    const studentData = student.toObject();
    delete studentData.password;
    
    res.status(201).json({ message: 'Registration successful', student: studentData });
  } catch (error) {
    console.error('Signup error:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// @route   POST /api/students/login
// @desc    Login student
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

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

    // Login successful - omit password
    const studentData = student.toObject();
    delete studentData.password;
    
    res.json({ message: 'Login successful', student: studentData });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
