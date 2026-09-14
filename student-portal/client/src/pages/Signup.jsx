import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../config';

function Signup() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    firstName: '', lastName: '', email: '', phone: '',
    course: 'B.Tech Computer Science', semester: '1', enrollmentNo: '',
    password: '', confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    
    setIsLoading(true);
    const toastId = toast.loading('Creating student profile...');
    
    try {
      const payload = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        phone: formData.phone,
        dob: '',
        university: 'University',
        degree: formData.course,
        graduationYear: `${new Date().getFullYear() + 4}`,
        major: formData.course,
        semester: formData.semester,
        enrollmentNo: formData.enrollmentNo,
        password: formData.password
      };

      const response = await fetch(`${API_BASE_URL}/api/students/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      toast.success('Registration Successful! Welcome to the portal.', { id: toastId });
      
      // Save user to local storage
      if (data.student) {
        localStorage.setItem('user', JSON.stringify(data.student));
      }
      
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-card" style={{ marginTop: '50px', maxWidth: '500px' }}>
      <div className="wizard-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>1</div>
        <div className={`progress-line ${step >= 2 ? 'active' : ''}`}></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>2</div>
        <div className={`progress-line ${step >= 3 ? 'active' : ''}`}></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>3</div>
      </div>
      
      <h2 style={{textAlign: 'center', marginBottom: '20px'}}>
        {step === 1 ? 'Personal Details' : step === 2 ? 'Academic Info' : 'Security Setup'}
      </h2>
      
      <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); nextStep(); }}>
        {step === 1 && (
          <div className="wizard-step">
            <div className="form-group-row" style={{display: 'flex', gap: '15px'}}>
              <div className="form-group" style={{flex: 1}}>
                <label>First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Jane" required />
              </div>
              <div className="form-group" style={{flex: 1}}>
                <label>Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" required />
              </div>
            </div>
            <div className="form-group">
              <label>University Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="jane.doe@university.edu" required />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" required />
            </div>
            <button type="submit" className="submit-btn">Next Step →</button>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-step">
            <div className="form-group">
              <label>Course Program</label>
              <select name="course" value={formData.course} onChange={handleChange} style={{width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)'}}>
                <option value="B.Tech Computer Science">B.Tech Computer Science</option>
                <option value="B.Tech Mechanical">B.Tech Mechanical</option>
                <option value="MBA Business">MBA Business Admin</option>
                <option value="B.Sc Physics">B.Sc Physics</option>
              </select>
            </div>
            <div className="form-group-row" style={{display: 'flex', gap: '15px'}}>
              <div className="form-group" style={{flex: 1}}>
                <label>Semester</label>
                <select name="semester" value={formData.semester} onChange={handleChange} style={{width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.1)'}}>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
              <div className="form-group" style={{flex: 2}}>
                <label>Enrollment Number</label>
                <input type="text" name="enrollmentNo" value={formData.enrollmentNo} onChange={handleChange} placeholder="ENR-XXXXXX" required />
              </div>
            </div>
            <div style={{display: 'flex', gap: '15px'}}>
              <button type="button" className="submit-btn" style={{background: 'rgba(255,255,255,0.1)', color: 'white'}} onClick={prevStep}>← Back</button>
              <button type="submit" className="submit-btn">Next Step →</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="wizard-step">
            <div className="form-group">
              <label>Create Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" required minLength="8" />
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" required minLength="8" />
            </div>
            <div style={{display: 'flex', gap: '15px'}}>
              <button type="button" className="submit-btn" style={{background: 'rgba(255,255,255,0.1)', color: 'white'}} onClick={prevStep} disabled={isLoading}>← Back</button>
              <button type="submit" className="submit-btn" disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Complete Registration ✅'}
              </button>
            </div>
          </div>
        )}
      </form>
      
      <style dangerouslySetInnerHTML={{__html: `
        .wizard-progress { display: flex; align-items: center; justify-content: space-between; margin-bottom: 30px; padding: 0 20px; }
        .progress-step { width: 35px; height: 35px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: #94a3b8; font-weight: bold; border: 2px solid rgba(255,255,255,0.1); transition: all 0.3s; z-index: 2; }
        .progress-step.active { background: #6366f1; color: white; border-color: #818cf8; box-shadow: 0 0 15px rgba(99,102,241,0.5); }
        .progress-line { flex: 1; height: 3px; background: rgba(255,255,255,0.1); margin: 0 -5px; z-index: 1; transition: all 0.3s; }
        .progress-line.active { background: #6366f1; }
      `}} />
    </div>
  );
}

export default Signup;
