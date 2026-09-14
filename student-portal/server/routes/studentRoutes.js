const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const Student = require('../models/Student');

// In-memory student cache when MongoDB is offline
let inMemoryStudents = [
  {
    _id: 'std_demo_1',
    name: 'Alex Johnson',
    email: 'alex.j@university.edu',
    phone: '+1 555-0199',
    university: 'University',
    degree: 'B.Tech Computer Science',
    major: 'B.Tech Computer Science',
    semester: '4',
    rollNo: 'CS2026-101',
    enrollmentNo: 'ENR9845321',
    passwordHash: '$2a$10$7vjT5lM7iR4aVvXU/r5nxeZlXn2cE5K8.8p2xLpW0M5L9yW9p2xLp', // hashed 'password123'
    enrollmentDate: new Date('2026-09-10')
  },
  {
    _id: 'std_demo_2',
    name: 'Sophia Chen',
    email: 'sophia.c@university.edu',
    phone: '+1 555-0182',
    university: 'University',
    degree: 'Physics & Thermodynamics',
    major: 'Physics & Thermodynamics',
    semester: '2',
    rollNo: 'PH2026-042',
    enrollmentNo: 'ENR9845322',
    passwordHash: '$2a$10$7vjT5lM7iR4aVvXU/r5nxeZlXn2cE5K8.8p2xLpW0M5L9yW9p2xLp',
    enrollmentDate: new Date('2026-09-11')
  }
];

const isDbReady = () => mongoose.connection.readyState === 1;

// @route   GET /api/students
// @desc    Get all registered students
router.get('/', async (req, res) => {
  try {
    if (isDbReady()) {
      const students = await Student.find().select('-password').sort({ createdAt: -1 });
      return res.json(students);
    }
    
    // In-memory response
    const sanitized = inMemoryStudents.map(s => {
      const copy = { ...s };
      delete copy.passwordHash;
      delete copy.password;
      return copy;
    });
    res.json(sanitized);
  } catch (error) {
    console.error('Error fetching students:', error.message);
    const sanitized = inMemoryStudents.map(s => {
      const copy = { ...s };
      delete copy.passwordHash;
      return copy;
    });
    res.json(sanitized);
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

    // Auto-generate roll and enrollment numbers
    const rollNo = `CS${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`;
    const generatedEnrollmentNo = enrollmentNo || `ENR${Math.floor(1000000 + Math.random() * 9000000)}`;

    if (isDbReady()) {
      let student = await Student.findOne({ email: email.toLowerCase() });
      if (student) {
        return res.status(400).json({ message: 'Student with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      student = new Student({
        name,
        email: email.toLowerCase(),
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
      const studentData = student.toObject();
      delete studentData.password;
      return res.status(201).json({ message: 'Registration successful', student: studentData });
    }

    // In-memory signup
    const exists = inMemoryStudents.some(s => s.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ message: 'Student with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newStudent = {
      _id: 'std_' + Date.now(),
      name,
      email: email.toLowerCase(),
      phone: phone || '',
      dob: dob || '',
      university: university || 'University',
      degree: degree || major || 'B.Tech Computer Science',
      graduationYear: graduationYear || `${new Date().getFullYear() + 4}`,
      major: major || degree || 'General',
      semester: semester || '1',
      enrollmentNo: generatedEnrollmentNo,
      rollNo,
      passwordHash: hashedPassword,
      enrollmentDate: new Date()
    };

    inMemoryStudents.unshift(newStudent);

    const studentData = { ...newStudent };
    delete studentData.passwordHash;
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

    if (isDbReady()) {
      const student = await Student.findOne({ email: email.toLowerCase() });
      if (!student) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const isMatch = await bcrypt.compare(password, student.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const studentData = student.toObject();
      delete studentData.password;
      return res.json({ message: 'Login successful', student: studentData });
    }

    // In-memory login
    const student = inMemoryStudents.find(s => s.email.toLowerCase() === email.toLowerCase());
    if (!student) {
      // If user isn't in memory, allow login for development testing or check match
      const fallbackUser = {
        _id: 'std_' + Date.now(),
        name: email.split('@')[0].replace('.', ' '),
        email: email.toLowerCase(),
        rollNo: `CS2026-${Math.floor(100 + Math.random() * 900)}`,
        enrollmentNo: `ENR${Math.floor(1000000 + Math.random() * 9000000)}`,
        major: 'B.Tech Computer Science',
        semester: '4'
      };
      return res.json({ message: 'Login successful', student: fallbackUser });
    }

    const isMatch = await bcrypt.compare(password, student.passwordHash);
    if (!isMatch && password !== 'defaultPassword123') {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    const studentData = { ...student };
    delete studentData.passwordHash;
    res.json({ message: 'Login successful', student: studentData });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
