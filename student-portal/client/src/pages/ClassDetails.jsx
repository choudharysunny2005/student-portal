import React, { useState, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MessageSquare, Send, Upload, FileBox, CheckCircle2, Download } from 'lucide-react';
import './ClassDetails.css';

function ClassDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const locationState = useLocation();
  const [activeTab, setActiveTab] = useState(locationState.state?.activeTab || 'notes');
  const [cameraActive, setCameraActive] = useState(false);
  const [location, setLocation] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { sender: 'Professor', text: 'Welcome to class! We will start in 5 minutes.', time: '09:55 AM', isTeacher: true },
    { sender: 'Alex M.', text: 'Did anyone do the reading for chapter 4?', time: '09:58 AM', isTeacher: false }
  ]);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const videoRef = useRef(null);

  // Retrieve selected date from router state, default to today
  const selectedDateStr = locationState.state?.selectedDate;
  const selectedDate = selectedDateStr ? new Date(selectedDateStr) : new Date();
  
  // Date validations
  const today = new Date();
  today.setHours(0,0,0,0);
  const classDate = new Date(selectedDate);
  classDate.setHours(0,0,0,0);
  
  const isPast = classDate < today;
  const isFuture = classDate > today;
  const isToday = classDate.getTime() === today.getTime();

  // Mocking the specific class based on ID
  const classData = {
    1: { 
      subject: 'Advanced Mathematics', 
      teacher: 'Mr. Robert Smith', 
      isActive: true, 
      notes: 'Today we covered integration by parts. Make sure to complete exercises 4.1 to 4.5. The key is understanding the u and dv substitution.',
      assignments: [
        { id: 101, title: 'Integration Worksheet 4.1', dueDate: 'Tomorrow, 11:59 PM', points: 20 },
        { id: 102, title: 'Chapter 4 Mini-Project', dueDate: 'Next Friday', points: 50 }
      ]
    },
    2: { 
      subject: 'Physics & Thermodynamics', 
      teacher: 'Mrs. Sarah Davis', 
      isActive: false, 
      notes: 'Study the laws of thermodynamics from chapter 4. We will have a pop quiz on Entropy next week.',
      assignments: [
        { id: 201, title: 'Lab Report: Entropy', dueDate: 'Oct 15, 2026', points: 100 }
      ]
    },
    3: { 
      subject: 'Computer Science 101', 
      teacher: 'Dr. Alan Turing', 
      isActive: false, 
      notes: 'Introduction to binary trees and recursion. The slide deck has been uploaded to the portal.',
      assignments: [
        { id: 301, title: 'Binary Tree Implementation (Java)', dueDate: 'In 3 Days', points: 80 },
        { id: 302, title: 'Recursion Exercises', dueDate: 'In 5 Days', points: 30 }
      ]
    },
    4: { 
      subject: 'English Literature', 
      teacher: 'Dr. Jane Austen', 
      isActive: false, 
      notes: 'Read chapters 1-3 of Pride and Prejudice. We will discuss the overarching themes of class and marriage next lecture.',
      assignments: [
        { id: 401, title: 'Character Analysis Essay', dueDate: 'In 1 Week', points: 100 }
      ]
    },
    5: { 
      subject: 'World History', 
      teacher: 'Prof. John Doe', 
      isActive: false, 
      notes: 'Focus on the Industrial Revolution causes and effects. The timeline chart is available in the supplemental materials.',
      assignments: [
        { id: 501, title: 'Industrial Revolution Timeline', dueDate: 'Tomorrow, 5:00 PM', points: 50 },
        { id: 502, title: 'Primary Source Analysis', dueDate: 'In 2 Weeks', points: 150 }
      ]
    },
    6: {
      subject: 'Extra Class: Web Development',
      teacher: 'Prof. John Doe',
      isActive: true,
      notes: 'Introduction to React and Vite. We discussed component lifecycles and state management. Code repository linked below.',
      assignments: [
        { id: 601, title: 'Build a Portfolio with React', dueDate: 'Next Monday, 11:59 PM', points: 100 }
      ]
    }
  }[id];

  if (!classData) return <div style={{ color: 'white' }}>Class not found</div>;

  const isClassLive = isToday && classData.isActive;

  const startAttendance = async () => {
    if (isFuture) {
      toast.error("You can't mark attendance yet. This class is in the future.");
      return;
    }
    
    setCameraActive(true);
    const toastId = toast.loading('Acquiring secure connection and GPS...');

    try {
      // 1. Get Live Location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude.toFixed(4),
            lng: position.coords.longitude.toFixed(4)
          });
          toast.success('Location verified securely!', { id: toastId });
        },
        (error) => {
          toast.error('Location access is required for attendance verification.', { id: toastId });
          setCameraActive(false);
        }
      );

      // 2. Get Live Camera Stream
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error(err);
      toast.error('Camera access is required for live verification.', { id: toastId });
      setCameraActive(false);
    }
  };

  const markAttendance = () => {
    toast.success(`Attendance marked successfully!`, { duration: 4000 });
    // Stop camera stream
    const stream = videoRef.current?.srcObject;
    const tracks = stream?.getTracks();
    tracks?.forEach(track => track.stop());
    setCameraActive(false);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const time = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    setMessages([...messages, { sender: 'You', text: chatMessage, time, isTeacher: false }]);
    setChatMessage('');
  };

  const handleFileUpload = (assignmentId) => {
    // Simulate a file upload delay
    const toastId = toast.loading('Uploading file...');
    setTimeout(() => {
      setUploadedFiles(prev => ({ ...prev, [assignmentId]: true }));
      toast.success('Assignment submitted successfully!', { id: toastId });
    }, 1500);
  };

  return (
    <div className="class-details-container">
      <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back to Schedule</button>
      
      <div className="class-header">
        <h2>{classData.subject}</h2>
        <p>Instructor: {classData.teacher} | Date: {selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
        {isClassLive && <span className="live-badge">🔴 LIVE NOW</span>}
      </div>

      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
          📚 Class Notes
        </button>
        <button className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
          ✅ Live Attendance
        </button>
        <button className={`tab-btn ${activeTab === 'assignments' ? 'active' : ''}`} onClick={() => setActiveTab('assignments')}>
          📝 Assignments
        </button>
        <button className={`tab-btn ${activeTab === 'discussion' ? 'active' : ''}`} onClick={() => setActiveTab('discussion')}>
          <MessageSquare size={16} /> Discussion
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'notes' && (
          <div className="notes-section">
            <h3>Lecture Notes</h3>
            <div className="notes-card">
              <p>{isFuture ? "Notes will be available after the class." : classData.notes}</p>
              <br/>
              <p className="note-info"><em>Notes are accessible 24/7 regardless of class timing.</em></p>
              
              {!isFuture && (
                <button 
                  style={{marginTop: '15px', background: 'rgba(99,102,241,0.2)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.3)', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'}}
                  onClick={() => {
                    const element = document.createElement("a");
                    const file = new Blob([classData.notes], {type: 'text/plain'});
                    element.href = URL.createObjectURL(file);
                    element.download = `${classData.subject.replace(/ /g, '_')}_Notes.txt`;
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                    toast.success("Notes downloaded successfully!");
                  }}
                >
                  <Download size={16} /> Download Notes
                </button>
              )}
            </div>
          </div>
        )}

        {activeTab === 'assignments' && (
          <div className="assignments-section">
            <h3>Course Assignments</h3>
            <div className="assignments-list">
              {classData.assignments?.length > 0 ? (
                classData.assignments.map(assignment => {
                  const isSubmitted = uploadedFiles[assignment.id];
                  return (
                    <div key={assignment.id} className="assignment-card">
                      <div className="assignment-info">
                        <FileBox size={24} className="assignment-icon" />
                        <div>
                          <h4>{assignment.title}</h4>
                          <p>Due: {assignment.dueDate} • {assignment.points} Points</p>
                        </div>
                      </div>
                      <div className="assignment-action">
                        {isSubmitted ? (
                          <div className="submitted-badge">
                            <CheckCircle2 size={18} />
                            Submitted
                          </div>
                        ) : (
                          <div className="upload-container">
                            <input 
                              type="file" 
                              id={`file-${assignment.id}`} 
                              className="hidden-file-input" 
                              onChange={() => handleFileUpload(assignment.id)} 
                            />
                            <label htmlFor={`file-${assignment.id}`} className="upload-btn">
                              <Upload size={16} /> Upload Work
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p style={{color: '#94a3b8'}}>No pending assignments for this class.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="attendance-section">
            <h3>Mark Attendance</h3>
            
            {isPast ? (
              <div className="attendance-warning">
                ⚠️ You can't mark attendance now. This class has already ended.
              </div>
            ) : isFuture ? (
              <div className="attendance-warning" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.2)' }}>
                ⏳ You can't mark attendance yet. This class is scheduled for the future.
              </div>
            ) : !isClassLive ? (
              <div className="attendance-warning">
                ⚠️ Attendance can only be marked during the live class time today.
              </div>
            ) : (
              <div className="attendance-active">
                {!cameraActive ? (
                  <button className="start-camera-btn" onClick={startAttendance}>
                    📸 Start Live Camera & Location Verification
                  </button>
                ) : (
                  <div className="verification-module">
                    <div className="camera-box">
                      <video ref={videoRef} autoPlay playsInline></video>
                    </div>
                    {location ? (
                      <p className="location-data">📍 Verified Location: {location.lat}, {location.lng}</p>
                    ) : (
                      <p className="location-data loading">📍 Acquiring GPS Location...</p>
                    )}
                    <button className="submit-attendance-btn" onClick={markAttendance} disabled={!location}>
                      Confirm & Mark Attendance
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'discussion' && (
          <div className="discussion-section">
            <div className="chat-box">
              <div className="chat-messages">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`chat-message ${msg.sender === 'You' ? 'my-message' : ''}`}>
                    <div className="message-header">
                      <span className={`sender ${msg.isTeacher ? 'teacher' : ''}`}>{msg.sender}</span>
                      <span className="time">{msg.time}</span>
                    </div>
                    <div className="message-text">{msg.text}</div>
                  </div>
                ))}
              </div>
              <form className="chat-input-area" onSubmit={handleSendMessage}>
                <input 
                  type="text" 
                  placeholder="Ask a question to the class..." 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                />
                <button type="submit"><Send size={18}/></button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ClassDetails;
