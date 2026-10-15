import React, { useState } from 'react';
import { 
  Briefcase, 
  AlertTriangle, 
  CheckCircle2, 
  Trash2, 
  Flag, 
  Search, 
  ShieldCheck, 
  Building2 
} from 'lucide-react';
import { Job } from '../../types';
import { DataStore } from '../../lib/storage';

export const JobModeration: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(DataStore.getJobs());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const reloadJobs = () => {
    setJobs(DataStore.getJobs());
  };

  const handleToggleStatus = (jobId: string, currentStatus: Job['status']) => {
    const nextStatus = currentStatus === 'flagged' ? 'active' : 'flagged';
    DataStore.updateJob(jobId, { status: nextStatus });
    DataStore.addAuditLog('MODERATED_JOB_STATUS', 'JOB', jobId, { status: nextStatus });
    reloadJobs();
  };

  const handleDeleteJob = (jobId: string) => {
    if (confirm('Are you sure you want to permanently delete this job listing?')) {
      DataStore.deleteJob(jobId);
      DataStore.addAuditLog('DELETED_JOB_LISTING', 'JOB', jobId);
      reloadJobs();
    }
  };

  const filtered = jobs.filter(j => {
    if (statusFilter !== 'all' && j.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return j.title.toLowerCase().includes(q) || j.company_name.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-purple-400" />
            <span>Job & Internship Moderation Console</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review live corporate vacancies, take down fraudulent listings, and audit recruitment criteria.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800 text-xs">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search job title or hiring organization..."
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-xs"
          />
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-xs"
          >
            <option value="all">All Moderation Statuses</option>
            <option value="active">Active (Live to Students)</option>
            <option value="flagged">Flagged / Moderated</option>
            <option value="closed">Closed</option>
          </select>
        </div>
      </div>

      {/* Jobs Listing */}
      <div className="space-y-4">
        {filtered.map(job => {
          const isFlagged = job.status === 'flagged';

          return (
            <div
              key={job.id}
              className={`p-5 rounded-2xl border transition space-y-3 ${
                isFlagged 
                  ? 'bg-rose-950/20 border-rose-500/40' 
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                      {job.type}
                    </span>
                    <span className="text-xs text-purple-400 font-semibold">{job.company_name}</span>
                    <span className="text-xs text-slate-500">• {job.location}</span>
                  </div>
                  <h3 className="text-base font-bold text-white">{job.title}</h3>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                    isFlagged
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}>
                    {job.status}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {job.description}
              </p>

              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <span>Package: <strong className="text-emerald-400">{job.salary_range}</strong></span>
                  <span>Cutoff: {job.min_cgpa} CGPA</span>
                  <span>Applicants: {job.applicant_count || 0}</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(job.id, job.status)}
                    className={`px-3 py-1.5 rounded-xl font-semibold transition text-xs flex items-center gap-1.5 ${
                      isFlagged
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                    }`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    <span>{isFlagged ? 'Reinstate Job' : 'Flag / Suspend'}</span>
                  </button>

                  <button
                    onClick={() => handleDeleteJob(job.id)}
                    className="p-1.5 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition"
                    title="Permanently Delete Job"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
