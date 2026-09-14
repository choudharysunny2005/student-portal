// Helper to generate personalized data for every student based on their unique identity

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const majorCurriculum = {
  'B.Tech Computer Science': {
    subjects: [
      { id: 1, name: 'Data Structures & Algorithms', teacher: 'Dr. Alan Turing', short: 'DSA' },
      { id: 2, name: 'Database Management Systems', teacher: 'Prof. Edgar Codd', short: 'DBMS' },
      { id: 3, name: 'Full-Stack Web Development', teacher: 'Prof. Tim Berners', short: 'Web Dev' },
      { id: 4, name: 'Computer Networks', teacher: 'Dr. Vint Cerf', short: 'Networks' },
      { id: 5, name: 'Discrete Mathematics', teacher: 'Prof. Donald Knuth', short: 'Discrete' }
    ],
    books: [
      { id: 101, title: 'Introduction to Algorithms (CLRS 4th Ed)', author: 'Cormen et al.', dueOffset: 3 },
      { id: 102, title: 'Clean Code: Agile Software Craftsmanship', author: 'Robert C. Martin', dueOffset: 12 }
    ]
  },
  'Physics & Thermodynamics': {
    subjects: [
      { id: 1, name: 'Quantum Mechanics & Applications', teacher: 'Dr. Richard Feynman', short: 'Quantum' },
      { id: 2, name: 'Classical Thermodynamics', teacher: 'Prof. Ludwig Boltzmann', short: 'Thermo' },
      { id: 3, name: 'Electromagnetism & Optics', teacher: 'Dr. James Maxwell', short: 'Optics' },
      { id: 4, name: 'Nuclear Physics & Radiation', teacher: 'Dr. Marie Curie', short: 'Nuclear' },
      { id: 5, name: 'Mathematical Methods in Physics', teacher: 'Prof. Paul Dirac', short: 'Math Phys' }
    ],
    books: [
      { id: 201, title: 'The Feynman Lectures on Physics (Vol 1-3)', author: 'Richard Feynman', dueOffset: 5 },
      { id: 202, title: 'Principles of Quantum Mechanics', author: 'R. Shankar', dueOffset: 14 }
    ]
  },
  'Electrical Engineering': {
    subjects: [
      { id: 1, name: 'Digital Logic & Microprocessors', teacher: 'Dr. Claude Shannon', short: 'Microproc' },
      { id: 2, name: 'Signals & Linear Systems', teacher: 'Prof. Alan Oppenheim', short: 'Signals' },
      { id: 3, name: 'Power Electronics & Drives', teacher: 'Dr. Nikola Tesla', short: 'Power' },
      { id: 4, name: 'Control Systems Engineering', teacher: 'Prof. Katsuhiko Ogata', short: 'Controls' },
      { id: 5, name: 'Electromagnetic Field Theory', teacher: 'Dr. Oliver Heaviside', short: 'EM Theory' }
    ],
    books: [
      { id: 301, title: 'Microelectronic Circuits (8th Ed)', author: 'Sedra & Smith', dueOffset: 4 },
      { id: 302, title: 'Signals and Systems', author: 'Oppenheim & Willsky', dueOffset: 15 }
    ]
  },
  'English Literature': {
    subjects: [
      { id: 1, name: 'Shakespearean Drama & Renaissance', teacher: 'Dr. Harold Bloom', short: 'Shakespeare' },
      { id: 2, name: 'Victorian Poetry & Romanticism', teacher: 'Prof. Jane Austen', short: 'Victorian' },
      { id: 3, name: '20th Century Modernist Fiction', teacher: 'Dr. Virginia Woolf', short: 'Modernism' },
      { id: 4, name: 'Literary Theory & Criticism', teacher: 'Prof. Roland Barthes', short: 'Critique' },
      { id: 5, name: 'Creative Writing & Rhetoric', teacher: 'Dr. Maya Angelou', short: 'Writing' }
    ],
    books: [
      { id: 401, title: 'The Norton Anthology of English Literature', author: 'Stephen Greenblatt', dueOffset: 2 },
      { id: 402, title: 'A Room of One\'s Own', author: 'Virginia Woolf', dueOffset: 10 }
    ]
  },
  'Business Administration': {
    subjects: [
      { id: 1, name: 'Corporate Financial Management', teacher: 'Prof. Warren Buffett', short: 'Finance' },
      { id: 2, name: 'Strategic Marketing & Brand Management', teacher: 'Dr. Philip Kotler', short: 'Marketing' },
      { id: 3, name: 'Organizational Behavior & HR', teacher: 'Prof. Peter Drucker', short: 'Org Dev' },
      { id: 4, name: 'Business Analytics & Decision Science', teacher: 'Dr. Michael Porter', short: 'Analytics' },
      { id: 5, name: 'Operations & Supply Chain Strategy', teacher: 'Prof. Eliyahu Goldratt', short: 'Operations' }
    ],
    books: [
      { id: 501, title: 'Competitive Strategy', author: 'Michael E. Porter', dueOffset: 6 },
      { id: 502, title: 'Principles of Corporate Finance', author: 'Brealey & Myers', dueOffset: 16 }
    ]
  }
};

export function getPersonalizedStudentProfile(storedUser) {
  const name = (storedUser?.name || 'John Doe').trim();
  const email = (storedUser?.email || 'student@university.edu').toLowerCase().trim();
  const major = storedUser?.major || storedUser?.degree || 'B.Tech Computer Science';
  const semester = String(storedUser?.semester || '4');
  const seed = hashString(email + name);

  // Match or fallback major curriculum
  const curriculum = majorCurriculum[major] || majorCurriculum['B.Tech Computer Science'];
  const subjects = curriculum.subjects;

  // 1. Dynamic Unique CGPA & Percentage
  // Yields distinct values like 8.12, 9.45, 8.80, 9.15
  const baseCgpa = 7.6 + ((seed % 210) / 100);
  const cgpa = Number(baseCgpa.toFixed(2));
  const percentage = Number((cgpa * 9.5).toFixed(1));

  // 2. Dynamic Unique Subject-wise Attendance
  const attendanceData = subjects.map((subj, index) => {
    const subjSeed = (seed + index * 47) % 35; // 0 to 34
    const attendance = 68 + subjSeed; // 68% to 100%
    return {
      id: subj.id,
      name: subj.short,
      fullName: subj.name,
      teacher: subj.teacher,
      attendance
    };
  });

  const overallAttendance = Number(
    (attendanceData.reduce((acc, curr) => acc + curr.attendance, 0) / attendanceData.length).toFixed(1)
  );

  // 3. Dynamic Unique Pending Fees in INR (₹)
  // Some students have ₹0, others have unique amounts (₹25,000, ₹42,000, ₹65,000, ₹80,000)
  const feeOptions = [0, 35000, 52000, 75000, 90000, 0, 44000];
  const pendingFees = feeOptions[seed % feeOptions.length];

  // 4. Dynamic Library Books
  const libraryBooks = curriculum.books.map((b, idx) => {
    const dueDays = ((seed + idx * 7) % 18) - 2; // -2 to 15
    const isOverdue = dueDays <= 0;
    return {
      id: b.id,
      title: b.title,
      author: b.author,
      due: isOverdue ? 'Yesterday (Overdue)' : `In ${dueDays} Days`,
      isOverdue,
      renewed: false
    };
  });

  // 5. Dynamic Weekly Schedule for this student's major
  const weeklySchedule = {
    0: [], // Sunday
    1: [ // Monday
      { id: subjects[0].id, subject: subjects[0].name, teacher: subjects[0].teacher, time: '09:00 AM - 10:30 AM', isActive: true },
      { id: subjects[3].id, subject: subjects[3].name, teacher: subjects[3].teacher, time: '11:00 AM - 12:30 PM', isActive: false }
    ],
    2: [ // Tuesday
      { id: subjects[1].id, subject: subjects[1].name, teacher: subjects[1].teacher, time: '09:00 AM - 11:00 AM', isActive: true },
      { id: subjects[2].id, subject: subjects[2].name, teacher: subjects[2].teacher, time: '01:00 PM - 02:30 PM', isActive: false },
      { id: subjects[4].id, subject: subjects[4].name, teacher: subjects[4].teacher, time: '03:00 PM - 04:30 PM', isActive: false }
    ],
    3: [ // Wednesday
      { id: subjects[0].id, subject: subjects[0].name, teacher: subjects[0].teacher, time: '10:00 AM - 11:30 AM', isActive: true },
      { id: subjects[2].id, subject: subjects[2].name, teacher: subjects[2].teacher, time: '02:00 PM - 04:00 PM', isActive: false }
    ],
    4: [ // Thursday
      { id: subjects[3].id, subject: subjects[3].name, teacher: subjects[3].teacher, time: '09:00 AM - 10:30 AM', isActive: true },
      { id: subjects[1].id, subject: subjects[1].name, teacher: subjects[1].teacher, time: '11:30 AM - 01:00 PM', isActive: false }
    ],
    5: [ // Friday
      { id: subjects[0].id, subject: subjects[0].name, teacher: subjects[0].teacher, time: '09:00 AM - 10:00 AM', isActive: true },
      { id: subjects[4].id, subject: subjects[4].name, teacher: subjects[4].teacher, time: '10:30 AM - 12:00 PM', isActive: false },
      { id: subjects[2].id, subject: subjects[2].name, teacher: subjects[2].teacher, time: '01:00 PM - 03:00 PM', isActive: false }
    ],
    6: [ // Saturday
      { id: 6, subject: `Special Seminar: ${major} Industry Trends`, teacher: subjects[0].teacher, time: '10:00 AM - 12:00 PM', isActive: true }
    ]
  };

  // 6. Dynamic Deadlines
  const deadlines = [
    { id: subjects[0].id, title: `${subjects[0].short} Problem Set #3`, date: 'Tomorrow, 11:59 PM', urgent: true },
    { id: subjects[1].id, title: `${subjects[1].short} Midterm Term Paper`, date: 'Oct 15, 2026', urgent: false },
    { id: subjects[2].id, title: `${subjects[2].short} Lab Project Milestone`, date: 'Oct 22, 2026', urgent: false }
  ];

  // 7. Dynamic Recent Grades
  const gradeOptions = ['A+', 'A', 'A-', 'B+', 'A'];
  const grades = [
    { title: 'Midterm Assessment', subject: subjects[1].name, score: gradeOptions[seed % gradeOptions.length] },
    { title: 'Quiz 3 & Assignment', subject: subjects[0].name, score: gradeOptions[(seed + 2) % gradeOptions.length] }
  ];

  // 8. Dynamic Syllabus Progress
  const progressList = [
    { subject: subjects[0].name, percent: 65 + (seed % 30), color: 'purple' },
    { subject: subjects[1].name, percent: 45 + ((seed * 3) % 40), color: 'blue' },
    { subject: subjects[2].name, percent: 70 + ((seed * 7) % 25), color: 'green' }
  ];

  // 9. Roll & Enrollment numbers
  const rollNo = storedUser?.rollNo || `CS${new Date().getFullYear()}-${100 + (seed % 900)}`;
  const enrollmentNo = storedUser?.enrollmentNo || `ENR${1000000 + (seed % 9000000)}`;

  // 10. Dynamic Past Semesters
  const numPastSemesters = Math.max(1, parseInt(semester) - 1);
  const pastSemesters = [];
  for (let sem = numPastSemesters; sem >= 1; sem--) {
    const semSgpa = Number((cgpa - 0.3 + (sem * 0.15) + ((seed + sem) % 20) / 100).toFixed(2));
    const semPercent = Number((semSgpa * 9.5).toFixed(1));
    pastSemesters.push({
      semNumber: sem,
      sgpa: semSgpa,
      percentage: semPercent,
      courses: [
        { name: `${subjects[0].short} - Part ${sem}`, grade: 'A (' + (85 + (sem * 2)) + ')' },
        { name: `${subjects[1].short} - Fundamentals`, grade: 'A- (' + (82 + sem) + ')' },
        { name: `${subjects[2].short} - Applied Lab`, grade: 'A+ (' + (90 + sem) + ')' },
        { name: `Elective ${sem}`, grade: 'B+ (' + (78 + sem) + ')' }
      ]
    });
  }

  return {
    name,
    firstName: name.split(' ')[0],
    email,
    major,
    semester,
    rollNo,
    enrollmentNo,
    cgpa,
    percentage,
    overallAttendance,
    attendanceData,
    pendingFees,
    libraryBooks,
    weeklySchedule,
    deadlines,
    grades,
    progressList,
    pastSemesters,
    subjects
  };
}
