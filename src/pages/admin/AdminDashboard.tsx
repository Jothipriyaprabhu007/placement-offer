import React from 'react';
import { 
  ShieldCheck, 
  Users, 
  Briefcase, 
  Building2, 
  FileCheck, 
  AlertTriangle, 
  Clock, 
  Download, 
  ArrowRight, 
  CheckCircle2, 
  XCircle,
  Database
} from 'lucide-react';
import { UserProfile } from '../../types';
import { DataStore } from '../../lib/storage';
import { exportToCSV } from '../../lib/csvExport';

interface AdminDashboardProps {
  currentUser: UserProfile;
  onNavigate: (view: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  currentUser, 
  onNavigate 
}) => {
  const profiles = DataStore.getProfiles();
  const students = profiles.filter(p => p.role === 'student');
  const recruiters = profiles.filter(p => p.role === 'recruiter');
  const tpos = profiles.filter(p => p.role === 'placement_officer');
  const companies = DataStore.getCompanies();
  const jobs = DataStore.getJobs();
  const applications = DataStore.getApplications();
  const auditLogs = DataStore.getAuditLogs().slice(0, 5);

  const pendingCompanies = companies.filter(c => c.verification_status === 'pending');
  const flaggedJobs = jobs.filter(j => j.status === 'flagged' || j.is_reported);

  const handleExportSystemAudit = () => {
    const logs = DataStore.getAuditLogs().map(l => ({
      'Log ID': l.id,
      'Timestamp': l.created_at,
      'Actor Email': l.actor_email,
      'Action': l.action,
      'Entity Type': l.entity_type,
      'Entity ID': l.entity_id,
      'Details': JSON.stringify(l.details || {})
    }));
    exportToCSV(`HireReady_System_Audit_Log_${new Date().getFullYear()}`, logs);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Superadmin Security Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/40">
            <ShieldCheck className="w-4 h-4 text-purple-400" />
            <span>Root Administrator • Server-Verified Session</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Platform Command & Security Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Superadmin: <strong className="text-white">{currentUser.email}</strong> • Active Row Level Security
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('admin-jobs')}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4" />
            <span>Moderate Job Postings</span>
          </button>
          <button
            onClick={handleExportSystemAudit}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export Audit Log (CSV)</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Students</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{students.length}</div>
          <span className="text-[11px] text-slate-500">Graduating cohort</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Recruiters</span>
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{recruiters.length}</div>
          <span className="text-[11px] text-slate-500">{companies.length} corporate entities</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Active Jobs</span>
            <Briefcase className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{jobs.length}</div>
          <span className="text-[11px] text-slate-500">Platform listings</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Applications</span>
            <FileCheck className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{applications.length}</div>
          <span className="text-[11px] text-slate-500">Total submissions</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Pending Verifications</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-amber-400">{pendingCompanies.length}</div>
          <span className="text-[11px] text-slate-500">Corporate partners</span>
        </div>

      </div>

      {/* Action Center: Verification Approvals & Job Moderation Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Pending Employer Verifications */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Corporate Employer Verification Queue</span>
            </h2>
            <button
              onClick={() => onNavigate('admin-recruiters')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              Manage ({companies.length})
            </button>
          </div>

          {pendingCompanies.length === 0 ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto mb-2 opacity-60" />
              <p className="text-slate-300 font-semibold">All employer accounts verified</p>
              <p className="text-slate-500 mt-0.5">No pending business entity approvals in queue.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingCompanies.map(comp => (
                <div
                  key={comp.id}
                  className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{comp.name}</h4>
                      <p className="text-xs text-slate-400">{comp.industry} • {comp.location}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Pending Audit
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2">
                    {comp.description}
                  </p>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        DataStore.updateCompanyStatus(comp.id, 'rejected');
                        onNavigate('admin-dashboard');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 text-rose-300 hover:bg-slate-700 text-xs font-semibold"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => {
                        DataStore.updateCompanyStatus(comp.id, 'verified');
                        onNavigate('admin-dashboard');
                      }}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-md shadow-emerald-600/25"
                    >
                      Approve & Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Security Audit Logs */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Real-Time Security Audit Trail</span>
            </h2>
            <button
              onClick={() => onNavigate('admin-audit')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              Full Trail
            </button>
          </div>

          <div className="space-y-2.5">
            {auditLogs.map(log => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs space-y-1 hover:border-slate-700 transition"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold uppercase">
                    {log.action}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {new Date(log.created_at).toLocaleTimeString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-400 pt-1 text-[11px]">
                  <span>Actor: <strong className="text-white">{log.actor_email}</strong></span>
                  <span>Entity: {log.entity_type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
