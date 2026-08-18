import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Compass, 
  LayoutDashboard, 
  FileCheck, 
  UserCheck, 
  ShieldAlert, 
  Bell, 
  Search, 
  Sparkles, 
  Bookmark,
  LogIn,
  LogOut,
  UserPlus,
  ChevronDown,
  Menu,
  X,
  CheckCheck
} from 'lucide-react';

export const Navbar = () => {
  const { 
    currentRoute, 
    navigateTo, 
    user, 
    isAuthenticated,
    openAuthModal,
    logoutUser,
    switchRole, 
    notifications, 
    markNotificationRead,
    searchQuery,
    setSearchQuery
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNavClick = (route) => {
    navigateTo(route);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Platform Name */}
          <div 
            className="flex items-center space-x-3 cursor-pointer group select-none" 
            onClick={() => handleNavClick('competitions')}
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-sm group-hover:bg-indigo-700 transition-colors">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg sm:text-xl font-extrabold font-heading tracking-tight text-slate-900 flex items-center gap-1">
                Design<span className="text-indigo-600">Pulse</span>
              </span>
              <span className="block text-[10px] tracking-wider uppercase font-semibold text-slate-500 -mt-1">
                Student Competitions
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-1.5">
            <button
              onClick={() => handleNavClick('competitions')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentRoute === 'competitions' || currentRoute === 'detail'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Discover</span>
            </button>

            <button
              onClick={() => handleNavClick('dashboard')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentRoute === 'dashboard'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => handleNavClick('my-submissions')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentRoute === 'my-submissions' || currentRoute === 'submit'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>My Submissions</span>
            </button>

            <button
              onClick={() => handleNavClick('profile')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentRoute === 'profile'
                  ? 'bg-indigo-50 text-indigo-700 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              <span>Profile</span>
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  currentRoute === 'admin'
                    ? 'bg-purple-50 text-purple-700 font-bold border border-purple-200'
                    : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-purple-600" />
                <span>Admin Console</span>
              </button>
            )}
          </nav>

          {/* Right Controls: Search, Role Switcher, Notifications, Auth */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Search Input */}
            <div className="hidden lg:flex items-center relative w-44 xl:w-52">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search contests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full app-input pl-9 pr-3 py-1.5 rounded-xl text-xs"
              />
            </div>

            {/* Role Switcher Pill Control */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => switchRole('student')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  user.role === 'student'
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Student
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                  user.role === 'admin'
                    ? 'bg-white text-purple-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Admin
              </button>
            </div>

            {/* Notification Bell Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all border border-slate-200"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-indigo-600 text-[10px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Popup Drawer */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                    <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-indigo-600" /> Notifications
                    </h4>
                    <span className="text-xs text-slate-500 font-medium">{notifications.length} alerts</span>
                  </div>

                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-500 text-center py-6">No notifications yet.</p>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                            n.read 
                              ? 'bg-slate-50 border-slate-100 text-slate-500'
                              : 'bg-indigo-50/70 border-indigo-100 text-slate-800'
                          }`}
                        >
                          <div className="flex items-start justify-between font-bold text-slate-900 mb-1">
                            <span>{n.title}</span>
                            {!n.read && <span className="w-2 h-2 rounded-full bg-indigo-600"></span>}
                          </div>
                          <p className="text-xs text-slate-600 leading-snug">{n.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Auth Buttons or User Profile Dropdown */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 pl-1.5 pr-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 transition-all cursor-pointer"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-300"
                  />
                  <span className="hidden sm:inline text-xs font-bold text-slate-800">{user.name.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in space-y-1">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-900 block truncate">{user.name}</span>
                      <span className="text-[11px] text-slate-500 block truncate font-mono">{user.email}</span>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                        {user.role === 'admin' ? 'Administrator' : 'Student Creator'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleNavClick('profile');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <UserCheck className="w-4 h-4 text-indigo-600" />
                      <span>My Profile & Portfolio</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        handleNavClick('my-submissions');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-50 flex items-center space-x-2"
                    >
                      <FileCheck className="w-4 h-4 text-emerald-600" />
                      <span>My Submissions Tracker</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logoutUser();
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => openAuthModal('login', 'student')}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-all flex items-center space-x-1"
                >
                  <LogIn className="w-3.5 h-3.5 text-slate-600" />
                  <span>Sign In</span>
                </button>

                <button
                  onClick={() => openAuthModal('signup', 'student')}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Register</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <div className="space-y-1">
            <button
              onClick={() => handleNavClick('competitions')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2.5 ${
                currentRoute === 'competitions' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4 text-indigo-600" />
              <span>Discover Competitions</span>
            </button>

            <button
              onClick={() => handleNavClick('dashboard')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2.5 ${
                currentRoute === 'dashboard' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-600" />
              <span>Student Dashboard</span>
            </button>

            <button
              onClick={() => handleNavClick('my-submissions')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2.5 ${
                currentRoute === 'my-submissions' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FileCheck className="w-4 h-4 text-indigo-600" />
              <span>My Submissions</span>
            </button>

            <button
              onClick={() => handleNavClick('profile')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2.5 ${
                currentRoute === 'profile' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
              }`}
            >
              <UserCheck className="w-4 h-4 text-indigo-600" />
              <span>Profile & Skills</span>
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => handleNavClick('admin')}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold flex items-center space-x-2.5 ${
                  currentRoute === 'admin' ? 'bg-purple-50 text-purple-700 font-bold' : 'text-purple-700 hover:bg-purple-50'
                }`}
              >
                <ShieldAlert className="w-4 h-4 text-purple-600" />
                <span>Admin Console</span>
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Role Mode:</span>
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                onClick={() => switchRole('student')}
                className={`px-3 py-1 rounded-lg font-semibold ${user.role === 'student' ? 'bg-white text-indigo-700 font-bold shadow-2xs' : 'text-slate-600'}`}
              >
                Student
              </button>
              <button
                onClick={() => switchRole('admin')}
                className={`px-3 py-1 rounded-lg font-semibold ${user.role === 'admin' ? 'bg-white text-purple-700 font-bold shadow-2xs' : 'text-slate-600'}`}
              >
                Admin
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
