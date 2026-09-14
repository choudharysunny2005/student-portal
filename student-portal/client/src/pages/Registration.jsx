import React, { useState, useEffect } from 'react';
import { Search, UserCheck, GraduationCap, Mail, Hash, Calendar, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';

// Initial pre-populated students for rich visual experience
const initialMockStudents = [
  { _id: '1', name: 'Alex Johnson', email: 'alex.j@university.edu', major: 'B.Tech Computer Science', rollNo: 'CS2026-101', semester: '4', enrollmentDate: new Date('2026-09-10').toLocaleDateString() },
  { _id: '2', name: 'Sophia Chen', email: 'sophia.c@university.edu', major: 'Physics & Thermodynamics', rollNo: 'PH2026-042', semester: '2', enrollmentDate: new Date('2026-09-11').toLocaleDateString() },
  { _id: '3', name: 'Liam Patel', email: 'liam.p@university.edu', major: 'Electrical Engineering', rollNo: 'EE2026-088', semester: '3', enrollmentDate: new Date('2026-09-12').toLocaleDateString() },
  { _id: '4', name: 'Emma Watson', email: 'emma.w@university.edu', major: 'English Literature', rollNo: 'LT2026-015', semester: '1', enrollmentDate: new Date('2026-09-13').toLocaleDateString() },
];

function Registration() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    major: 'B.Tech Computer Science',
    semester: '1'
  });
  const [message, setMessage] = useState({ text: '', type: '' });
  const [students, setStudents] = useState(initialMockStudents);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch students from the backend with local fallback
  const fetchStudents = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/students`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          setStudents(data);
          return;
        }
      }
    } catch (error) {
      console.log('Using cached/local student registrations', error);
    }
    // Load from localStorage if available
    const local = localStorage.getItem('local_students');
    if (local) {
      try {
        setStudents(JSON.parse(local));
      } catch (e) {}
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: '', type: '' });
    const toastId = toast.loading('Registering student...');

    const newStudentObj = {
      _id: 'std_' + Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      major: formData.major,
      semester: formData.semester,
      rollNo: `CS${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
      enrollmentDate: new Date().toLocaleDateString()
    };

    try {
      const res = await fetch(`${API_BASE_URL}/api/students/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          password: 'defaultPassword123'
        })
      });

      if (res.ok) {
        const data = await res.json();
        toast.success('Student registered successfully! ✨', { id: toastId });
        setFormData({ name: '', email: '', major: 'B.Tech Computer Science', semester: '1' });
        fetchStudents();
      } else {
        throw new Error('Fallback to local registration');
      }
    } catch (error) {
      // Fallback: save to state & localStorage
      const updated = [newStudentObj, ...students];
      setStudents(updated);
      localStorage.setItem('local_students', JSON.stringify(updated));
      toast.success('Student registered and added to enrollments! ✨', { id: toastId });
      setFormData({ name: '', email: '', major: 'B.Tech Computer Science', semester: '1' });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setMessage({ text: '', type: '' }), 4000);
    }
  };

  const filteredStudents = students.filter(s => 
    s.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.major?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <header className="app-header">
        <h1>Student Portal</h1>
        <p>Manage student admissions, course enrollments, and academic registrations.</p>
      </header>

      <div className="form-card">
        <h2>New Student Registration</h2>
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
            <label>University Email</label>
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
            <label>Degree / Major</label>
            <select 
              name="major" 
              value={formData.major} 
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="B.Tech Computer Science">B.Tech Computer Science</option>
              <option value="Physics & Thermodynamics">Physics & Thermodynamics</option>
              <option value="Electrical Engineering">Electrical Engineering</option>
              <option value="English Literature">English Literature</option>
              <option value="Business Administration">Business Administration</option>
            </select>
          </div>
          <div className="form-group">
            <label>Starting Semester</label>
            <select 
              name="semester" 
              value={formData.semester} 
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '16px 20px',
                borderRadius: '14px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#fff',
                fontSize: '1rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Registering...' : 'Register Student ✨'}
          </button>
        </form>
      </div>

      {/* All Registrations Section */}
      <div className="student-list" style={{ maxWidth: '800px', width: '100%', marginTop: '50px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', marginBottom: '25px' }}>
          <div>
            <h3 className="student-list-title" style={{ margin: 0, textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserCheck size={28} color="#818cf8" /> All Registrations
              <span style={{ fontSize: '0.9rem', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', padding: '4px 12px', borderRadius: '20px', border: '1px solid rgba(99, 102, 241, 0.4)' }}>
                {filteredStudents.length} Students
              </span>
            </h3>
          </div>

          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input 
              type="text" 
              placeholder="Search by name, roll no, major..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 15px 10px 38px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                background: 'rgba(0, 0, 0, 0.3)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </div>

        {filteredStudents.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {filteredStudents.map((student) => (
              <div key={student._id || student.email} className="student-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px', padding: '20px 25px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                  }}>
                    {student.name ? student.name.charAt(0).toUpperCase() : 'S'}
                  </div>
                  <div className="student-info">
                    <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', color: '#f8fafc' }}>{student.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', color: '#94a3b8', fontSize: '0.88rem', flexWrap: 'wrap' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Mail size={13} /> {student.email}</span>
                      {student.rollNo && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Hash size={13} /> {student.rollNo}</span>
                      )}
                      {student.semester && (
                        <span>• Sem {student.semester}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="student-major" style={{ margin: 0, fontSize: '0.85rem', padding: '6px 14px' }}>
                    <GraduationCap size={14} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                    {student.major}
                  </div>
                  <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '5px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                    Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', background: 'rgba(255, 255, 255, 0.03)', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)', color: '#94a3b8' }}>
            <p style={{ margin: 0, fontSize: '1.1rem' }}>No registrations found matching "{searchTerm}"</p>
          </div>
        )}
      </div>
    </>
  );
}

export default Registration;

