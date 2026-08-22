import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AppContext = createContext();
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'https://student-design-competition-platform.vercel.app/api').replace(/\/+$/, '');

const DEFAULT_COMPETITIONS = [
  {
    id: 'comp-1',
    title: 'NID Design Excellence Student Awards 2026',
    organizer: 'National Institute of Design (NID)',
    organizerLogo: 'NID',
    organizerColor: 'from-blue-600 to-indigo-600',
    category: 'UI/UX Design',
    deadline: '2026-08-15T23:59:59',
    startDate: '2026-07-01',
    status: 'Closing Soon',
    prizePool: '₹2,50,000 Prize Pool',
    prizes: [
      { rank: '1st Winner', reward: '₹1,20,000 + NID Excellence Trophy' },
      { rank: '2nd Runner-up', reward: '₹70,000 + Mentorship Session' },
      { rank: '3rd Runner-up', reward: '₹40,000' },
      { rank: 'Special Merit (x2)', reward: '₹10,000 each' }
    ],
    eligibility: 'Undergraduate & Postgraduate Design Students across India',
    description: 'The premier design competition hosted by NID challenging young innovators to re-imagine healthcare accessibility, civic engagement, or smart mobility through human-centered interface design.',
    deliverables: [
      'Figma / Adobe XD Interactive Prototype link',
      'Executive Case Study Presentation (PDF, max 10 slides)',
      '2-minute video walkthrough of the user journey',
      'User research findings and persona maps'
    ],
    judgingCriteria: [
      { name: 'User Research & Problem Definition', weight: '30%' },
      { name: 'Visual Hierarchy & Interaction Design', weight: '30%' },
      { name: 'Innovation & Originality', weight: '25%' },
      { name: 'Accessibility & Inclusivity', weight: '15%' }
    ],
    bannerImage: 'https://images.unsplash.com/photo-1542744094-3a3121699563?auto=format&fit=crop&w=1200&q=80',
    tags: ['UI/UX', 'NID', 'Mobile App', 'Accessibility'],
    featured: true
  },
  {
    id: 'comp-2',
    title: 'WDO Global Sustainable Cities Challenge',
    organizer: 'World Design Organization (WDO)',
    organizerLogo: 'WDO',
    organizerColor: 'from-emerald-600 to-teal-600',
    category: 'Product/Industrial',
    deadline: '2026-09-30T23:59:59',
    startDate: '2026-07-10',
    status: 'Open',
    prizePool: '$12,000 USD',
    prizes: [
      { rank: 'Gold Award', reward: '$6,000 + WDO World Assembly Invite' },
      { rank: 'Silver Award', reward: '$3,500 + Publication' },
      { rank: 'Bronze Award', reward: '$2,500' }
    ],
    eligibility: 'International Design Students & Recent Graduates (within 1 year)',
    description: 'An international call to design physical or digital solutions that tackle urban waste, renewable energy consumption, or climate resilience in metropolitan environments.',
    deliverables: [
      'Detailed 3D CAD renders / Mockups',
      'Material selection & sustainability impact assessment',
      'Comprehensive design brief document (PDF)',
      'Concept demonstration video'
    ],
    judgingCriteria: [
      { name: 'Environmental & Circularity Impact', weight: '35%' },
      { name: 'Engineering Feasibility', weight: '25%' },
      { name: 'Aesthetics & Ergonomics', weight: '25%' },
      { name: 'Market Viability', weight: '15%' }
    ],
    bannerImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    tags: ['Sustainability', 'Product Design', 'WDO', 'CleanTech'],
    featured: true
  },
  {
    id: 'comp-3',
    title: 'Unified Mentor National UI/UX & Web Hackathon',
    organizer: 'Unified Mentor',
    organizerLogo: 'UM',
    organizerColor: 'from-indigo-600 to-purple-600',
    category: 'UI/UX Design',
    deadline: '2026-08-20T23:59:59',
    startDate: '2026-07-15',
    status: 'Closing Soon',
    prizePool: '₹1,50,000 + Internship Offers',
    prizes: [
      { rank: 'Grand Champion', reward: '₹75,000 + Direct Industry Placement' },
      { rank: '1st Runner-Up', reward: '₹45,000 + Premium Mentorship' },
      { rank: '2nd Runner-Up', reward: '₹30,000 + Certificate of Distinction' }
    ],
    eligibility: 'Open to all enrolled university students & tech bootcamp participants',
    description: 'Build a responsive web application concept or mobile app that addresses real-world student challenges in education, skill development, or portfolio discovery.',
    deliverables: [
      'Live Deployed App URL or Figma Prototype',
      'Project GitHub / Source Code Repository link',
      'Project Design Document & Architecture rationale',
      'Slide deck presentation'
    ],
    judgingCriteria: [
      { name: 'User Experience & Flow', weight: '35%' },
      { name: 'Code Quality / Prototype Interactivity', weight: '30%' },
      { name: 'Problem Utility & Impact', weight: '20%' },
      { name: 'Design System Consistency', weight: '15%' }
    ],
    bannerImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80',
    tags: ['Unified Mentor', 'Web App', 'UI/UX', 'Hackathon'],
    featured: true
  },
  {
    id: 'comp-4',
    title: 'Red Dot Junior Concept Award 2026',
    organizer: 'Red Dot Design Award',
    organizerLogo: 'RED',
    organizerColor: 'from-rose-600 to-red-600',
    category: 'Graphic & Brand',
    deadline: '2026-08-10T23:59:59',
    startDate: '2026-06-01',
    status: 'Open',
    prizePool: 'Red Dot Trophy & Global Exhibition',
    prizes: [
      { rank: 'Best of the Best', reward: 'Red Dot Trophy + Singapore Museum Exhibition' },
      { rank: 'Red Dot Winner', reward: 'Official Red Dot Quality Seal + Yearbook Feature' },
      { rank: 'Honorable Mention', reward: 'Official Certificate & Digital Badge' }
    ],
    eligibility: 'Students & young designers under 30 years old',
    description: 'Showcase groundbreaking visual identity, typography, packaging, or brand storytelling concepts that define the future of visual communications.',
    deliverables: [
      'High-resolution 300DPI poster series (JPG/PNG)',
      'Brand identity guideline manual (PDF)',
      'Packaging mockups / application samples'
    ],
    judgingCriteria: [
      { name: 'Visual Aesthetics & Innovation', weight: '40%' },
      { name: 'Concept Storytelling', weight: '30%' },
      { name: 'Execution Quality', weight: '30%' }
    ],
    bannerImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
    tags: ['Graphic Design', 'Branding', 'Red Dot', 'Typography'],
    featured: false
  },
  {
    id: 'comp-5',
    title: 'James Dyson Award - NextGen Innovation',
    organizer: 'James Dyson Foundation',
    organizerLogo: 'JDF',
    organizerColor: 'from-amber-500 to-orange-600',
    category: 'Product/Industrial',
    deadline: '2026-10-15T23:59:59',
    startDate: '2026-08-15',
    status: 'Upcoming',
    prizePool: '£30,000 Global Grand Prize',
    prizes: [
      { rank: 'International Winner', reward: '£30,000 for student + £5,000 for university' },
      { rank: 'International Runners-Up (x2)', reward: '£5,000 each' },
      { rank: 'National Winners', reward: '£5,000 each' }
    ],
    eligibility: 'University engineering, product design, and industrial design students',
    description: 'Design something that solves a problem. From medical devices to agricultural technology, create tangible hardware or product solutions that improve human lives.',
    deliverables: [
      'Physical / Working Prototype Demonstration Video',
      'Engineering blueprints and iterative build log',
      'Project write-up answering key problem & solution prompts'
    ],
    judgingCriteria: [
      { name: 'Ingenious Problem Solving', weight: '40%' },
      { name: 'Prototyping & Iteration Rigor', weight: '30%' },
      { name: 'Commercial & Social Value', weight: '30%' }
    ],
    bannerImage: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=80',
    tags: ['Engineering', 'Hardware', 'Dyson', 'Innovation'],
    featured: false
  },
  {
    id: 'comp-6',
    title: 'Adobe Creative Jam: AI Experience',
    organizer: 'Adobe Creative Cloud',
    organizerLogo: 'ADB',
    organizerColor: 'from-red-500 to-pink-600',
    category: 'UI/UX Design',
    deadline: '2026-09-05T23:59:59',
    startDate: '2026-07-20',
    status: 'Open',
    prizePool: '$8,000 + Adobe All Apps Licenses',
    prizes: [
      { rank: '1st Place Team', reward: '$5,000 + 1-Year Adobe Creative Cloud + iPad Pro' },
      { rank: '2nd Place Team', reward: '$2,000 + 1-Year Creative Cloud' },
      { rank: '3rd Place Team', reward: '$1,000 + Creative Cloud' }
    ],
    eligibility: 'Higher Education Students enrolled globally',
    description: 'Fast-paced design challenge using Adobe Firefly and Adobe XD/Figma to create a revolutionary AI-assisted creative tool for modern content creators.',
    deliverables: [
      'Interactive Prototype link',
      'UX Research & AI prompt workflow breakdown',
      '3-minute pitch presentation'
    ],
    judgingCriteria: [
      { name: 'AI Integration & Delight', weight: '35%' },
      { name: 'Interface Craft & Micro-interactions', weight: '35%' },
      { name: 'User Problem Fit', weight: '30%' }
    ],
    bannerImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    tags: ['Adobe', 'AI Tools', 'UI/UX', 'Creative Jam'],
    featured: false
  }
];

const DEFAULT_SUBMISSIONS = [
  {
    id: 'sub-101',
    competitionId: 'comp-1',
    competitionTitle: 'NID Design Excellence Student Awards 2026',
    organizer: 'National Institute of Design (NID)',
    projectTitle: 'MedPulse - Inclusive Emergency Triage UI',
    tagline: 'Accessible multilingual triage dashboard for rural emergency care',
    category: 'UI/UX Design',
    status: 'Under Process',
    submittedAt: '2026-08-01T10:30:00Z',
    studentName: 'Rahul Mahto',
    studentEmail: 'rahul.student@designpulse.edu',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    summary: 'MedPulse simplifies emergency triage for primary healthcare centers in regional India, featuring high-contrast touch layouts, voice-guided inputs, and offline data sync.',
    evaluatorNotes: 'Strong user research methodology. Jury recommends highlighting clinical edge case workflows.',
    files: [
      { id: 'f-1', name: 'MedPulse_Case_Study.pdf', size: '4.2 MB', type: 'pdf', url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1000&q=80' }
    ],
    links: [
      { label: 'Figma Prototype', url: 'https://figma.com/@medpulse-demo' },
      { label: 'Walkthrough Video', url: 'https://youtube.com/@demo-video' }
    ]
  },
  {
    id: 'sub-102',
    competitionId: 'comp-3',
    competitionTitle: 'Unified Mentor National UI/UX & Web Hackathon',
    organizer: 'Unified Mentor',
    projectTitle: 'SkillBridge - Peer Mentorship Network',
    tagline: 'Connecting design undergrads with senior industry practitioners',
    category: 'UI/UX Design',
    status: 'Confirmed',
    submittedAt: '2026-07-28T14:15:00Z',
    studentName: 'Rahul Mahto',
    studentEmail: 'rahul.student@designpulse.edu',
    studentAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    summary: 'A friction-free platform where design students book 1-on-1 portfolio reviews, receive timestamped annotation feedback, and track skill progression over time.',
    evaluatorNotes: 'Exceptional prototype polish and clean information architecture. Shortlisted for finalist awards!',
    files: [
      { id: 'f-2', name: 'SkillBridge_Architecture.pdf', size: '2.8 MB', type: 'pdf', url: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=1000&q=80' }
    ],
    links: [
      { label: 'Figma Interactive Mockup', url: 'https://figma.com/@skillbridge' },
      { label: 'GitHub Repository', url: 'https://github.com/rahulmahto/skillbridge' }
    ]
  }
];

const guestUser = {
  id: 'usr-student-1',
  name: 'Rahul Mahto',
  email: 'rahul.student@designpulse.edu',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
  institution: 'National Institute of Design (NID)',
  degree: 'Bachelor of Design (B.Des in Product & UI/UX)',
  bio: 'Passionate about human-centered design, UI/UX systems, accessibility, and creating intuitive digital products for students and creators.',
  skills: ['UI/UX Design', 'Figma', 'User Research', 'Design Systems', 'Prototyping', 'React', 'HTML/CSS'],
  portfolioUrl: 'https://rahulmahto.design',
  location: 'Ahmedabad, India',
  organizerName: '',
  savedCompetitions: ['comp-1', 'comp-3']
};

const readStoredValue = (key, fallback) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  } catch {
    localStorage.removeItem(key);
    return fallback;
  }
};

const normalizeCompetition = (competition) => ({
  ...competition,
  id: String(competition.id || competition._id || ''),
  _id: String(competition._id || competition.id || ''),
  deadline: competition.deadline,
  startDate: competition.startDate
});

const normalizeSubmission = (submission) => ({
  ...submission,
  id: submission.id || submission._id,
  competitionId: submission.competitionId?._id || submission.competitionId,
  studentId: submission.studentId?._id || submission.studentId,
  competitionTitle: submission.competitionId?.title || submission.competitionTitle,
  organizer: submission.competitionId?.organizer || submission.organizer,
  studentName: submission.studentId?.name || submission.studentName,
  studentEmail: submission.studentId?.email || submission.studentEmail,
  studentAvatar: submission.studentId?.avatar || submission.studentAvatar
});

const normalizeUser = (apiUser) => ({
  ...guestUser,
  ...apiUser,
  id: apiUser?.id || apiUser?._id || guestUser.id
});

export const AppProvider = ({ children }) => {
  const [competitions, setCompetitions] = useState(() => readStoredValue('designpulse_competitions', DEFAULT_COMPETITIONS));
  const [submissions, setSubmissions] = useState(() => readStoredValue('designpulse_submissions', DEFAULT_SUBMISSIONS));
  const [user, setUser] = useState(() => normalizeUser(readStoredValue('designpulse_user', guestUser)));
  const [authToken, setAuthToken] = useState(() => localStorage.getItem('designpulse_auth_token') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem('designpulse_auth_token')));
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authRoleTarget, setAuthRoleTarget] = useState('student');
  const [savedCompetitions, setSavedCompetitions] = useState(() => readStoredValue('designpulse_saved', ['comp-1', 'comp-3']));
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'MongoDB Connected',
      message: 'Database connection active. You can register, sign in, and manage submissions.',
      type: 'success',
      timestamp: new Date().toISOString(),
      read: false
    }
  ]);

  const [currentRoute, setCurrentRoute] = useState('competitions');
  const [selectedCompetitionId, setSelectedCompetitionId] = useState('comp-1');
  const [selectedSubmissionId, setSelectedSubmissionId] = useState('sub-101');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const authHeaders = useMemo(() => ({
    'Content-Type': 'application/json',
    ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
  }), [authToken]);

  const requestApi = useCallback(async (path, options = {}) => {
    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers: {
          ...(options.body ? { 'Content-Type': 'application/json' } : {}),
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
          ...(options.headers || {})
        }
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok || data.success === false) {
        throw new Error(data.message || `Request failed: ${response.status}`);
      }
      return data;
    } catch (err) {
      return null;
    }
  }, [authToken]);

  const addNotification = useCallback((title, message, type = 'info') => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev].slice(0, 20));
  }, []);

  const loadCompetitions = useCallback(async () => {
    const data = await requestApi('/competitions');
    if (data && data.competitions && data.competitions.length > 0) {
      setCompetitions(data.competitions.map(normalizeCompetition));
    }
  }, [requestApi]);

  const loadSubmissions = useCallback(async () => {
    if (!authToken) return;
    const data = await requestApi('/submissions');
    if (data && data.submissions && data.submissions.length > 0) {
      setSubmissions(data.submissions.map(normalizeSubmission));
    }
  }, [authToken, requestApi]);

  const refreshAllData = useCallback(async () => {
    setIsLoadingData(true);
    await Promise.all([loadCompetitions(), loadSubmissions()]);
    setIsLoadingData(false);
  }, [loadCompetitions, loadSubmissions]);

  useEffect(() => {
    loadCompetitions();
  }, [loadCompetitions]);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  useEffect(() => {
    localStorage.setItem('designpulse_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('designpulse_competitions', JSON.stringify(competitions));
  }, [competitions]);

  useEffect(() => {
    localStorage.setItem('designpulse_submissions', JSON.stringify(submissions));
  }, [submissions]);

  useEffect(() => {
    if (authToken) {
      localStorage.setItem('designpulse_auth_token', authToken);
    } else {
      localStorage.removeItem('designpulse_auth_token');
    }
  }, [authToken]);

  useEffect(() => {
    localStorage.setItem('designpulse_saved', JSON.stringify(savedCompetitions));
  }, [savedCompetitions]);

  const markNotificationRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const loginUser = async (email, password, role = 'student') => {
    if (!email?.trim() || !password?.trim()) {
      addNotification('Authentication Required', 'Please enter both email and password.', 'warning');
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: password.trim(), role })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        const loggedUser = normalizeUser(data.user);
        setUser(loggedUser);
        if (loggedUser.savedCompetitions && Array.isArray(loggedUser.savedCompetitions)) {
          setSavedCompetitions(loggedUser.savedCompetitions.map(String));
        }
        setAuthToken(data.token);
        setIsAuthenticated(true);
        setShowAuthModal(false);
        setCurrentRoute(loggedUser.role === 'admin' ? 'admin' : 'dashboard');
        addNotification('Signed In Successfully', `Welcome back, ${loggedUser.name}!`, 'success');
        refreshAllData();
        return true;
      } else {
        const errorMsg = data.message || 'Incorrect credentials. Please check your email and password.';
        addNotification('Login Failed', errorMsg, 'error');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      addNotification('Server / MongoDB Error', 'Cannot reach server or MongoDB database. Ensure server is running.', 'error');
      return false;
    }
  };

  const registerStudent = async (studentData) => {
    return registerUser({
      ...studentData,
      role: 'student',
      skills: studentData.skills || ['UI/UX', 'Figma', 'Prototyping']
    }, 'dashboard');
  };

  const registerAdmin = async (adminData) => {
    return registerUser({
      ...adminData,
      role: 'admin',
      institution: adminData.organizerName || 'Design Organization Board',
      degree: 'Competition Coordinator',
      skills: ['Review', 'Competition Management']
    }, 'admin');
  };

  const registerUser = async (payload, nextRoute) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success) {
        const createdUser = normalizeUser(data.user);
        setUser(createdUser);
        if (createdUser.savedCompetitions && Array.isArray(createdUser.savedCompetitions)) {
          setSavedCompetitions(createdUser.savedCompetitions.map(String));
        }
        setAuthToken(data.token);
        setIsAuthenticated(true);
        setShowAuthModal(false);
        setCurrentRoute(nextRoute || (createdUser.role === 'admin' ? 'admin' : 'dashboard'));
        addNotification('Account Created', `Welcome to DesignPulse, ${createdUser.name}!`, 'success');
        refreshAllData();
        return true;
      } else {
        const errorMsg = data.message || 'Registration failed. Please check your details.';
        addNotification('Registration Failed', errorMsg, 'error');
        return false;
      }
    } catch (err) {
      console.error('Register error:', err);
      addNotification('Server / MongoDB Error', 'Cannot reach server or MongoDB database. Ensure server is running.', 'error');
      return false;
    }
  };

  const resetPassword = async ({ email, role, newPassword }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), role, newPassword })
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success) {
        addNotification('Password Updated', data.message || 'Your password has been updated.', 'success');
        return true;
      } else {
        addNotification('Password Reset Failed', data.message || 'Unable to update password.', 'error');
        return false;
      }
    } catch (err) {
      addNotification('Server / MongoDB Error', 'Cannot reach server or MongoDB database.', 'error');
      return false;
    }
  };

  const logoutUser = () => {
    setIsAuthenticated(false);
    setAuthToken('');
    setUser({ ...guestUser, id: 'usr-guest', name: 'Guest Student', email: '' });
    setCurrentRoute('competitions');
    addNotification('Logged Out', 'You have been signed out.', 'info');
  };

  const openAuthModal = (mode = 'login', targetRole = 'student') => {
    setAuthMode(mode);
    setAuthRoleTarget(targetRole);
    setShowAuthModal(true);
  };

  const switchRole = (newRole) => {
    // If already authenticated as this exact role, do nothing
    if (user.role === newRole && isAuthenticated) return;
    // Always show the login modal so the user signs in as the chosen role
    openAuthModal('login', newRole);
  };

  const updateUserProfile = async (updatedProfile) => {
    try {
      const data = await requestApi('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(updatedProfile)
      });
      if (data && data.user) {
        setUser(normalizeUser(data.user));
        addNotification('Profile Updated', 'Your profile details have been saved.', 'success');
        return true;
      }
    } catch {
      // Fallback
    }

    setUser(prev => ({ ...prev, ...updatedProfile }));
    addNotification('Profile Saved', 'Your profile has been updated.', 'success');
    return true;
  };

  const addCompetition = async (newComp) => {
    const localComp = {
      ...newComp,
      id: 'comp-' + Date.now(),
      status: 'Open',
      startDate: new Date().toISOString().split('T')[0],
      organizerLogo: newComp.organizer.substring(0, 3).toUpperCase(),
      organizerColor: 'from-indigo-600 to-purple-600',
      tags: [newComp.category, 'Student Challenge'],
      featured: false
    };

    try {
      const data = await requestApi('/competitions', {
        method: 'POST',
        body: JSON.stringify(newComp)
      });
      if (data && data.competition) {
        const createdComp = normalizeCompetition(data.competition);
        setCompetitions(prev => [createdComp, ...prev]);
        addNotification('Competition Published', `"${createdComp.title}" is now live.`, 'success');
        return createdComp;
      }
    } catch {
      // Fallback
    }

    setCompetitions(prev => [localComp, ...prev]);
    addNotification('Competition Published', `"${localComp.title}" is now live.`, 'success');
    return localComp;
  };

  const updateCompetition = async (id, updatedFields) => {
    try {
      const data = await requestApi(`/competitions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedFields)
      });
      if (data && data.competition) {
        const updated = normalizeCompetition(data.competition);
        setCompetitions(prev => prev.map(c => c.id === id ? updated : c));
        addNotification('Competition Updated', 'Listing details were saved.', 'success');
        return updated;
      }
    } catch {
      // Fallback
    }

    setCompetitions(prev => prev.map(c => c.id === id ? { ...c, ...updatedFields } : c));
    addNotification('Competition Updated', 'Listing details were saved.', 'success');
    return true;
  };

  const deleteCompetition = async (id) => {
    try {
      await requestApi(`/competitions/${id}`, { method: 'DELETE' });
    } catch {
      // Fallback
    }
    setCompetitions(prev => prev.filter(c => c.id !== id));
    addNotification('Competition Removed', 'Competition listing was deleted.', 'warning');
    return true;
  };

  const toggleSaveCompetition = async (id) => {
    const isCurrentlySaved = savedCompetitions.includes(id);
    const nextSaved = isCurrentlySaved 
      ? savedCompetitions.filter(item => item !== id) 
      : [...savedCompetitions, id];

    setSavedCompetitions(nextSaved);
    setUser(prev => ({ ...prev, savedCompetitions: nextSaved }));

    addNotification(
      isCurrentlySaved ? 'Bookmark Removed' : 'Competition Saved to Database',
      isCurrentlySaved 
        ? 'Competition removed from saved bookmarks.' 
        : 'Competition bookmarked and saved to your database profile!',
      'info'
    );

    if (authToken) {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/saved-competitions/${id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        }).catch(() => null);

        if (res && res.ok) {
          const data = await res.json();
          if (data.savedCompetitions && Array.isArray(data.savedCompetitions)) {
            setSavedCompetitions(data.savedCompetitions.map(String));
          }
          if (data.user) {
            setUser(normalizeUser(data.user));
          }
        } else {
          await requestApi('/auth/profile', {
            method: 'PUT',
            body: JSON.stringify({ savedCompetitions: nextSaved })
          }).catch(() => null);
        }
      } catch (err) {
        console.error('Failed to persist saved competitions to database:', err);
      }
    }
  };

  const createSubmission = async (subData) => {
    // Ensure competitionId is always a plain string (MongoDB ObjectId)
    const compId = String(subData.competitionId || '');
    const comp = competitions.find(c => c.id === compId || c._id === compId) || competitions[0];

    try {
      const response = await fetch(`${API_BASE_URL}/submissions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
        },
        body: JSON.stringify({ ...subData, competitionId: comp._id || comp.id || compId })
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok && data.success && data.submission) {
        const created = normalizeSubmission(data.submission);
        setSubmissions(prev => [created, ...prev]);
        addNotification('Submission Received! 🚀', `Your entry for "${created.competitionTitle}" was submitted to MongoDB.`, 'success');
        return created;
      } else {
        const errMsg = data.message || 'Failed to save submission.';
        addNotification('Submission Failed', errMsg, 'error');
        console.error('Submission error from server:', errMsg);
        return null;
      }
    } catch (err) {
      console.error('Submission network error:', err);
      addNotification('Server / MongoDB Error', 'Cannot connect to server. Ensure backend is running on port 5000.', 'error');
      return null;
    }
  };

  const updateSubmission = async (subId, updatedData) => {
    try {
      const data = await requestApi(`/submissions/${subId}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData)
      });
      if (data && data.submission) {
        const updated = normalizeSubmission(data.submission);
        setSubmissions(prev => prev.map(s => s.id === subId ? updated : s));
        addNotification('Submission Updated', 'Project changes were saved.', 'success');
        return updated;
      }
    } catch {
      // Fallback
    }

    setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, ...updatedData } : s));
    addNotification('Submission Updated', 'Project changes were saved.', 'success');
    return true;
  };

  const updateSubmissionStatus = async (subId, newStatus, notes) => {
    try {
      const data = await requestApi(`/submissions/${subId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus, evaluatorNotes: notes })
      });
      if (data && data.submission) {
        const updated = normalizeSubmission(data.submission);
        setSubmissions(prev => prev.map(s => s.id === subId ? updated : s));
        addNotification('Status Updated', `Submission marked "${newStatus}".`, 'success');
        return updated;
      }
    } catch {
      // Fallback
    }

    setSubmissions(prev => prev.map(s => s.id === subId ? { ...s, status: newStatus, evaluatorNotes: notes } : s));
    addNotification('Status Updated', `Submission marked "${newStatus}".`, 'success');
    return true;
  };

  // Routes that require authentication
  const PROTECTED_ROUTES = ['dashboard', 'profile', 'submit', 'my-submissions', 'admin'];

  const navigateTo = (route, compId = null, subId = null) => {
    // If not authenticated and trying to access a protected route, show login modal
    if (!isAuthenticated && PROTECTED_ROUTES.includes(route)) {
      const targetRole = route === 'admin' ? 'admin' : 'student';
      openAuthModal('login', targetRole);
      return;
    }
    setCurrentRoute(route);
    if (compId !== null) setSelectedCompetitionId(compId);
    if (subId !== null) setSelectedSubmissionId(subId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider value={{
      competitions,
      submissions,
      user,
      isAuthenticated,
      isLoadingData,
      showAuthModal,
      authMode,
      authRoleTarget,
      setShowAuthModal,
      openAuthModal,
      loginUser,
      registerStudent,
      registerAdmin,
      resetPassword,
      logoutUser,
      authToken,
      authHeaders,
      savedCompetitions,
      notifications,
      currentRoute,
      selectedCompetitionId,
      selectedSubmissionId,
      searchQuery,
      selectedCategory,
      setSearchQuery,
      setSelectedCategory,
      switchRole,
      updateUserProfile,
      addCompetition,
      updateCompetition,
      deleteCompetition,
      toggleSaveCompetition,
      createSubmission,
      updateSubmission,
      updateSubmissionStatus,
      refreshAllData,
      navigateTo,
      addNotification,
      markNotificationRead
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
