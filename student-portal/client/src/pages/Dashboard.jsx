import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { BookOpen, Calendar as CalendarIcon, Download, Users, Mail, BellRing, TrendingUp, CreditCard, BookCopy, Award, BookOpenCheck, Radio, CheckCircle2 } from 'lucide-react';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [date, setDate] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  // Retrieve logged-in student or fallback
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || {};
    } catch {
      return {};
    }
  })();

  const studentName = storedUser.name || 'John';
  const firstName = studentName.split(' ')[0];
  const studentCourse = storedUser.major || storedUser.degree || 'B.Tech Computer Science';
  const studentSemester = storedUser.semester || '4';

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  // Dynamic Weekly Schedule
  const weeklySchedule = {
    // Sunday
    0: [],
    // Monday
    1: [
      { id: 1, subject: 'Advanced Mathematics', teacher: 'Mr. Robert Smith', time: '09:00 AM - 10:30 AM', isActive: true },
      { id: 4, subject: 'English Literature', teacher: 'Dr. Jane Austen', time: '11:00 AM - 12:30 PM', isActive: false }
    ],
    // Tuesday
    2: [
      { id: 2, subject: 'Physics & Thermodynamics', teacher: 'Mrs. Sarah Davis', time: '09:00 AM - 11:00 AM', isActive: true },
      { id: 3, subject: 'Computer Science 101', teacher: 'Dr. Alan Turing', time: '01:00 PM - 02:30 PM', isActive: false },
      { id: 5, subject: 'World History', teacher: 'Prof. John Doe', time: '03:00 PM - 04:30 PM', isActive: false }
    ],
    // Wednesday
    3: [
      { id: 1, subject: 'Advanced Mathematics', teacher: 'Mr. Robert Smith', time: '10:00 AM - 11:30 AM', isActive: true },
      { id: 3, subject: 'Computer Science 101', teacher: 'Dr. Alan Turing', time: '02:00 PM - 04:00 PM', isActive: false }
    ],
    // Thursday
    4: [
      { id: 4, subject: 'English Literature', teacher: 'Dr. Jane Austen', time: '09:00 AM - 10:30 AM', isActive: true },
      { id: 2, subject: 'Physics & Thermodynamics', teacher: 'Mrs. Sarah Davis', time: '11:30 AM - 01:00 PM', isActive: false }
    ],
    // Friday
    5: [
      { id: 1, subject: 'Advanced Mathematics', teacher: 'Mr. Robert Smith', time: '09:00 AM - 10:00 AM', isActive: true },
      { id: 5, subject: 'World History', teacher: 'Prof. John Doe', time: '10:30 AM - 12:00 PM', isActive: false },
      { id: 3, subject: 'Computer Science 101', teacher: 'Dr. Alan Turing', time: '01:00 PM - 03:00 PM', isActive: false }
    ],
    // Saturday
    6: [
      { id: 6, subject: 'Extra Class: Web Development', teacher: 'Prof. John Doe', time: '10:00 AM - 12:00 PM', isActive: true }
    ]
  };

  const dayOfWeek = date.getDay();
  const classes = weeklySchedule[dayOfWeek] || [];

  // Mock data for attendance percentage
  const attendanceData = [
    { name: 'Math', attendance: 85 },
    { name: 'Physics', attendance: 70 },
    { name: 'CS 101', attendance: 95 },
    { name: 'English', attendance: 60 },
    { name: 'History', attendance: 88 },
  ];

  const [activeModal, setActiveModal] = useState(null);
  const [pendingFees, setPendingFees] = useState(1250);
  const [libraryBooks, setLibraryBooks] = useState([
    { id: 1, title: 'Introduction to Algorithms (4th Ed)', due: 'Yesterday', isOverdue: true, renewed: false },
    { id: 2, title: 'Physics Vol 2', due: 'Oct 20, 2026', isOverdue: false, renewed: false }
  ]);

  // Helper to trigger a real browser download
  const triggerDownload = (fileName, content) => {
    const element = document.createElement("a");
    const file = new Blob([content], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePayFees = () => {
    const toastId = toast.loading('Processing payment securely...');
    setTimeout(() => {
      toast.success(`Payment of $${pendingFees.toLocaleString()} successful!`, { id: toastId });
      setPendingFees(0);
      setActiveModal(null);
    }, 2000);
  };

  const handleRenewBook = (bookId, bookName) => {
    setLibraryBooks(prev => prev.map(book => {
      if (book.id === bookId) {
        return { ...book, due: 'In 14 Days', isOverdue: false, renewed: true };
      }
      return book;
    }));
    toast.success(`"${bookName}" has been successfully renewed for 14 days.`);
  };

  const handleDownloadTranscript = () => {
    const toastId = toast.loading('Generating official transcript...');
    const enrollment = storedUser.enrollmentNo || 'ENR-9845321';
    setTimeout(() => {
      toast.success('Transcript downloaded successfully!', { id: toastId });
      triggerDownload(
        `Official_Transcript_${studentName.replace(/\s+/g, '_')}.txt`, 
        `OFFICIAL TRANSCRIPT\nName: ${studentName}\nEnrollment: ${enrollment}\nCourse: ${studentCourse}\n\nCumulative CGPA: 8.74\nOverall Percentage: 83.5%\n\n-- Semester 3 --\nData Structures: A+ (92)\nDiscrete Math: A (88)\nLogic Design: B+ (78)\nWeb Dev: A (86)\nSGPA: 8.90\n\n-- Semester 2 --\nCalculus II: A (87)\nPhysics II: B+ (79)\nOOP (C++): A (89)\nCommunication: A- (82)\nSGPA: 8.65\n\n-- Semester 1 --\nCalculus I: A- (81)\nPhysics I: B+ (76)\nIntro to CS: A (88)\nEngineering Draw: A- (80)\nSGPA: 8.50`
      );
    }, 1500);
  };

  const handleDateChange = (newDate) => {
    setDate(newDate);
    toast.success(`Loaded schedule & notes for ${newDate.toLocaleDateString()}`);
  };

  const isToday = new Date().toDateString() === date.toDateString();
  const headerDateStr = isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>{greeting}, {firstName}! 👋</h2>
        <p>{studentCourse} | Semester {studentSemester}</p>
      </div>

      {/* Top Stat Cards */}
      <div className="stat-cards-row">
        <div className="stat-card clickable" onClick={() => setActiveModal('cgpa')} style={{cursor: 'pointer'}}>
          <div className="stat-icon purple"><TrendingUp size={24} /></div>
          <div className="stat-info">
            <p>Current CGPA</p>
            <h3>8.74</h3>
          </div>
        </div>
        <div className="stat-card clickable" onClick={() => setActiveModal('attendance_details')} style={{cursor: 'pointer'}}>
          <div className="stat-icon green"><CalendarIcon size={24} /></div>
          <div className="stat-info">
            <p>Overall Attendance</p>
            <h3>79.6%</h3>
          </div>
        </div>
        <div className="stat-card clickable" onClick={() => setActiveModal('fees')} style={{cursor: 'pointer'}}>
          <div className="stat-icon red"><CreditCard size={24} /></div>
          <div className="stat-info">
            <p>Pending Fees</p>
            <h3>${pendingFees.toLocaleString()}</h3>
          </div>
        </div>
        <div className="stat-card clickable" onClick={() => setActiveModal('library')} style={{cursor: 'pointer'}}>
          <div className="stat-icon blue"><BookCopy size={24} /></div>
          <div className="stat-info">
            <p>Library Books Due</p>
            <h3>{libraryBooks.length} Books</h3>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Left Column: Schedule & Calendar */}
        <div className="dashboard-column">
          <div className="dashboard-section">
            <h3 className="section-title"><CalendarIcon size={22}/> Schedule for {headerDateStr}</h3>
            <div className="calendar-view">
              {classes.map((cls) => (
                <div 
                  key={cls.id} 
                  className={`class-card ${isToday && cls.isActive ? 'active-class' : ''}`}
                  onClick={() => navigate(`/class/${cls.id}`, { state: { selectedDate: date.toISOString() } })}
                >
                  <div className="class-time">{cls.time}</div>
                  <div className="class-details-info">
                    <h3>{cls.subject}</h3>
                    <p>👨‍🏫 {cls.teacher}</p>
                  </div>
                  <div className="class-action">
                    <button className="view-btn">{isToday ? "View Class" : "View Notes"}</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dashboard-section mt-4">
            <h3 className="section-title"><BookOpen size={22}/> Class Calendar</h3>
            <div className="calendar-wrapper">
              <Calendar 
                onChange={handleDateChange} 
                value={date} 
                className="custom-calendar"
              />
              <p className="calendar-hint">Select a date to view its schedule and past notes.</p>
            </div>
          </div>

          <div className="dashboard-section mt-4">
            <h3 className="section-title"><CalendarIcon size={22}/> Upcoming Week Overview</h3>
            <div className="upcoming-week-list">
              {[1, 2, 3, 4, 5, 6, 7].map(offset => {
                const futureDate = new Date();
                futureDate.setDate(futureDate.getDate() + offset);
                const dayIndex = futureDate.getDay();
                const dayClasses = weeklySchedule[dayIndex] || [];
                
                return (
                  <div key={offset} className="upcoming-day-card">
                    <div className="upcoming-day-header">
                      <h4>{futureDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</h4>
                    </div>
                    {dayClasses.length > 0 ? (
                      <div className="upcoming-classes">
                        {dayClasses.map(cls => (
                          <div key={cls.id} className="upcoming-class-item">
                            <span className="upcoming-time">{cls.time.split(' - ')[0]}</span>
                            <span className="upcoming-subject">{cls.subject}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-classes">No classes scheduled</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Attendance Graph & Actions */}
        <div className="dashboard-column">
          <div className="dashboard-section performance-section">
            <h3 className="section-title"><BarChart size={22}/> Attendance Performance</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={attendanceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '10px', color: '#fff' }}
                    itemStyle={{ color: '#818cf8' }}
                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  />
                  <Bar dataKey="attendance" fill="url(#colorUv)" radius={[5, 5, 0, 0]} />
                  <defs>
                    <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#818cf8" stopOpacity={1}/>
                      <stop offset="95%" stopColor="#c084fc" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Quick Actions & Deadlines */}
          <div className="dashboard-grid-half mt-4">
            <div className="dashboard-section upcoming-deadlines">
               <h3 className="section-title"><BellRing size={20}/> Deadlines</h3>
               <ul className="deadline-list">
                 <li onClick={() => navigate('/class/1', { state: { activeTab: 'assignments', selectedDate: new Date().toISOString() } })} style={{cursor: 'pointer'}} title="Go to Math assignments">
                   <span className="deadline-title">Math Assignment 4</span>
                   <span className="deadline-date urgent">Tomorrow, 11:59 PM</span>
                 </li>
                 <li onClick={() => navigate('/class/2', { state: { activeTab: 'assignments', selectedDate: new Date().toISOString() } })} style={{cursor: 'pointer'}} title="Go to Physics assignments">
                   <span className="deadline-title">Physics Lab Report</span>
                   <span className="deadline-date">Oct 15, 2026</span>
                 </li>
                 <li onClick={() => toast.success("Redirecting to Registration Portal...")} style={{cursor: 'pointer'}} title="Go to registration">
                   <span className="deadline-title">Semester Registration</span>
                   <span className="deadline-date">Oct 20, 2026</span>
                 </li>
               </ul>
            </div>
            
            <div className="dashboard-section recent-grades">
               <h3 className="section-title"><Award size={20}/> Recent Grades</h3>
               <div className="grades-list">
                 <div className="grade-item">
                   <div className="grade-info">
                     <h4>Midterm Exam</h4>
                     <p>Physics & Thermo</p>
                   </div>
                   <div className="grade-score a-grade">A-</div>
                 </div>
                 <div className="grade-item">
                   <div className="grade-info">
                     <h4>Quiz 3</h4>
                     <p>Computer Science</p>
                   </div>
                   <div className="grade-score b-grade">B+</div>
                 </div>
               </div>
               
               <div className="action-buttons mt-4" style={{marginTop: '20px'}}>
                 <button onClick={handleDownloadTranscript}><Download size={18}/> Full Report</button>
                 <button onClick={() => setActiveModal('fees')}><CreditCard size={18}/> Pay Fees</button>
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Section: Course Progress & Events */}
      <div className="dashboard-grid-half mt-4" style={{marginTop: '30px'}}>
        <div className="dashboard-section course-progress-section">
          <h3 className="section-title"><BookOpenCheck size={22}/> Syllabus Progress</h3>
          <div className="progress-list">
            <div className="progress-item">
              <div className="progress-header">
                <span>Advanced Mathematics</span>
                <span>75%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill purple" style={{width: '75%'}}></div>
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-header">
                <span>Physics & Thermodynamics</span>
                <span>45%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill blue" style={{width: '45%'}}></div>
              </div>
            </div>
            <div className="progress-item">
              <div className="progress-header">
                <span>Computer Science 101</span>
                <span>90%</span>
              </div>
              <div className="progress-bar-bg">
                <div className="progress-bar-fill green" style={{width: '90%'}}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-section campus-events-section">
          <h3 className="section-title"><Radio size={22}/> Campus Live Updates</h3>
          <div className="events-list">
            <div className="event-card">
              <div className="event-date">
                <span className="e-month">OCT</span>
                <span className="e-day">12</span>
              </div>
              <div className="event-details">
                <h4>Tech Symposium 2026</h4>
                <p>Main Auditorium • 10:00 AM</p>
              </div>
            </div>
            <div className="event-card">
              <div className="event-date">
                <span className="e-month">OCT</span>
                <span className="e-day">18</span>
              </div>
              <div className="event-details">
                <h4>Hackathon Registration Ends</h4>
                <p>Online Portal • 11:59 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {activeModal === 'fees' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>💳 Fee Management Portal</h3>
              <button className="close-btn" onClick={() => setActiveModal(null)}>×</button>
            </div>
            <div className="modal-body">
              {pendingFees > 0 ? (
                <>
                  <div className="fee-breakdown">
                    <div className="fee-row"><span>Tuition Fee (Sem 4)</span> <span>$1,000</span></div>
                    <div className="fee-row"><span>Lab Charges</span> <span>$200</span></div>
                    <div className="fee-row"><span>Library Fine</span> <span>$50</span></div>
                    <div className="fee-row total"><span>Total Pending</span> <span>${pendingFees.toLocaleString()}</span></div>
                  </div>
                  <button className="modal-primary-btn" onClick={handlePayFees}>
                    <CreditCard size={18} /> Pay via Credit/Debit Card
                  </button>
                </>
              ) : (
                <div style={{textAlign: 'center', padding: '30px 0'}}>
                  <CheckCircle2 size={48} color="#34d399" style={{marginBottom: '15px'}} />
                  <h3 style={{color: '#e2e8f0', margin: 0}}>All Fees Paid!</h3>
                  <p style={{color: '#94a3b8', marginTop: '10px'}}>You have no pending balances for this semester.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeModal === 'library' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📚 Digital Library Portal</h3>
              <button className="close-btn" onClick={() => setActiveModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <p style={{color: '#94a3b8', marginBottom: '15px'}}>Currently Borrowed Books:</p>
              <div className="book-list">
                {libraryBooks.map(book => (
                  <div key={book.id} className="book-item">
                    <div className="book-info">
                      <h4>{book.title}</h4>
                      <p className={book.isOverdue ? "overdue" : ""}>Due: {book.due}</p>
                    </div>
                    <button 
                      className="renew-btn" 
                      onClick={() => handleRenewBook(book.id, book.title)}
                      disabled={book.renewed}
                      style={book.renewed ? {opacity: 0.5, cursor: 'not-allowed', background: '#334155'} : {}}
                    >
                      {book.renewed ? "Renewed" : "Renew"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'attendance_details' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '500px'}}>
            <div className="modal-header">
              <h3>✅ Overall Attendance Details</h3>
              <button className="close-btn" onClick={() => setActiveModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{display: 'flex', gap: '15px', marginBottom: '25px'}}>
                <div style={{flex: 1, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '15px', borderRadius: '12px', textAlign: 'center'}}>
                  <h4 style={{color: '#34d399', margin: '0 0 5px 0', fontSize: '1.5rem'}}>79.6%</h4>
                  <p style={{color: '#94a3b8', margin: 0, fontSize: '0.85rem'}}>Total Present</p>
                </div>
                <div style={{flex: 1, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '15px', borderRadius: '12px', textAlign: 'center'}}>
                  <h4 style={{color: '#f87171', margin: '0 0 5px 0', fontSize: '1.5rem'}}>20.4%</h4>
                  <p style={{color: '#94a3b8', margin: 0, fontSize: '0.85rem'}}>Total Missed</p>
                </div>
              </div>

              <h4 style={{color: '#e2e8f0', marginBottom: '15px'}}>Subject-wise Breakdown</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {attendanceData.map(subject => {
                  // Mock total classes calculation based on attendance
                  const totalClasses = 30;
                  const attendedClasses = Math.round((subject.attendance / 100) * totalClasses);
                  const missedClasses = totalClasses - attendedClasses;
                  
                  return (
                    <div key={subject.name} style={{background: 'rgba(0,0,0,0.2)', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <h4 style={{margin: '0 0 4px 0', color: '#e2e8f0'}}>{subject.name}</h4>
                        <p style={{margin: 0, fontSize: '0.8rem', color: '#94a3b8'}}>
                          <span style={{color: '#34d399'}}>{attendedClasses} Taken</span> • <span style={{color: '#f87171'}}>{missedClasses} Missed</span>
                        </p>
                      </div>
                      <div style={{fontWeight: 'bold', color: subject.attendance >= 75 ? '#34d399' : '#fbbf24'}}>
                        {subject.attendance}%
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeModal === 'cgpa' && (
        <div className="modal-overlay" onClick={() => setActiveModal(null)}>
          <div className="modal-content cgpa-modal-content" onClick={e => e.stopPropagation()} style={{maxWidth: '600px'}}>
            <div className="modal-header">
              <h3>📈 Academic History</h3>
              <button className="close-btn" onClick={() => setActiveModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="cgpa-overview" style={{display: 'flex', gap: '20px', marginBottom: '25px', padding: '20px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)', borderRadius: '15px', border: '1px solid rgba(99,102,241,0.2)'}}>
                <div style={{flex: 1, textAlign: 'center'}}>
                  <p style={{color: '#94a3b8', margin: '0 0 5px 0'}}>Cumulative CGPA</p>
                  <h2 style={{color: '#fff', fontSize: '2.5rem', margin: 0}}>8.74</h2>
                </div>
                <div style={{width: '1px', background: 'rgba(255,255,255,0.1)'}}></div>
                <div style={{flex: 1, textAlign: 'center'}}>
                  <p style={{color: '#94a3b8', margin: '0 0 5px 0'}}>Overall Percentage</p>
                  <h2 style={{color: '#fff', fontSize: '2.5rem', margin: 0}}>83.5%</h2>
                </div>
              </div>

              <h4 style={{color: '#e2e8f0', marginBottom: '15px'}}>Past Semester Reports</h4>
              
              <div className="semester-list" style={{display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '300px', overflowY: 'auto', paddingRight: '10px'}}>
                
                <div className="semester-card" style={{background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px'}}>
                    <h4 style={{margin: 0, color: '#818cf8'}}>Semester 3</h4>
                    <span style={{color: '#34d399', fontWeight: 'bold'}}>SGPA: 8.90 (85%)</span>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem', color: '#cbd5e1'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Data Structures</span> <span>A+ (92)</span></div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Discrete Math</span> <span>A (88)</span></div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Logic Design</span> <span>B+ (78)</span></div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Web Dev</span> <span>A (86)</span></div>
                  </div>
                </div>

                <div className="semester-card" style={{background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px'}}>
                    <h4 style={{margin: 0, color: '#818cf8'}}>Semester 2</h4>
                    <span style={{color: '#34d399', fontWeight: 'bold'}}>SGPA: 8.65 (82%)</span>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem', color: '#cbd5e1'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Calculus II</span> <span>A (87)</span></div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Physics II</span> <span>B+ (79)</span></div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}><span>OOP (C++)</span> <span>A (89)</span></div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Communication</span> <span>A- (82)</span></div>
                  </div>
                </div>

                <div className="semester-card" style={{background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px'}}>
                    <h4 style={{margin: 0, color: '#818cf8'}}>Semester 1</h4>
                    <span style={{color: '#34d399', fontWeight: 'bold'}}>SGPA: 8.50 (80%)</span>
                  </div>
                  <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem', color: '#cbd5e1'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Calculus I</span> <span>A- (81)</span></div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Physics I</span> <span>B+ (76)</span></div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Intro to CS</span> <span>A (88)</span></div>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}><span>Engineering Draw</span> <span>A- (80)</span></div>
                  </div>
                </div>

              </div>
              
              <button className="modal-primary-btn" onClick={handleDownloadTranscript} style={{marginTop: '20px'}}>
                <Download size={18} /> Download Official Transcript
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Dashboard;
