import React, { useState } from 'react';
import { 
  FileCheck, 
  Search, 
  Calendar, 
  Award, 
  Sparkles, 
  Clock, 
  ExternalLink, 
  CheckCircle2, 
  XCircle 
} from 'lucide-react';
import { Application, UserProfile } from '../../types';
import { DataStore } from '../../lib/storage';

interface StudentApplicationsProps {
  currentUser: UserProfile;
  onNavigate: (view: string) => void;
}

export const StudentApplications: React.FC<StudentApplicationsProps> = ({ 
  currentUser,
  onNavigate 
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const applications = DataStore.getApplications().filter(a => a.student_id === currentUser.id);

  const filtered = applications.filter(a => {
    if (filter !== 'all' && a.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return a.job_title.toLowerCase().includes(q) || a.company_name.toLowerCase().includes(q);
    }
    return true;
  });

  const getStatusBadge = (status: Application['status']) => {
    switch (status) {
      case 'applied':
        return <span className="px-2.5 py-1 rounded-full bg-slate-700 text-slate-200 text-xs font-semibold">Applied</span>;
      case 'under_review':
        return <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-semibold">Under Review</span>;
      case 'shortlisted':
        return <span className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold">Shortlisted</span>;
      case 'interview_scheduled':
        return <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold">Interview Scheduled</span>;
      case 'offered':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">Offer Extended</span>;
      case 'rejected':
        return <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-semibold">Not Selected</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <FileCheck className="w-6 h-6 text-purple-400" />
            <span>My Placement Applications</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Track real-time recruitment progression, recruiter feedback, and scheduled rounds.
          </p>
        </div>

        <button
          onClick={() => onNavigate('find-jobs')}
          className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition"
        >
          Explore More Openings
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by company or job role..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          {['all', 'applied', 'under_review', 'shortlisted', 'interview_scheduled', 'offered'].map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-xl capitalize font-medium transition shrink-0 ${
                filter === tab 
                  ? 'bg-purple-600 text-white font-semibold' 
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table / Cards */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 space-y-2">
          <p className="text-sm font-semibold text-slate-300">No applications match your filter</p>
          <p className="text-xs">Browse the active vacancies list and submit an application.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(app => (
            <div
              key={app.id}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold text-white text-base">{app.job_title}</h3>
                  <p className="text-xs text-purple-400 font-semibold">{app.company_name}</p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 flex items-center gap-1 font-semibold">
                    <Sparkles className="w-3 h-3 text-purple-400" />
                    {app.match_score}% AI Fit
                  </span>
                  {getStatusBadge(app.status)}
                </div>
              </div>

              {app.cover_note && (
                <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/60 text-xs text-slate-300">
                  <span className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Your Submission Note:</span>
                  "{app.cover_note}"
                </div>
              )}

              {app.recruiter_notes && (
                <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-200">
                  <span className="text-[10px] text-purple-300 font-bold block uppercase mb-1">Recruiter Feedback / Status Update:</span>
                  {app.recruiter_notes}
                </div>
              )}

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Applied: {new Date(app.applied_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                
                {app.status === 'interview_scheduled' && (
                  <button
                    onClick={() => onNavigate('student-dashboard')}
                    className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1"
                  >
                    <span>View Scheduled Interview</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                )}

                {app.status === 'offered' && (
                  <button
                    onClick={() => onNavigate('student-offers')}
                    className="text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
                  >
                    <span>Review Official Offer</span>
                    <Award className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
