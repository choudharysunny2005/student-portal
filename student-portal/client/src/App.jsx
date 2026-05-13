import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Registration from './pages/Registration';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ClassDetails from './pages/ClassDetails';
import NotificationDetails from './pages/NotificationDetails';
import CreditPopup from './components/CreditPopup';

function App() {
  return (
    <Router>
      <Toaster position="top-right" toastOptions={{ 
        style: { 
          background: 'rgba(15, 23, 42, 0.9)', 
          color: '#fff',
          border: '1px solid rgba(99, 102, 241, 0.4)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
        } 
      }} />
      <CreditPopup />
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/class/:id" element={<ClassDetails />} />
          <Route path="/notification/:id" element={<NotificationDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
