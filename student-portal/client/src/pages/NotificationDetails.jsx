import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Bell, ArrowLeft, Calendar, FileText, AlertCircle, Clock } from 'lucide-react';

function NotificationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [notification, setNotification] = useState(null);

  // Hardcoded fallback data in case state wasn't passed via router
  const fallbackData = {
    1: { title: 'Assignment Due Tomorrow', message: 'Math Worksheet 4.1 is due at 11:59 PM. Please make sure to submit your PDF file via the assignments tab.', iconType: 'alert', date: 'Oct 12, 2026', sender: 'Prof. Robert Smith' },
    2: { title: 'Class Rescheduled', message: 'Physics lecture moved to 2:00 PM today due to an unavoidable conflict. Please check the updated schedule.', iconType: 'calendar', date: 'Oct 12, 2026', sender: 'Dept of Physics' },
    3: { title: 'New Notes Uploaded', message: 'Prof. Turing uploaded CS101 Slides for Binary Trees. They are now accessible 24/7 in your class portal.', iconType: 'file', date: 'Oct 11, 2026', sender: 'Dr. Alan Turing' }
  };

  useEffect(() => {
    // If state was passed from the Navbar, use it. Otherwise, use fallback.
    if (location.state && location.state.notif) {
      setNotification({
        ...location.state.notif,
        date: location.state.notif.date || 'Just now',
        sender: location.state.notif.sender || 'System Administrator'
      });
    } else {
      setNotification(fallbackData[id] || { title: 'Notification Details', message: 'No details available for this notification.', date: 'Unknown', sender: 'System' });
    }
  }, [id, location]);

  if (!notification) {
    return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Loading...</div>;
  }

  const renderIcon = () => {
    if (notification.iconType === 'alert') return <AlertCircle size={40} color="#f87171" />;
    if (notification.iconType === 'calendar') return <Calendar size={40} color="#60a5fa" />;
    if (notification.iconType === 'file') return <FileText size={40} color="#4ade80" />;
    return <Bell size={40} color="#818cf8" />;
  };

  return (
    <div style={{ width: '100%', maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <button 
        onClick={() => navigate(-1)} 
        style={{
          background: 'rgba(255,255,255,0.1)', border: 'none', color: '#e2e8f0', 
          padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', 
          display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '30px',
          transition: 'background 0.2s'
        }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.2)'}
        onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
      >
        <ArrowLeft size={18} /> Back
      </button>

      <div style={{
        background: 'rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '16px', padding: '40px',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '25px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '30px' }}>
          <div style={{
            background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '50%',
            display: 'flex', justifyContent: 'center', alignItems: 'center'
          }}>
            {renderIcon()}
          </div>
          <div>
            <h1 style={{ margin: '0 0 10px 0', fontSize: '2.2rem', color: '#f8fafc' }}>{notification.title}</h1>
            <div style={{ display: 'flex', gap: '20px', color: '#94a3b8', fontSize: '0.95rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Clock size={16} /> {notification.date}</span>
              <span>•</span>
              <span><strong>From:</strong> {notification.sender}</span>
            </div>
          </div>
        </div>

        <div style={{ color: '#e2e8f0', fontSize: '1.1rem', lineHeight: '1.7', background: 'rgba(0,0,0,0.2)', padding: '25px', borderRadius: '12px' }}>
          {notification.message}
        </div>
        
        <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'flex-end' }}>
           <button 
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none', color: '#fff', 
              padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1rem',
              boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
            }}
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationDetails;
