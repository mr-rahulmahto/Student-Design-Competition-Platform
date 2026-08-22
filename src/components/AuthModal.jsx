import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  X,
  UserCheck,
  ShieldAlert,
  LogIn,
  UserPlus,
  Upload,
  Sparkles,
  Lock,
  Mail,
  User,
  RotateCcw
} from 'lucide-react';

export const AuthModal = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    authMode,
    authRoleTarget,
    loginUser,
    registerStudent,
    registerAdmin,
    resetPassword
  } = useApp();

  const [activeTab, setActiveTab] = useState(authMode || 'login'); // 'login' or 'signup' or 'forgot'
  const [role, setRole] = useState(authRoleTarget || 'student'); // 'student' or 'admin'

  // Common Login Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Student Registration Form State
  const [name, setName] = useState('');
  const [institution, setInstitution] = useState('');
  const [degree, setDegree] = useState('Bachelor of Design (B.Des)');
  const [bio, setBio] = useState('');
  const [portfolioUrl] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80');

  // Admin and password reset state
  const [organizerName, setOrganizerName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    setActiveTab(authMode || 'login');
    setRole(authRoleTarget || 'student');
    setFormError('');
  }, [authMode, authRoleTarget, showAuthModal]);

  if (!showAuthModal) return null;

  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  ];

  const handleAvatarFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setAvatar(localUrl);
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setFormError('Please enter your email address and password.');
      return;
    }
    setFormError('');
    loginUser(email, password, role).then(success => {
      if (!success) {
        setFormError(`Could not sign in as ${role}. Check your credentials.`);
      }
    });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    if (!password.trim() || password.length < 6) {
      setFormError('Please enter a password with at least 6 characters.');
      return;
    }

    if (role === 'student') {
      if (!name.trim() || !email.trim()) {
        setFormError('Please fill in your name and email address.');
        return;
      }
      setFormError('');
      registerStudent({
        name,
        email,
        password,
        institution: institution || 'Design Institute',
        degree: degree || 'Bachelor of Design',
        bio: bio || 'Design student & competition participant.',
        portfolioUrl,
        avatar
      }).then(success => {
        if (!success) {
          setFormError('Student registration failed. Check the email address and try again.');
        }
      });
    } else {
      if (!name.trim() || !email.trim()) {
        setFormError('Please complete the admin name and email fields.');
        return;
      }
      setFormError('');
      registerAdmin({
        name,
        email,
        password,
        organizerName: organizerName || 'Competition Organizer',
        bio: bio || 'Competition jury coordinator.'
      }).then(success => {
        if (!success) {
          setFormError('Admin registration failed. Check the email address and try again.');
        }
      });
    }
  };

  const handleForgotPasswordSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() || !newPassword.trim()) {
      setFormError('Please enter your email and a new password.');
      return;
    }
    if (newPassword.length < 6) {
      setFormError('New password must be at least 6 characters.');
      return;
    }

    setFormError('');
    resetPassword({ email, role, newPassword }).then(success => {
      if (success) {
        setNewPassword('');
        setPassword('');
        setActiveTab('login');
      } else {
        setFormError('Password reset failed. Check your email and selected role.');
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">

      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">

        {/* Close Button */}
        <button
          onClick={() => setShowAuthModal(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="space-y-1.5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs">
            <Sparkles className="w-6 h-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 font-heading">
            Design<span className="text-indigo-600">Pulse</span> Portal
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Discover student design briefs, submit your portfolio entries, and track jury evaluations.
          </p>
        </div>

        {/* Role Switcher Pills */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${role === 'student'
              ? 'bg-white text-indigo-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Student Portal</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('admin')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1.5 ${role === 'admin'
              ? 'bg-white text-purple-700 shadow-2xs'
              : 'text-slate-600 hover:text-slate-900'
              }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Admin Portal</span>
          </button>
        </div>

        {/* Auth Mode Tabs */}
        <div className="flex border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 pb-2 text-xs font-bold transition-all border-b-2 ${activeTab === 'login'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setActiveTab('signup')}
            className={`flex-1 pb-2 text-xs font-bold transition-all border-b-2 ${activeTab === 'signup'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
          >
            New Registration
          </button>
          <button
            onClick={() => setActiveTab('forgot')}
            className={`flex-1 pb-2 text-xs font-bold transition-all border-b-2 ${activeTab === 'forgot'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
          >
            Reset Password
          </button>
        </div>

        {formError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs text-center font-semibold">
            {formError}
          </div>
        )}

        {/* FORM 1: LOGIN */}
        {activeTab === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {role === 'student' ? 'Student Email' : 'Admin Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder={role === 'student' ? 'rahul.student@designpulse.edu' : 'admin@designpulse.org'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full app-input pl-9 pr-4 py-2.5 rounded-xl text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full app-input pl-9 pr-4 py-2.5 rounded-xl text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 rounded-2xl text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center space-x-2 ${role === 'student' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-purple-600 hover:bg-purple-700'
                }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In as {role === 'student' ? 'Student' : 'Admin'}</span>
            </button>
          </form>
        ) : activeTab === 'forgot' ? (
          <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {role === 'student' ? 'Student Email' : 'Admin Email'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="name@institution.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full app-input pl-9 pr-4 py-2.5 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full app-input pl-9 pr-4 py-2.5 rounded-xl text-xs"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Update Password</span>
            </button>
          </form>
        ) : (
          /* FORM 2: SIGNUP / REGISTRATION */
          <form onSubmit={handleSignupSubmit} className="space-y-4">

            {/* Student Avatar Picker */}
            {role === 'student' && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <label className="block text-xs font-bold text-slate-700">
                  Profile Photo / Avatar
                </label>

                <div className="flex items-center space-x-4">
                  <img
                    src={avatar}
                    alt="Preview"
                    className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/30 border border-slate-200 shrink-0"
                  />

                  <div className="space-y-2 flex-1">
                    <label className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-xs cursor-pointer inline-flex items-center space-x-1.5 transition-all">
                      <Upload className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Upload File</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarFileUpload}
                        className="hidden"
                      />
                    </label>

                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] text-slate-500 font-medium">Or pick:</span>
                      {presetAvatars.map((url, idx) => (
                        <img
                          key={idx}
                          src={url}
                          alt={`Preset ${idx + 1}`}
                          onClick={() => setAvatar(url)}
                          className={`w-6 h-6 rounded-md object-cover cursor-pointer border ${avatar === url ? 'ring-2 ring-indigo-600 border-indigo-600' : 'border-slate-200 opacity-70'
                            }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={role === 'student' ? 'e.g. Rahul Kumar' : 'e.g. Competition Jury Lead'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full app-input pl-9 pr-4 py-2.5 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="name@institution.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full app-input pl-9 pr-4 py-2.5 rounded-xl text-xs"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full app-input pl-9 pr-4 py-2.5 rounded-xl text-xs"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {role === 'student' ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Institution</label>
                    <input
                      type="text"
                      placeholder="e.g. NID / IIT"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      className="w-full app-input px-3.5 py-2.5 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Degree Program</label>
                    <input
                      type="text"
                      placeholder="e.g. B.Des UI/UX"
                      value={degree}
                      onChange={(e) => setDegree(e.target.value)}
                      className="w-full app-input px-3.5 py-2.5 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Bio Summary</label>
                  <textarea
                    rows={2}
                    placeholder="Short intro about your design interests..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full app-input px-3.5 py-2 rounded-xl text-xs"
                  ></textarea>
                </div>
              </>
            ) : (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Organization / Institution Name</label>
                <input
                  type="text"
                  placeholder="e.g. Unified Mentor / NID"
                  value={organizerName}
                  onChange={(e) => setOrganizerName(e.target.value)}
                  className="w-full app-input px-3.5 py-2.5 rounded-xl text-xs"
                />
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 rounded-2xl text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center space-x-2 ${role === 'student' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-purple-600 hover:bg-purple-700'
                }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Register as {role === 'student' ? 'Student' : 'Admin'}</span>
            </button>

          </form>
        )}

      </div>

    </div>
  );
};
