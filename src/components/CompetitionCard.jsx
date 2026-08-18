import React from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from './StatusBadge';
import { DeadlineCountdown } from './DeadlineCountdown';
import { 
  Trophy, 
  Bookmark, 
  ArrowRight, 
  Upload, 
  Sparkles
} from 'lucide-react';

export const CompetitionCard = ({ competition }) => {
  const { navigateTo, savedCompetitions, toggleSaveCompetition } = useApp();
  const isSaved = savedCompetitions.includes(competition.id);

  return (
    <div className="surface-card surface-card-hover flex flex-col justify-between overflow-hidden group">
      
      {/* Banner / Header Image */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <img
          src={competition.bannerImage}
          alt={competition.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/20 to-transparent"></div>

        {/* Top Badges overlay */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <StatusBadge status={competition.status} type="competition" />
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleSaveCompetition(competition.id);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition-all shadow-xs ${
              isSaved 
                ? 'bg-indigo-600 text-white' 
                : 'bg-white/90 text-slate-700 hover:bg-white hover:text-indigo-600'
            }`}
            title={isSaved ? 'Bookmarked' : 'Save Competition'}
            aria-label="Save Competition"
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Organizer Badge */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-white/95 text-indigo-700 font-extrabold text-xs flex items-center justify-center shadow-xs font-heading">
              {competition.organizerLogo || 'CP'}
            </div>
            <span className="text-xs font-semibold text-white drop-shadow-sm truncate max-w-[200px]">
              {competition.organizer}
            </span>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Category Pill & Featured Tag */}
          <div className="flex items-center space-x-2 mb-2.5">
            <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-md">
              {competition.category}
            </span>
            {competition.featured && (
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-600" /> Featured
              </span>
            )}
          </div>

          <h3 
            onClick={() => navigateTo('detail', competition.id)}
            className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 cursor-pointer font-heading leading-snug"
          >
            {competition.title}
          </h3>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed font-sans">
            {competition.description}
          </p>
        </div>

        {/* Info Grid: Prize & Countdown */}
        <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-500" /> Prize Pool
            </span>
            <span className="font-extrabold text-slate-900 font-mono text-sm">{competition.prizePool}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500 font-medium">Time Left:</span>
            <DeadlineCountdown targetDate={competition.deadline} compact={true} />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center space-x-2">
          <button
            onClick={() => navigateTo('detail', competition.id)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all flex items-center justify-center space-x-1.5"
          >
            <span>View Brief</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
          </button>

          <button
            onClick={() => navigateTo('submit', competition.id)}
            className="py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center space-x-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Submit Entry</span>
          </button>
        </div>

      </div>
    </div>
  );
};
