import React, { useState, useEffect } from 'react';

function Registration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    major: ''
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [students, setStudents] = useState([]);

  // Fetch students from the backend
  const fetchStudents = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/students');
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (error) {
      console.error('Failed to fetch students', error);
    }
  };

  // Load students on component mount
  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      const res = await fetch('http://localhost:5000/api/students/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          password: 'defaultPassword123' // default password since it's an admin-type interface
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setMessage({ text: 'Student registered successfully! ✨', type: 'success' });
      setFormData({ name: '', email: '', major: '' }); // Reset form
      fetchStudents(); // Refresh the list of students
      
      // Clear success message after 4 seconds
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
      
    } catch (error) {
      setMessage({ text: error.message, type: 'error' });
    }
  };

  return (
    <>
      <header className="app-header">
        <h1>Student Portal</h1>
        <p>Manage enrollments with a modern, dynamic experience.</p>
      </header>

      <div className="form-card">
        <h2>New Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              placeholder="e.g. Jane Doe"
              required 
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="jane@university.edu"
              required 
            />
          </div>
          <div className="form-group">
            <label>Major / Course</label>
            <input 
              type="text" 
              name="major" 
              value={formData.major} 
              onChange={handleChange} 
              placeholder="e.g. Computer Science"
              required 
            />
          </div>
          <button type="submit" className="submit-btn">Register Student</button>
        </form>

        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </div>

      {students.length > 0 && (
        <div className="student-list">
          <h3 className="student-list-title">Recent Enrollments</h3>
          {students.map((student) => (
            <div key={student._id} className="student-card">
              <div className="student-info">
                <h3>{student.name}</h3>
                <p>{student.email}</p>
              </div>
              <div className="student-major">
                {student.major}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Registration;
