import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { DeadlineCountdown } from '../components/DeadlineCountdown';
import { 
  ArrowLeft, 
  Trophy, 
  Upload, 
  Bookmark, 
  Award, 
  CheckCircle2, 
  FileText, 
  Download, 
  ShieldCheck, 
  Sparkles
} from 'lucide-react';

export const CompetitionDetail = () => {
  const { 
    competitions, 
    selectedCompetitionId, 
    navigateTo, 
    savedCompetitions, 
    toggleSaveCompetition,
    submissions,
    addNotification
  } = useApp();

  const competition = competitions.find(c => c.id === selectedCompetitionId) || competitions[0];
  const isSaved = savedCompetitions.includes(competition.id);

  // Check if student already submitted an entry for this competition
  const existingSubmission = submissions.find(s => s.competitionId === competition.id);

  const handleDownloadPDF = () => {
    addNotification('Guidelines PDF Downloaded', `Official guidelines for "${competition.title}" have been saved to your downloads.`, 'info');
    alert(`Downloading official guidelines PDF for "${competition.title}"...`);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Back Navigation Bar */}
      <button
        onClick={() => navigateTo('competitions')}
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Competitions</span>
      </button>

      {/* Hero Banner Section */}
      <div className="relative rounded-3xl overflow-hidden surface-card bg-slate-900 border-none shadow-md">
        <div className="h-64 sm:h-80 w-full relative">
          <img
            src={competition.bannerImage}
            alt={competition.title}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>

          {/* Top floating controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
            <StatusBadge status={competition.status} type="competition" />

            <div className="flex items-center space-x-2">
              <button
                onClick={() => toggleSaveCompetition(competition.id)}
                className={`p-2.5 rounded-xl backdrop-blur-md transition-all shadow-xs ${
                  isSaved
                    ? 'bg-indigo-600 text-white'
                    : 'bg-white/90 text-slate-800 hover:bg-white hover:text-indigo-600'
                }`}
                title={isSaved ? 'Bookmarked' : 'Save Competition'}
                aria-label="Save Competition"
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          </div>

          {/* Banner bottom info overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-10 space-y-2.5">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white text-indigo-700 font-black text-sm flex items-center justify-center shadow-xs font-heading">
                {competition.organizerLogo || 'CP'}
              </div>
              <div>
                <span className="text-xs font-bold text-indigo-200 tracking-wider uppercase block">
                  Hosted by {competition.organizer}
                </span>
                <span className="text-[11px] text-slate-300">Verified Student Competition</span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-heading tracking-tight leading-tight">
              {competition.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Specs & Details, Right Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols wide on desktop) */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          
          {/* Executive Overview & Problem Statement */}
          <div className="surface-card p-6 sm:p-8 space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <span>Challenge Overview & Problem Brief</span>
            </h2>
            <p className="text-sm text-slate-700 leading-relaxed font-sans">
              {competition.description}
            </p>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-slate-500 block font-semibold mb-1">Target Category</span>
                <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100">
                  {competition.category}
                </span>
              </div>

              <div>
                <span className="text-xs text-slate-500 block font-semibold mb-1">Eligibility Pool</span>
                <span className="text-xs text-slate-800 font-medium">
                  {competition.eligibility}
                </span>
              </div>
            </div>
          </div>

          {/* Submission Deliverables & Format Requirements */}
          <div className="surface-card p-6 sm:p-8 space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>Required Deliverables</span>
            </h2>
            <div className="space-y-3">
              {competition.deliverables.map((item, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs sm:text-sm text-slate-700">
                  <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                    {idx + 1}
                  </div>
                  <span className="font-medium pt-0.5">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Judging Criteria */}
          <div className="surface-card p-6 sm:p-8 space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              <span>Jury Evaluation Criteria</span>
            </h2>
            <div className="space-y-4">
              {competition.judgingCriteria.map((c, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex justify-between text-xs text-slate-700 font-semibold">
                    <span>{c.name}</span>
                    <span className="font-mono text-indigo-600 font-bold">{c.weight}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200">
                    <div 
                      className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                      style={{ width: c.weight }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Prize Breakdown Tier List */}
          <div className="surface-card p-6 sm:p-8 space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 font-heading flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Prize Pool Breakdown ({competition.prizePool})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {competition.prizes.map((p, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/70 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white font-black flex items-center justify-center shrink-0 shadow-2xs">
                    <Award className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-amber-900/80 font-bold block">{p.rank}</span>
                    <span className="text-sm font-black text-slate-900 font-mono">{p.reward}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Sticky Action Sidebar */}
        <div className="space-y-6">
          
          <div className="surface-card p-6 space-y-6 sticky top-24">
            
            <div>
              <span className="text-xs uppercase font-bold text-slate-500 tracking-wider block mb-2 font-heading">
                Submission Deadline
              </span>
              <DeadlineCountdown targetDate={competition.deadline} />
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Opening Date:</span>
                <span className="text-slate-900 font-bold font-mono">{competition.startDate}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Closing Date:</span>
                <span className="text-slate-900 font-bold font-mono">{competition.deadline.split('T')[0]}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span className="font-medium">Entry Fee:</span>
                <span className="text-emerald-700 font-bold">100% Free (Student Tier)</span>
              </div>
            </div>

            {/* Submission CTAs */}
            {existingSubmission ? (
              <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-3">
                <div className="flex items-center space-x-2 text-indigo-900 font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                  <span>Entry Already Submitted</span>
                </div>
                <p className="text-xs text-slate-700 leading-snug">
                  You submitted <strong>"{existingSubmission.projectTitle}"</strong> on {new Date(existingSubmission.submittedAt).toLocaleDateString()}.
                </p>
                <button
                  onClick={() => navigateTo('my-submissions', null, existingSubmission.id)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all"
                >
                  View & Edit My Submission
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigateTo('submit', competition.id)}
                className="w-full py-3.5 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm shadow-xs transition-all flex items-center justify-center space-x-2 group"
              >
                <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Submit Entry Now</span>
              </button>
            )}

            {/* Download Guidelines Action */}
            <div className="pt-2">
              <button
                onClick={handleDownloadPDF}
                className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 transition-all flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4 text-indigo-600" />
                <span>Download Guidelines PDF</span>
              </button>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
