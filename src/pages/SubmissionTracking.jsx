import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { 
  FileCheck, 
  ExternalLink, 
  Edit3, 
  MessageSquare, 
  ChevronRight, 
  FileText,
  Clock,
  CheckCircle2
} from 'lucide-react';

export const SubmissionTracking = () => {
  const { submissions, navigateTo, loadSubmissions } = useApp();
  const [activeSubmissionId, setActiveSubmissionId] = useState(submissions[0]?.id || null);

  useEffect(() => {
    if (loadSubmissions) {
      loadSubmissions();
    }
  }, [loadSubmissions]);

  const activeSubmission = submissions.find(s => s.id === activeSubmissionId) || submissions[0];

  const statusSteps = [
    { key: 'Draft', label: '1. Draft' },
    { key: 'Submitted', label: '2. Submitted' },
    { key: 'Under Process', label: '3. Jury Review' },
    { key: 'Confirmed', label: '4. Confirmed' }
  ];

  const getStepIndex = (status) => {
    if (status === 'Draft') return 0;
    if (status === 'Submitted') return 1;
    if (status === 'Under Process') return 2;
    if (status === 'Confirmed') return 3;
    if (status === 'Rejected') return 2; // review completed but not selected
    return 1;
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="surface-card p-6 sm:p-8 space-y-2">
        <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold">
          <FileCheck className="w-4 h-4 text-indigo-600" />
          <span>Application Tracker</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-heading">
          My Application Progress & Submissions
        </h1>
        <p className="text-xs text-slate-600 font-sans">
          Monitor your competition entries, view jury review progress updates, and refine your submissions before closing deadlines.
        </p>
      </div>

      {submissions.length === 0 ? (
        <div className="surface-card p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto shadow-2xs">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 font-heading">No Submissions Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            You haven't submitted any competition projects yet. Discover active competitions and launch your entry.
          </p>
          <button
            onClick={() => navigateTo('competitions')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all"
          >
            Explore Competitions
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Submissions List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1 font-heading">
              Submitted Projects ({submissions.length})
            </h3>

            {submissions.map(sub => {
              const isSelected = sub.id === (activeSubmission?.id || activeSubmissionId);
              return (
                <div
                  key={sub.id}
                  onClick={() => setActiveSubmissionId(sub.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                    isSelected
                      ? 'bg-indigo-50/80 border-indigo-300 shadow-2xs'
                      : 'bg-white hover:bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                      {sub.organizer}
                    </span>
                    <StatusBadge status={sub.status} type="submission" />
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 font-heading line-clamp-1">
                    {sub.projectTitle}
                  </h4>

                  <p className="text-xs text-slate-600 line-clamp-1">
                    {sub.competitionTitle}
                  </p>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span>Submitted: {new Date(sub.submittedAt).toLocaleDateString()}</span>
                    <ChevronRight className="w-4 h-4 text-indigo-600" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Pipeline & Submission Details */}
          {activeSubmission && (
            <div className="lg:col-span-2 space-y-6">
              
              {/* Submission Card Header */}
              <div className="surface-card p-6 sm:p-8 space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-indigo-700 block mb-1">
                      {activeSubmission.competitionTitle}
                    </span>
                    <h2 className="text-xl font-extrabold text-slate-900 font-heading">
                      {activeSubmission.projectTitle}
                    </h2>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => navigateTo('submit', activeSubmission.competitionId, activeSubmission.id)}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all flex items-center space-x-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Edit Entry</span>
                    </button>
                  </div>
                </div>

                {/* Status Pipeline Stepper */}
                <div className="space-y-3 pt-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block font-heading">
                    Jury Review & Evaluation Progress
                  </span>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    {statusSteps.map((step, idx) => {
                      const currentIdx = getStepIndex(activeSubmission.status);
                      const isCompleted = idx <= currentIdx;
                      const isCurrent = idx === currentIdx;

                      return (
                        <div key={step.key} className="space-y-2">
                          <div
                            className={`h-2 rounded-full transition-all ${
                              isCompleted
                                ? isCurrent
                                  ? 'bg-indigo-600'
                                  : 'bg-indigo-400'
                                : 'bg-slate-200'
                            }`}
                          ></div>
                          <span
                            className={`text-[11px] font-bold block ${
                              isCurrent
                                ? 'text-indigo-700 font-extrabold'
                                : isCompleted
                                ? 'text-slate-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Evaluator Notes Banner */}
                {activeSubmission.evaluatorNotes && (
                  <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs space-y-1.5">
                    <div className="flex items-center space-x-2 text-indigo-900 font-bold">
                      <MessageSquare className="w-4 h-4 text-indigo-600" />
                      <span>Jury Feedback Note</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed font-sans">
                      "{activeSubmission.evaluatorNotes}"
                    </p>
                  </div>
                )}

                {/* Submission Description */}
                <div className="space-y-2 pt-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                    Project Rationale & Summary
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 font-sans">
                    {activeSubmission.summary}
                  </p>
                </div>

                {/* Attached Artifacts */}
                {activeSubmission.files && activeSubmission.files.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                      Attached Design Files ({activeSubmission.files.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {activeSubmission.files.map(f => (
                        <div key={f.id} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div className="flex items-center space-x-3 overflow-hidden text-xs">
                            <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                            <span className="font-bold text-slate-800 truncate">{f.name}</span>
                          </div>
                          <a
                            href={f.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-slate-200 transition-all"
                            aria-label="View file"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* External Links */}
                {activeSubmission.links && activeSubmission.links.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">
                      Submitted Links
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeSubmission.links.map((link, idx) => (
                        <a
                          key={idx}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-indigo-700 hover:text-indigo-800 transition-all flex items-center space-x-1.5 shadow-2xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                          <span>{link.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
