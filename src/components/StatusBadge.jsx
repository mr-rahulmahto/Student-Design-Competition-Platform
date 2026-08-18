import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  AlertCircle, 
  FileText,
  Eye,
  CheckCheck,
  XCircle
} from 'lucide-react';

export const StatusBadge = ({ status, type = 'competition' }) => {
  // Competition Statuses
  if (type === 'competition') {
    switch (status) {
      case 'Closing Soon':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>Closing Soon</span>
          </span>
        );
      case 'Open':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Open for Entries</span>
          </span>
        );
      case 'Upcoming':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-800 border border-blue-200/80 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Opening Soon</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            <span>Closed</span>
          </span>
        );
    }
  }

  // Submission Statuses: Draft, Submitted, Under Process, Confirmed, Rejected
  switch (status) {
    case 'Draft':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          <FileText className="w-3.5 h-3.5 text-slate-500" />
          <span>Draft</span>
        </span>
      );
    case 'Submitted':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
          <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
          <span>Submitted</span>
        </span>
      );
    case 'Under Process':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200">
          <Eye className="w-3.5 h-3.5 text-purple-600" />
          <span>Jury Review</span>
        </span>
      );
    case 'Confirmed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Shortlisted / Confirmed</span>
        </span>
      );
    case 'Rejected':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          <span>Not Selected</span>
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
          <span>{status}</span>
        </span>
      );
  }
};
