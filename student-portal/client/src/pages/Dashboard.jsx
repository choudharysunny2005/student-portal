import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import toast from 'react-hot-toast';
import { BookOpen, Calendar as CalendarIcon, Download, Users, Mail, BellRing, TrendingUp, CreditCard, BookCopy, Award, BookOpenCheck, Radio, CheckCircle2 } from 'lucide-react';
import { getPersonalizedStudentProfile } from '../utils/studentDataHelper';
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

  // Dynamically compute unique profile for THIS student
  const profile = useMemo(() => {
    return getPersonalizedStudentProfile(storedUser);
  }, [storedUser.email, storedUser.name, storedUser.major, storedUser.semester, storedUser.rollNo]);

  const [activeModal, setActiveModal] = useState(null);
  
  // Dynamic fees with local payment persistence
  const [pendingFees, setPendingFees] = useState(() => {
    const savedFee = localStorage.getItem(`fees_${profile.email}`);
    return savedFee !== null ? Number(savedFee) : profile.pendingFees;
  });

  // Dynamic library books with local renewal persistence
  const [libraryBooks, setLibraryBooks] = useState(() => {
    const savedBooks = localStorage.getItem(`books_${profile.email}`);
    return savedBooks ? JSON.parse(savedBooks) : profile.libraryBooks;
  });

  useEffect(() => {
    const savedFee = localStorage.getItem(`fees_${profile.email}`);
    setPendingFees(savedFee !== null ? Number(savedFee) : profile.pendingFees);
    const savedBooks = localStorage.getItem(`books_${profile.email}`);
    setLibraryBooks(savedBooks ? JSON.parse(savedBooks) : profile.libraryBooks);
  }, [profile.email]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const dayOfWeek = date.getDay();
  const classes = profile.weeklySchedule[dayOfWeek] || [];

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
      localStorage.setItem(`fees_${profile.email}`, '0');
      setActiveModal(null);
    }, 1500);
  };

  const handleRenewBook = (bookId, bookName) => {
    const updated = libraryBooks.map(book => {
      if (book.id === bookId) {
        return { ...book, due: 'In 14 Days', isOverdue: false, renewed: true };
      }
      return book;
    });
    setLibraryBooks(updated);
    localStorage.setItem(`books_${profile.email}`, JSON.stringify(updated));
    toast.success(`"${bookName}" has been successfully renewed for 14 days.`);
  };

  const handleDownloadTranscript = () => {
    const toastId = toast.loading('Generating official transcript...');
    setTimeout(() => {
      toast.success('Transcript downloaded successfully!', { id: toastId });
      
      let semesterDetailsText = '';
      profile.pastSemesters.forEach(sem => {
        semesterDetailsText += `\n-- Semester ${sem.semNumber} (SGPA: ${sem.sgpa}) --\n`;
        sem.courses.forEach(c => {
          semesterDetailsText += `${c.name}: ${c.grade}\n`;
        });
      });

      triggerDownload(
        `Official_Transcript_${profile.name.replace(/\s+/g, '_')}.txt`, 
        `=====================================================\n` +
        `             OFFICIAL ACADEMIC TRANSCRIPT            \n` +
        `=====================================================\n` +
        `Student Name   : ${profile.name}\n` +
        `Enrollment No  : ${profile.enrollmentNo}\n` +
        `Roll Number    : ${profile.rollNo}\n` +
        `Degree / Course: ${profile.major}\n` +
        `Current Term   : Semester ${profile.semester}\n` +
        `Cumulative CGPA: ${profile.cgpa} / 10.0\n` +
        `Overall Percent: ${profile.percentage}%\n` +
        `Attendance Rate: ${profile.overallAttendance}%\n` +
        `Status         : GOOD STANDING\n` +
        `-----------------------------------------------------\n` +
        `ACADEMIC RECORD BREAKDOWN:` +
        semesterDetailsText +
        `\n=====================================================\n` +
        `Issued on: ${new Date().toLocaleDateString('en-US', { dateStyle: 'full' })}\n` +
        `Office of Academic Records & Examinations\n`
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
        <h2>{greeting}, {profile.firstName}! 👋</h2>
        <p>{profile.major} | Semester {profile.semester} • Roll No: {profile.rollNo}</p>
      </div>

      {/* Top Stat Cards */}
      <div className="stat-cards-row">
        <div className="stat-card clickable" onClick={() => setActiveModal('cgpa')} style={{cursor: 'pointer'}}>
          <div className="stat-icon purple"><TrendingUp size={24} /></div>
          <div className="stat-info">
            <p>Current CGPA</p>
            <h3>{profile.cgpa}</h3>
          </div>
        </div>
        <div className="stat-card clickable" onClick={() => setActiveModal('attendance_details')} style={{cursor: 'pointer'}}>
          <div className="stat-icon green"><CalendarIcon size={24} /></div>
          <div className="stat-info">
            <p>Overall Attendance</p>
            <h3>{profile.overallAttendance}%</h3>
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
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <div 
                    key={cls.id} 
                    className={`class-card ${isToday && cls.isActive ? 'active-class' : ''}`}
                    onClick={() => navigate(`/class/${cls.id}`, { state: { selectedDate: date.toISOString(), subject: cls.subject, teacher: cls.teacher } })}
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
                ))
              ) : (
                <div style={{ padding: '25px', textAlign: 'center', color: '#94a3b8' }}>
                  No scheduled lectures on this day. Take time for self-study and assignments!
                </div>
              )}
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
                const dayClasses = profile.weeklySchedule[dayIndex] || [];
                
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
            <h3 className="section-title"><BarChart size={22}/> Attendance Performance ({profile.major.split(' ')[0]})</h3>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={profile.attendanceData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '10px', color: '#fff' }}
                    itemStyle={{ color: '#818cf8' }}
                    formatter={(value) => [`${value}% Attendance`, 'Rate']}
                    labelFormatter={(label) => {
                      const item = profile.attendanceData.find(d => d.name === label);
                      return item ? item.fullName : label;
                    }}
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
                 {profile.deadlines.map((dl) => (
                   <li key={dl.id} onClick={() => navigate(`/class/${dl.id}`, { state: { activeTab: 'assignments', selectedDate: new Date().toISOString() } })} style={{cursor: 'pointer'}} title={`Go to ${dl.title}`}>
                     <span className="deadline-title">{dl.title}</span>
                     <span className={`deadline-date ${dl.urgent ? 'urgent' : ''}`}>{dl.date}</span>
                   </li>
                 ))}
               </ul>
            </div>
            
            <div className="dashboard-section recent-grades">
               <h3 className="section-title"><Award size={20}/> Recent Grades</h3>
               <div className="grades-list">
                 {profile.grades.map((gr, idx) => (
                   <div key={idx} className="grade-item">
                     <div className="grade-info">
                       <h4>{gr.title}</h4>
                       <p>{gr.subject}</p>
                     </div>
                     <div className={`grade-score ${gr.score.startsWith('A') ? 'a-grade' : 'b-grade'}`}>{gr.score}</div>
                   </div>
                 ))}
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
            {profile.progressList.map((prog, idx) => (
              <div key={idx} className="progress-item">
                <div className="progress-header">
                  <span>{prog.subject}</span>
                  <span>{prog.percent}%</span>
                </div>
                <div className="progress-bar-bg">
                  <div className={`progress-bar-fill ${prog.color}`} style={{width: `${prog.percent}%`}}></div>
                </div>
              </div>
            ))}
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
                <h4>{profile.major.split(' ')[0]} Academic Colloquium 2026</h4>
                <p>Main Auditorium • 10:00 AM</p>
              </div>
            </div>
            <div className="event-card">
              <div className="event-date">
                <span className="e-month">OCT</span>
                <span className="e-day">18</span>
              </div>
              <div className="event-details">
                <h4>Research Project Submissions</h4>
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
                    <div className="fee-row"><span>Tuition Fee (Sem {profile.semester})</span> <span>${Math.round(pendingFees * 0.8).toLocaleString()}</span></div>
                    <div className="fee-row"><span>Lab & Resource Charges</span> <span>${Math.round(pendingFees * 0.15).toLocaleString()}</span></div>
                    <div className="fee-row"><span>Library Fine / Processing</span> <span>${Math.round(pendingFees * 0.05).toLocaleString()}</span></div>
                    <div className="fee-row total"><span>Total Pending Balance</span> <span>${pendingFees.toLocaleString()}</span></div>
                  </div>
                  <button className="modal-primary-btn" onClick={handlePayFees}>
                    <CreditCard size={18} /> Pay via Credit/Debit Card
                  </button>
                </>
              ) : (
                <div style={{textAlign: 'center', padding: '30px 0'}}>
                  <CheckCircle2 size={48} color="#34d399" style={{marginBottom: '15px'}} />
                  <h3 style={{color: '#e2e8f0', margin: 0}}>All Fees Cleared!</h3>
                  <p style={{color: '#94a3b8', marginTop: '10px'}}>You have $0 balance for Semester {profile.semester}.</p>
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
              <p style={{color: '#94a3b8', marginBottom: '15px'}}>Curated Resources for {profile.major}:</p>
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
              <h3>✅ Attendance Analytics ({profile.name})</h3>
              <button className="close-btn" onClick={() => setActiveModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{display: 'flex', gap: '15px', marginBottom: '25px'}}>
                <div style={{flex: 1, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)', padding: '15px', borderRadius: '12px', textAlign: 'center'}}>
                  <h4 style={{color: '#34d399', margin: '0 0 5px 0', fontSize: '1.5rem'}}>{profile.overallAttendance}%</h4>
                  <p style={{color: '#94a3b8', margin: 0, fontSize: '0.85rem'}}>Overall Present</p>
                </div>
                <div style={{flex: 1, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', padding: '15px', borderRadius: '12px', textAlign: 'center'}}>
                  <h4 style={{color: '#f87171', margin: '0 0 5px 0', fontSize: '1.5rem'}}>{(100 - profile.overallAttendance).toFixed(1)}%</h4>
                  <p style={{color: '#94a3b8', margin: 0, fontSize: '0.85rem'}}>Total Missed</p>
                </div>
              </div>

              <h4 style={{color: '#e2e8f0', marginBottom: '15px'}}>Subject-wise Breakdown</h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                {profile.attendanceData.map(subject => {
                  const totalClasses = 32;
                  const attendedClasses = Math.round((subject.attendance / 100) * totalClasses);
                  const missedClasses = totalClasses - attendedClasses;
                  
                  return (
                    <div key={subject.id || subject.name} style={{background: 'rgba(0,0,0,0.2)', padding: '12px 15px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                      <div>
                        <h4 style={{margin: '0 0 4px 0', color: '#e2e8f0'}}>{subject.fullName || subject.name}</h4>
                        <p style={{margin: 0, fontSize: '0.8rem', color: '#94a3b8'}}>
                          <span style={{color: '#34d399'}}>{attendedClasses} Attended</span> • <span style={{color: '#f87171'}}>{missedClasses} Missed</span>
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
              <h3>📈 Academic History ({profile.name})</h3>
              <button className="close-btn" onClick={() => setActiveModal(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="cgpa-overview" style={{display: 'flex', gap: '20px', marginBottom: '25px', padding: '20px', background: 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(139,92,246,0.1) 100%)', borderRadius: '15px', border: '1px solid rgba(99,102,241,0.2)'}}>
                <div style={{flex: 1, textAlign: 'center'}}>
                  <p style={{color: '#94a3b8', margin: '0 0 5px 0'}}>Cumulative CGPA</p>
                  <h2 style={{color: '#fff', fontSize: '2.5rem', margin: 0}}>{profile.cgpa}</h2>
                </div>
                <div style={{width: '1px', background: 'rgba(255,255,255,0.1)'}}></div>
                <div style={{flex: 1, textAlign: 'center'}}>
                  <p style={{color: '#94a3b8', margin: '0 0 5px 0'}}>Overall Percentage</p>
                  <h2 style={{color: '#fff', fontSize: '2.5rem', margin: 0}}>{profile.percentage}%</h2>
                </div>
              </div>

              <h4 style={{color: '#e2e8f0', marginBottom: '15px'}}>Past Semester Breakdown</h4>
              
              <div className="semester-list" style={{display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '300px', overflowY: 'auto', paddingRight: '10px'}}>
                {profile.pastSemesters.map(sem => (
                  <div key={sem.semNumber} className="semester-card" style={{background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)'}}>
                    <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px'}}>
                      <h4 style={{margin: 0, color: '#818cf8'}}>Semester {sem.semNumber}</h4>
                      <span style={{color: '#34d399', fontWeight: 'bold'}}>SGPA: {sem.sgpa} ({sem.percentage}%)</span>
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.9rem', color: '#cbd5e1'}}>
                      {sem.courses.map((course, cIdx) => (
                        <div key={cIdx} style={{display: 'flex', justifyContent: 'space-between'}}>
                          <span>{course.name}</span>
                          <span>{course.grade}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
