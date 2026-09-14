import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Shield, ArrowRight, User } from 'lucide-react';
import { API_BASE_URL } from '../config';

function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const toastId = toast.loading('Authenticating credentials...');
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/students/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      toast.success('Login Successful!', { id: toastId });
      
      // Save user to local storage
      if (data.student) {
        localStorage.setItem('user', JSON.stringify(data.student));
      }
      
      navigate('/dashboard');
      setFormData({ email: '', password: '' });
    } catch (error) {
      toast.error(error.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-split-container">
      <div className="login-left">
        <div className="login-hero-content">
          <h1>Welcome to the Future of Learning.</h1>
          <p>Access your classes, manage assignments, and track your academic progress all in one secure place.</p>
          
          <div className="feature-list">
            <div className="feature-item">
              <div className="f-icon"><Shield size={20} /></div>
              <span>Bank-level secure authentication</span>
            </div>
            <div className="feature-item">
              <div className="f-icon"><User size={20} /></div>
              <span>Personalized academic dashboard</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="login-right">
        <div className="login-form-container">
          <div className="login-header">
            <h2>Student Login</h2>
            <p>Enter your credentials to access your portal</p>
          </div>
          
          <form onSubmit={handleSubmit} className="premium-form">
            <div className="form-group">
              <label>University Email</label>
              <div className="input-wrapper">
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="student@university.edu"
                  required 
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="form-group">
              <div className="label-row">
                <label>Password</label>
                <span className="forgot-password">Forgot password?</span>
              </div>
              <div className="input-wrapper">
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  placeholder="••••••••"
                  required 
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <button type="submit" className="login-submit-btn" disabled={isLoading}>
              {isLoading ? 'Verifying...' : (
                <>Sign In Securely <ArrowRight size={18} /></>
              )}
            </button>
            
            <div className="auth-footer">
              <p>Don't have an account? <Link to="/signup">Register here</Link></p>
            </div>
          </form>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .login-split-container {
          display: flex;
          min-height: calc(100vh - 80px);
          width: 100%;
          background: #0f172a;
          overflow: hidden;
        }
        .login-left {
          flex: 1;
          background: linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px;
          border-right: 1px solid rgba(255,255,255,0.05);
          position: relative;
        }
        .login-left::before {
          content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
          background: url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80') center/cover;
          opacity: 0.15; z-index: 0; mix-blend-mode: overlay;
        }
        .login-hero-content {
          position: relative; z-index: 1; max-width: 500px;
        }
        .login-hero-content h1 { font-size: 3rem; color: #fff; margin-bottom: 20px; line-height: 1.2; font-weight: 800; }
        .login-hero-content p { font-size: 1.1rem; color: #cbd5e1; margin-bottom: 40px; line-height: 1.6; }
        .feature-item { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; color: #e2e8f0; }
        .f-icon { background: rgba(99,102,241,0.2); color: #818cf8; width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; }
        .login-right {
          flex: 1; display: flex; align-items: center; justify-content: center; padding: 40px; background: #0f172a;
        }
        .login-form-container {
          width: 100%; max-width: 450px; background: rgba(255,255,255,0.02); padding: 50px; border-radius: 24px; border: 1px solid rgba(255,255,255,0.05); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); backdrop-filter: blur(20px);
        }
        .login-header { margin-bottom: 35px; text-align: center; }
        .login-header h2 { font-size: 2rem; color: #fff; margin: 0 0 10px 0; font-weight: 700; }
        .login-header p { color: #94a3b8; margin: 0; }
        .premium-form .form-group { margin-bottom: 25px; }
        .label-row { display: flex; justify-content: space-between; align-items: center; }
        .forgot-password { color: #818cf8; font-size: 0.85rem; cursor: pointer; }
        .forgot-password:hover { text-decoration: underline; }
        .premium-form input {
          width: 100%; padding: 14px 20px; border-radius: 12px; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); color: #fff; font-size: 1rem; transition: all 0.3s;
        }
        .premium-form input:focus { border-color: #6366f1; background: rgba(15,23,42,0.8); box-shadow: 0 0 0 4px rgba(99,102,241,0.1); outline: none; }
        .login-submit-btn {
          width: 100%; padding: 15px; border-radius: 12px; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; font-size: 1.1rem; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.3s; box-shadow: 0 10px 25px -5px rgba(99,102,241,0.4); margin-top: 10px;
        }
        .login-submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 15px 35px -5px rgba(99,102,241,0.5); }
        .login-submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .auth-footer { text-align: center; margin-top: 25px; color: #94a3b8; font-size: 0.95rem; }
        .auth-footer a { color: #818cf8; text-decoration: none; font-weight: 600; margin-left: 5px; }
        .auth-footer a:hover { text-decoration: underline; }
        
        @media (max-width: 900px) {
          .login-left { display: none; }
        }
      `}} />
    </div>
  );
}

export default Login;
