import React from 'react';
import { Sparkles, Shield, Heart } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer = () => {
  const { navigateTo } = useApp();

  return (
    <footer className="bg-white border-t border-slate-200 mt-20 pt-12 pb-8 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-100">
          
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-2xs">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 font-heading">
                Design<span className="text-indigo-600">Pulse</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Centralized discovery, project submission, and real-time tracking platform for national and international student design competitions.
            </p>
          </div>

          {/* Featured Partners */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-heading">
              Partner Ecosystem
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">Unified Mentor Hackathons</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">National Institute of Design (NID)</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">World Design Organization (WDO)</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">Red Dot Award: Junior Concept</li>
              <li className="hover:text-indigo-600 cursor-pointer transition-colors">James Dyson Foundation</li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-heading">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><button onClick={() => navigateTo('competitions')} className="hover:text-indigo-600 transition-colors">Discover Competitions</button></li>
              <li><button onClick={() => navigateTo('dashboard')} className="hover:text-indigo-600 transition-colors">Student Dashboard</button></li>
              <li><button onClick={() => navigateTo('my-submissions')} className="hover:text-indigo-600 transition-colors">Track Submissions</button></li>
              <li><button onClick={() => navigateTo('profile')} className="hover:text-indigo-600 transition-colors">Student Portfolio Profile</button></li>
              <li><button onClick={() => navigateTo('admin')} className="hover:text-indigo-600 transition-colors">Host / Admin Portal</button></li>
            </ul>
          </div>

          {/* Verification & Trust */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3 font-heading">
              Submission Standards
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              All competitions adhere to strict jury anonymity rules, verified student eligibility, and copyright protection standards.
            </p>
            <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
              <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Verified Competition Briefs</span>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} DesignPulse Platform. Empowering student innovators.</p>
          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-800 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-slate-800 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-slate-800 cursor-pointer">Jury Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
