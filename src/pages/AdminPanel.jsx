import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { 
  ShieldAlert, 
  Plus, 
  Trash2, 
  Eye, 
  Download, 
  Lock,
  Mail, 
  LogIn, 
  LogOut, 
  ShieldCheck,
  X
} from 'lucide-react';

export const AdminPanel = () => {
  const { 
    user,
    isAuthenticated,
    loginUser,
    logoutUser,
    competitions, 
    addCompetition, 
    deleteCompetition, 
    submissions, 
    updateSubmissionStatus,
    loadSubmissions,
    navigateTo,
    addNotification
  } = useApp();

  // Admin Auth Gateway Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Main Admin Console State
  const [activeTab, setActiveTab] = useState('competitions'); // 'competitions', 'submissions', 'analytics'
  const [showAddModal, setShowAddModal] = useState(false);

  // New Competition Form State
  const [newTitle, setNewTitle] = useState('');
  const [newOrganizer, setNewOrganizer] = useState('');
  const [newCategory, setNewCategory] = useState('UI/UX Design');
  const [newDeadline, setNewDeadline] = useState('2026-09-30T23:59:59');
  const [newPrizePool, setNewPrizePool] = useState('₹1,00,000 Prize Pool');
  const [newEligibility, setNewEligibility] = useState('Open to all Design Students');
  const [newDescription, setNewDescription] = useState('');

  // Evaluation Form State
  const [selectedSubId, setSelectedSubId] = useState(submissions[0]?.id || null);
  const [evalStatus, setEvalStatus] = useState('Under Process');
  const [evalNotes, setEvalNotes] = useState('');

  const activeSub = submissions.find(s => s.id === selectedSubId) || submissions[0];

  useEffect(() => {
    if (user.role === 'admin') {
      loadSubmissions();
    }
  }, [user.role, activeTab, loadSubmissions]);

  useEffect(() => {
    if ((!selectedSubId || !submissions.some(s => s.id === selectedSubId)) && submissions.length > 0) {
      setSelectedSubId(submissions[0].id);
      setEvalStatus(submissions[0].status || 'Under Process');
      setEvalNotes(submissions[0].evaluatorNotes || '');
    }
  }, [selectedSubId, submissions]);

  // Handle Admin Security Login
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) {
      setAuthError('Please provide admin email and password.');
      return;
    }
    const didLogin = await loginUser(adminEmail, adminPassword, 'admin');
    if (!didLogin) {
      setAuthError('Please provide a valid admin email and password.');
      return;
    }
    setAuthError('');
  };

  const handleCreateCompetition = async (e) => {
    e.preventDefault();
    if (!newTitle.trim() || !newOrganizer.trim()) {
      alert('Please provide Competition Title and Organizer Name.');
      return;
    }

    const created = await addCompetition({
      title: newTitle,
      organizer: newOrganizer,
      organizerLogo: newOrganizer.substring(0, 3).toUpperCase(),
      category: newCategory,
      deadline: newDeadline,
      prizePool: newPrizePool,
      eligibility: newEligibility,
      description: newDescription || 'Official design challenge brief for student innovators.',
      prizes: [
        { rank: '1st Winner', reward: newPrizePool },
        { rank: 'Runner-up', reward: 'Merit Certificate + Mentorship' }
      ],
      deliverables: ['Figma Prototype Link', 'Executive Slide Deck PDF'],
      judgingCriteria: [
        { name: 'Innovation & Utility', weight: '50%' },
        { name: 'Visual Execution', weight: '50%' }
      ],
      bannerImage: 'https://images.unsplash.com/photo-1542744094-3a3121699563?auto=format&fit=crop&w=1200&q=80'
    });

    if (created) {
      setShowAddModal(false);
      setNewTitle('');
      setNewOrganizer('');
      setNewDescription('');
    }
  };

  const handleEvaluateSubmission = async () => {
    if (!selectedSubId) return;
    const updated = await updateSubmissionStatus(selectedSubId, evalStatus, evalNotes);
    if (updated) {
      addNotification('Evaluation Saved', `Submission status updated to "${evalStatus}".`, 'success');
    }
  };

  // CSV Report Generator
  const handleExportCSV = () => {
    const csvRows = [
      ['Submission ID', 'Student Name', 'Project Title', 'Competition Title', 'Status', 'Submitted At'],
      ...submissions.map(s => [
        s.id,
        `"${s.studentName || 'Student'}"`,
        `"${s.projectTitle}"`,
        `"${s.competitionTitle}"`,
        s.status,
        s.submittedAt
      ])
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `DesignPulse_Submissions_Report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addNotification('CSV Exported', 'Submissions report has been downloaded.', 'info');
  };

  
  // CONDITIONAL VIEW 1 SEPARATE ADMIN AUTHENTICATION GATEWAY
  
  if (!isAuthenticated || user.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto py-12 space-y-8">
        
        {/* Dedicated Admin Login Card */}
        <div className="surface-card p-8 sm:p-10 space-y-6 shadow-xl relative border-purple-200">
          
          <div className="text-center space-y-2.5">
            <div className="w-14 h-14 rounded-2xl bg-purple-50 border border-purple-100 text-purple-700 flex items-center justify-center mx-auto shadow-2xs">
              <ShieldAlert className="w-7 h-7" />
            </div>

            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
              <Lock className="w-3.5 h-3.5" />
              <span>Restricted Organizer Portal</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
              Admin Authentication Gateway
            </h1>
            <p className="text-xs text-slate-600 leading-relaxed max-w-md mx-auto font-sans">
              Sign in with your organizer credentials to publish competitions, review student entries, and assign jury awards.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-bold">
              {authError}
            </div>
          )}

          {/* Admin Login Form */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="admin@designpulse.org"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full app-input pl-9 pr-4 py-2.5 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full app-input pl-9 pr-4 py-2.5 rounded-xl text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center space-x-2"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In & Access Admin Console</span>
            </button>

            <button
              type="button"
              onClick={() => navigateTo('competitions')}
              className="text-xs text-slate-500 hover:text-indigo-600 transition-colors block mx-auto pt-2 font-medium"
            >
              Return to Student Portal
            </button>
          </form>
        </div>

      </div>
    );
  }

  
  // CONDITIONAL VIEW 2: AUTHENTICATED ADMIN MANAGEMENT CONSOLE

  return (
    <div className="space-y-8 pb-16">
      
      {/* Admin Header */}
      <div className="surface-card p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-purple-200">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-2 border border-purple-100">
            <ShieldCheck className="w-4 h-4 text-purple-600" />
            <span>Authenticated Administrator ({user.name})</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
            Competition Management & Jury Desk
          </h1>
          <p className="text-xs text-slate-600 font-sans">
            Publish design challenges, review student deliverables, update evaluation pipelines, and export reports.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Competition</span>
          </button>

          <button
            onClick={logoutUser}
            className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 border border-slate-200 text-xs font-bold transition-all flex items-center space-x-1"
            title="Sign out of admin console"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Lock Panel</span>
          </button>
        </div>
      </div>

      {/* Admin Sub-Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('competitions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'competitions'
              ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Manage Competitions ({competitions.length})
        </button>

        <button
          onClick={() => setActiveTab('submissions')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'submissions'
              ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Evaluate Submissions ({submissions.length})
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'analytics'
              ? 'bg-purple-50 text-purple-700 border border-purple-200 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          Analytics & Export
        </button>
      </div>

      {/* TAB 1: Manage Competitions */}
      {activeTab === 'competitions' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {competitions.map(comp => (
              <div key={comp.id} className="surface-card p-5 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">{comp.organizer}</span>
                    <StatusBadge status={comp.status} type="competition" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">{comp.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 font-sans">{comp.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-slate-900">{comp.prizePool}</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigateTo('detail', comp.id)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700"
                      title="View Specs"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${comp.title}"?`)) {
                          deleteCompetition(comp.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700"
                      title="Delete Listing"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Evaluate Submissions */}
      {activeTab === 'submissions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Submissions List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                Entries ({submissions.length})
              </h3>
              <button
                onClick={() => {
                  loadSubmissions();
                  addNotification('Refreshed', 'Fetched latest submissions from MongoDB.', 'info');
                }}
                className="text-[11px] font-bold text-purple-600 hover:text-purple-800 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-all"
              >
                ↻ Sync Live
              </button>
            </div>
            {submissions.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center space-y-1">
                <p className="text-xs font-bold text-slate-700">No submissions yet</p>
                <p className="text-[11px] text-slate-400">Student submissions will appear here once submitted.</p>
              </div>
            ) : (
              submissions.map(sub => (
                <div
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubId(sub.id);
                    setEvalStatus(sub.status);
                    setEvalNotes(sub.evaluatorNotes || '');
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ${
                    selectedSubId === sub.id
                      ? 'bg-purple-50 border-purple-300 shadow-2xs'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="font-bold text-purple-700">{sub.studentName}</span>
                    <StatusBadge status={sub.status} type="submission" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 font-heading line-clamp-1">{sub.projectTitle}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-1">{sub.competitionTitle}</p>
                </div>
              ))
            )}
          </div>

          {/* Evaluation Controls */}
          {activeSub && (
            <div className="lg:col-span-2 space-y-6">
              <div className="surface-card p-6 sm:p-8 space-y-6">
                <div>
                  <span className="text-xs font-bold text-purple-700 block">{activeSub.competitionTitle}</span>
                  <h2 className="text-xl font-extrabold text-slate-900 font-heading">{activeSub.projectTitle}</h2>
                  <p className="text-xs text-slate-500 mt-1 font-sans">Submitted by {activeSub.studentName} ({activeSub.studentEmail})</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">Executive Summary</label>
                  <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl border border-slate-200 font-sans">{activeSub.summary}</p>
                </div>

                {/* Status Updater Box */}
                <div className="p-5 rounded-2xl bg-purple-50/70 border border-purple-200 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-purple-900 font-heading">Jury Decision & Status Update</h4>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Set New Status</label>
                      <select
                        value={evalStatus}
                        onChange={(e) => setEvalStatus(e.target.value)}
                        className="w-full app-input px-3 py-2 rounded-xl text-xs font-bold"
                      >
                        <option value="Submitted">Submitted</option>
                        <option value="Under Process">Under Process (In Review)</option>
                        <option value="Confirmed">Confirmed (Shortlisted)</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Jury Notes / Feedback</label>
                      <input
                        type="text"
                        placeholder="Add comments for the student..."
                        value={evalNotes}
                        onChange={(e) => setEvalNotes(e.target.value)}
                        className="w-full app-input px-3 py-2 rounded-xl text-xs"
                      />
                    </div>
                  </div>

                  <button
                    onClick={handleEvaluateSubmission}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-xs transition-all"
                  >
                    Save Jury Decision
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Analytics & Export */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="surface-card p-6 space-y-1">
              <span className="text-xs font-semibold text-slate-500">Total Competitions Listed</span>
              <span className="text-3xl font-black text-slate-900 font-mono block">{competitions.length}</span>
            </div>

            <div className="surface-card p-6 space-y-1">
              <span className="text-xs font-semibold text-slate-500">Total Student Submissions</span>
              <span className="text-3xl font-black text-indigo-600 font-mono block">{submissions.length}</span>
            </div>

            <div className="surface-card p-6 space-y-1">
              <span className="text-xs font-semibold text-slate-500">Shortlisted Entries</span>
              <span className="text-3xl font-black text-emerald-600 font-mono block">
                {submissions.filter(s => s.status === 'Confirmed').length}
              </span>
            </div>
          </div>

          <div className="surface-card p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-slate-900 font-heading">Export Submission Data</h3>
            <p className="text-xs text-slate-600 font-sans">
              Download the complete dataset of student submissions in CSV format for offline reporting, spreadsheet evaluation, and institutional archives.
            </p>
            <button
              onClick={handleExportCSV}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-2 shadow-xs transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Export Submissions CSV Report</span>
            </button>
          </div>
        </div>
      )}

      {/* Create Competition Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-xl w-full space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900 font-heading">Publish New Competition</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreateCompetition} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Competition Title</label>
                <input
                  type="text"
                  placeholder="e.g. Adobe Creative Jam 2026"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full app-input px-3.5 py-2.5 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Organizer Institution</label>
                <input
                  type="text"
                  placeholder="e.g. National Institute of Design"
                  value={newOrganizer}
                  onChange={(e) => setNewOrganizer(e.target.value)}
                  className="w-full app-input px-3.5 py-2.5 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full app-input px-3 py-2 rounded-xl text-xs font-semibold"
                  >
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Product/Industrial">Product/Industrial</option>
                    <option value="Graphic & Brand">Graphic & Brand</option>
                    <option value="Architecture">Architecture</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prize Pool</label>
                  <input
                    type="text"
                    value={newPrizePool}
                    onChange={(e) => setNewPrizePool(e.target.value)}
                    className="w-full app-input px-3 py-2 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description / Brief</label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full app-input px-3 py-2 rounded-xl text-xs font-sans"
                  placeholder="Overview of the challenge, objectives, and goals..."
                ></textarea>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-white text-slate-700 font-bold text-xs border border-slate-200 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
                >
                  Publish Listing
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
