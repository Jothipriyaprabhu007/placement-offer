import React from 'react';
import { 
  Briefcase, 
  Users, 
  Calendar, 
  Award, 
  PlusCircle, 
  Building2, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  ExternalLink 
} from 'lucide-react';
import { UserProfile, Job, Application, Interview } from '../../types';
import { DataStore } from '../../lib/storage';

interface RecruiterDashboardProps {
  currentUser: UserProfile;
  onNavigate: (view: string) => void;
}

export const RecruiterDashboard: React.FC<RecruiterDashboardProps> = ({ 
  currentUser, 
  onNavigate 
}) => {
  const jobs = DataStore.getJobs().filter(j => j.company_name.toLowerCase().includes(currentUser.company_name?.toLowerCase() || 'technova'));
  const allApplications = DataStore.getApplications().filter(a => a.company_name.toLowerCase().includes(currentUser.company_name?.toLowerCase() || 'technova'));
  const interviews = DataStore.getInterviews().filter(i => i.company_name.toLowerCase().includes(currentUser.company_name?.toLowerCase() || 'technova'));
  const offers = DataStore.getOffers().filter(o => o.company_name.toLowerCase().includes(currentUser.company_name?.toLowerCase() || 'technova'));

  const company = DataStore.getCompanies().find(c => c.name.toLowerCase().includes(currentUser.company_name?.toLowerCase() || 'technova'));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/60 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30">
              Corporate Recruitment Portal
            </span>
            {company?.verification_status === 'verified' && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Employer
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {currentUser.company_name || 'TechNova Solutions'} Talent Acquisition
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Lead Recruiter: <strong className="text-white">{currentUser.full_name}</strong> ({currentUser.designation || 'Head of Campus Hiring'})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('recruiter-post-job')}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Vacancy</span>
          </button>
          <button
            onClick={() => onNavigate('recruiter-applicants')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
          >
            Review Candidates
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Postings</span>
            <Briefcase className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{jobs.length}</div>
          <span className="text-[11px] text-slate-500">Total campus vacancies</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Applicants</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{allApplications.length}</div>
          <span className="text-[11px] text-slate-500">Graduating cohort submissions</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Interviews</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{interviews.length}</div>
          <span className="text-[11px] text-amber-400 font-medium">Scheduled assessment rounds</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Offers Extended</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-purple-400">{offers.length}</div>
          <span className="text-[11px] text-slate-500">Formal letters issued</span>
        </div>

      </div>

      {/* Active Jobs & Applicants Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Active Jobs List */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" />
              <span>Company Vacancies</span>
            </h2>
            <button
              onClick={() => onNavigate('recruiter-post-job')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
            >
              + Add Vacancy
            </button>
          </div>

          <div className="space-y-3">
            {jobs.map(job => (
              <div
                key={job.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">{job.title}</h3>
                    <p className="text-xs text-slate-400">{job.location} • {job.work_mode}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300">
                    {job.salary_range}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-400">
                  <span>Min CGPA: <strong className="text-white">{job.min_cgpa}</strong></span>
                  <button
                    onClick={() => onNavigate('recruiter-applicants')}
                    className="text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1"
                  >
                    <span>View Applicants</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Applicants */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Recent Candidate Submissions</span>
            </h2>
            <button
              onClick={() => onNavigate('recruiter-applicants')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              Pipeline View
            </button>
          </div>

          <div className="space-y-3">
            {allApplications.slice(0, 3).map(app => (
              <div
                key={app.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 hover:border-slate-700 transition"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{app.student_name}</h4>
                    <p className="text-xs text-slate-400">{app.job_title}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    {app.match_score}% AI Fit
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Branch: {app.student_branch || 'Engineering'}</span>
                  <span>CGPA: <strong className="text-emerald-400">{app.student_cgpa !== undefined && app.student_cgpa !== null ? Number(app.student_cgpa).toFixed(2) : 'N/A'}</strong></span>
                  <button
                    onClick={() => onNavigate('recruiter-applicants')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
                  >
                    Review & Stage
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
