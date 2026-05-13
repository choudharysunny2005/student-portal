import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { User, LogIn, UserPlus, LogOut, FileText, Hash, Search, Bell, AlertCircle, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';
import './Navbar.css';

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Assignment Due Tomorrow', message: 'Math Worksheet 4.1 is due at 11:59 PM.', unread: true, icon: <AlertCircle size={18} className="text-red" /> },
    { id: 2, title: 'Class Rescheduled', message: 'Physics lecture moved to 2:00 PM.', unread: false, icon: <Calendar size={18} className="text-blue" /> },
    { id: 3, title: 'New Notes Uploaded', message: 'Prof. Turing uploaded CS101 Slides.', unread: false, icon: <FileText size={18} className="text-green" /> }
  ]);

  // Check if we are on a "logged in" route
  const isAuthRoute = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/signup';
  const isLoggedIn = !isAuthRoute;

  // Mock Student Details
  const student = {
    name: "John Doe",
    rollNo: "CS2026-045",
    enrollmentNo: "ENR9845321",
    course: "B.Tech Computer Science"
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const query = searchQuery.toLowerCase();
    
    // Smart mock search logic mapping keywords to class IDs
    const searchMap = [
      { keywords: ['math', 'mathematics', 'advanced', 'calc'], route: '/class/1' },
      { keywords: ['physics', 'thermodynamics', 'science'], route: '/class/2' },
      { keywords: ['cs', 'computer', 'code', 'programming', 'binary'], route: '/class/3' },
      { keywords: ['english', 'literature', 'essay', 'reading'], route: '/class/4' },
      { keywords: ['history', 'world history', 'industrial'], route: '/class/5' }
    ];

    let foundRoute = null;

    for (let item of searchMap) {
      if (item.keywords.some(keyword => query.includes(keyword))) {
        foundRoute = item.route;
        break;
      }
    }

    if (foundRoute) {
      toast.success(`Redirecting to class matching "${searchQuery}"`, { icon: '🔍' });
      navigate(foundRoute, { state: { selectedDate: new Date().toISOString() } });
    } else {
      toast.error(`No results found for "${searchQuery}"`);
    }
    
    setSearchQuery('');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to={isLoggedIn ? "/dashboard" : "/"}>🎓 StudentPortal</Link>
      </div>
      
      {isLoggedIn && (
        <form className="nav-search" onSubmit={handleSearch}>
          <Search size={16} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search classes, documents..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
      )}

      {!isLoggedIn && (
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            <User size={18} />
            <span>Registration</span>
          </Link>
          <Link to="/login" className={location.pathname === '/login' ? 'active' : ''}>
            <LogIn size={18} />
            <span>Login</span>
          </Link>
          <Link to="/signup" className={location.pathname === '/signup' ? 'active' : ''}>
            <UserPlus size={18} />
            <span>Sign Up</span>
          </Link>
        </div>
      )}

      {isLoggedIn && (
        <div className="nav-actions">
          <div className="nav-notif" onClick={() => setIsNotifOpen(!isNotifOpen)}>
            <Bell size={20} />
            {notifications.length > 0 && <span className="notif-badge">{notifications.length}</span>}
            
            {isNotifOpen && (
              <div className="notif-dropdown">
                <div className="notif-header">
                  <h4>Notifications</h4>
                  {notifications.length > 0 && (
                    <span className="mark-read" onClick={(e) => { 
                      e.stopPropagation(); 
                      toast.success('Marked all as read'); 
                      setNotifications([]);
                      setIsNotifOpen(false); 
                    }}>Mark all as read</span>
                  )}
                </div>
                <div className="notif-body">
                  {notifications.length > 0 ? (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`notif-item ${notif.unread ? 'unread' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsNotifOpen(false);
                          
                          // Mark this specific notification as read in the state
                          setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, unread: false } : n));
                          
                          // Navigate to new page
                          navigate(`/notification/${notif.id}`, { state: { notif } });
                        }}
                        style={{ cursor: 'pointer' }}
                      >
                        {notif.icon}
                        <div className="notif-content">
                          <p><strong>{notif.title}</strong></p>
                          <span>{notif.message}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div style={{padding: '20px', textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem'}}>
                      No new notifications 🎉
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="nav-profile">
            <div className="avatar-wrapper" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <img src="https://ui-avatars.com/api/?name=John+Doe&background=6366f1&color=fff&rounded=true" alt="User Profile" className="profile-avatar" />
              <div className="status-dot"></div>
            </div>
            
            {isDropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <h4>{student.name}</h4>
                  <p>{student.course}</p>
                </div>
                <div className="dropdown-body">
                  <div className="detail-item">
                    <Hash size={14} className="detail-icon" />
                    <span>Roll No: <strong>{student.rollNo}</strong></span>
                  </div>
                  <div className="detail-item">
                    <FileText size={14} className="detail-icon" />
                    <span>Enrollment No: <strong>{student.enrollmentNo}</strong></span>
                  </div>
                </div>
                <div className="dropdown-footer">
                  <button onClick={() => {
                    setIsDropdownOpen(false);
                    window.location.href = '/login';
                  }}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
