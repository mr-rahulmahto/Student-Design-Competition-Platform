import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { DeadlineCountdown } from '../components/DeadlineCountdown';
import { 
  Sparkles, 
  FileCheck, 
  Bookmark, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  Bell,
  Award,
  GraduationCap
} from 'lucide-react';

export const StudentDashboard = () => {
  const { 
    user, 
    isAuthenticated,
    submissions, 
    competitions, 
    savedCompetitions, 
    navigateTo,
    loadSubmissions,
    notifications 
  } = useApp();

  useEffect(() => {
    if (isAuthenticated && loadSubmissions) {
      loadSubmissions();
    }
  }, [isAuthenticated, loadSubmissions]);

  const activeSubmissions = submissions.filter(s => s.status !== 'Draft');
  const confirmedSubmissions = submissions.filter(s => s.status === 'Confirmed');
  const savedComps = competitions.filter(c => savedCompetitions.includes(c.id));
  
  // Find nearest closing competition
  const openCompetitions = competitions.filter(c => c.status === 'Open' || c.status === 'Closing Soon');
  const nearestClosingComp = [...openCompetitions].sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Welcome Banner */}
      <div className="surface-card p-6 sm:p-8 relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white shadow-md">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/30 border border-white/20 shadow-xs"
            />
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                  Welcome back, {user.name.split(' ')[0]}! 👋
                </h1>
              </div>
              <p className="text-xs text-indigo-100 mt-1 flex items-center gap-1.5 font-sans">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-300" />
                <span>{user.degree} • <strong className="text-white">{user.institution}</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigateTo('competitions')}
              className="px-5 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs shadow-xs transition-all flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Explore Competitions</span>
            </button>
          </div>

        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="surface-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Active Submissions</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900 font-mono">{activeSubmissions.length}</span>
            <span className="text-[11px] text-slate-500 font-medium">entries tracked</span>
          </div>
        </div>

        <div className="surface-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Confirmed Projects</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-emerald-700 font-mono">{confirmedSubmissions.length}</span>
            <span className="text-[11px] text-slate-500 font-medium">shortlisted</span>
          </div>
        </div>

        <div className="surface-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Saved Contests</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline space-x-2">
            <span className="text-3xl font-black text-slate-900 font-mono">{savedCompetitions.length}</span>
            <span className="text-[11px] text-slate-500 font-medium">bookmarked</span>
          </div>
        </div>

        <div className="surface-card p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Nearest Deadline</span>
            <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="pt-1">
            {nearestClosingComp ? (
              <DeadlineCountdown targetDate={nearestClosingComp.deadline} compact={true} />
            ) : (
              <span className="text-xs text-slate-500">No active deadlines</span>
            )}
          </div>
        </div>

      </div>

      {/* Main Grid: Left Active Tracker & Notifications, Right Bookmarked Competitions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols) */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          
          {/* Active Submissions Progress Overview */}
          <div className="surface-card p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-600" />
                <span>My Active Application Progress</span>
              </h3>
              <button
                onClick={() => navigateTo('my-submissions')}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors flex items-center gap-1"
              >
                <span>View All ({submissions.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {submissions.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 font-sans">No active applications. Start by discovering a competition!</p>
            ) : (
              <div className="space-y-3">
                {submissions.slice(0, 3).map(sub => (
                  <div
                    key={sub.id}
                    onClick={() => navigateTo('my-submissions', null, sub.id)}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">
                          {sub.organizer}
                        </span>
                        <StatusBadge status={sub.status} type="submission" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 font-heading">
                        {sub.projectTitle}
                      </h4>
                      <p className="text-xs text-slate-500 font-sans">
                        {sub.competitionTitle}
                      </p>
                    </div>

                    <button className="px-3 py-1.5 rounded-xl bg-white text-xs font-bold text-slate-700 hover:text-indigo-600 border border-slate-200 shrink-0 shadow-2xs">
                      Track Progress
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Platform Notifications & Updates */}
          <div className="surface-card p-6 sm:p-8 space-y-4">
            <h3 className="text-base sm:text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <Bell className="w-5 h-5 text-indigo-600" />
              <span>Activity Log & Notifications</span>
            </h3>

            <div className="space-y-3">
              {notifications.map(n => (
                <div key={n.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start space-x-3 text-xs">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-900">{n.title}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-snug font-sans">{n.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Bookmarked Competitions Sidebar */}
        <div className="space-y-6">
          <div className="surface-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-amber-500" />
                <span>Saved Contests ({savedComps.length})</span>
              </h3>
            </div>

            {savedComps.length === 0 ? (
              <p className="text-xs text-slate-500 py-4 font-sans">No saved competitions yet.</p>
            ) : (
              <div className="space-y-3">
                {savedComps.map(comp => (
                  <div 
                    key={comp.id}
                    onClick={() => navigateTo('detail', comp.id)}
                    className="p-3.5 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200 transition-all cursor-pointer space-y-2"
                  >
                    <span className="text-[10px] font-bold text-indigo-700 block">{comp.organizer}</span>
                    <h4 className="text-xs font-bold text-slate-900 font-heading line-clamp-1">{comp.title}</h4>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                      <span className="font-mono text-slate-900 font-bold">{comp.prizePool}</span>
                      <DeadlineCountdown targetDate={comp.deadline} compact={true} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
