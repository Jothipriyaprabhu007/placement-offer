import React from 'react';
import { 
  FileCheck, 
  Calendar, 
  Award, 
  Sparkles, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  FileText, 
  ExternalLink 
} from 'lucide-react';
import { UserProfile, Application, Interview, Offer, Job } from '../../types';
import { DataStore } from '../../lib/storage';

interface StudentDashboardProps {
  currentUser: UserProfile;
  onNavigate: (view: string) => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({ 
  currentUser, 
  onNavigate 
}) => {
  const applications = DataStore.getApplications().filter(a => a.student_id === currentUser.id);
  const interviews = DataStore.getInterviews().filter(i => i.student_id === currentUser.id);
  const offers = DataStore.getOffers().filter(o => o.student_id === currentUser.id);
  const announcements = DataStore.getAnnouncements().slice(0, 2);
  const recommendedJobs = DataStore.getJobs().slice(0, 2);

  const pendingApps = applications.filter(a => ['applied', 'under_review'].includes(a.status)).length;
  const shortlistedApps = applications.filter(a => ['shortlisted', 'interview_scheduled'].includes(a.status)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold border border-purple-500/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Graduating Batch {currentUser.graduation_year || currentUser.batch_year || 2026}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Welcome back, {currentUser.full_name || 'Student'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
            {currentUser.department || currentUser.branch || 'Department'} • {currentUser.college_name || 'Apex Institute'} • ID: {currentUser.student_id || currentUser.college_id || 'ID Pending'} • Verified CGPA:{' '}
            <strong className="text-emerald-400">
              {currentUser.cgpa !== undefined && currentUser.cgpa !== null ? Number(currentUser.cgpa).toFixed(2) : '0.00'}
            </strong>{' '}
            / 10.0
          </p>
          {currentUser.is_placed && (
            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
              <Award className="w-4 h-4" />
              <span>Placement Confirmed: {currentUser.current_placement}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('student-profile-setup')}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-purple-400" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={() => onNavigate('student-resume-analyzer')}
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-lg shadow-purple-600/25 flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>ATS Resume Audit</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Total Applied</span>
            <FileCheck className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{applications.length}</div>
          <span className="text-[11px] text-slate-500">{pendingApps} in review</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Shortlisted</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400">{shortlistedApps}</div>
          <span className="text-[11px] text-slate-500">Advanced to rounds</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Interviews</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-white">{interviews.length}</div>
          <span className="text-[11px] text-amber-400 font-medium">
            {interviews.filter(i => i.status === 'scheduled').length} upcoming
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Job Offers</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-extrabold text-purple-400">{offers.length}</div>
          <span className="text-[11px] text-slate-500">
            {offers.filter(o => o.status === 'accepted').length} accepted
          </span>
        </div>

      </div>

      {/* Main Grid: Application Timeline & Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Active Applications Pipeline */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-purple-400" />
              <span>Active Applications Status</span>
            </h2>
            <button
              onClick={() => onNavigate('student-applications')}
              className="text-xs text-purple-400 hover:text-purple-300 font-medium"
            >
              View all ({applications.length})
            </button>
          </div>

          {applications.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400">
              <p className="text-xs">You haven't submitted any job applications yet.</p>
              <button
                onClick={() => onNavigate('find-jobs')}
                className="mt-3 px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold text-xs"
              >
                Browse Vacancies
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map(app => {
                const statusMap: Record<Application['status'], { label: string; color: string }> = {
                  applied: { label: 'Applied', color: 'bg-slate-700 text-slate-200' },
                  under_review: { label: 'Under Review', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
                  shortlisted: { label: 'Shortlisted', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
                  interview_scheduled: { label: 'Interview Scheduled', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
                  offered: { label: 'Offer Extended', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
                  rejected: { label: 'Not Selected', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' }
                };
                const s = statusMap[app.status];

                return (
                  <div
                    key={app.id}
                    className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-white text-sm">{app.job_title}</h3>
                        <p className="text-xs text-purple-400 font-medium">{app.company_name}</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${s.color}`}>
                        {s.label}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        <span>AI Match: <strong className="text-white">{app.match_score}%</strong></span>
                      </div>
                      <span>Applied: {new Date(app.applied_at).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                    </div>

                    {app.recruiter_notes && (
                      <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-[11px] text-slate-300">
                        <strong className="text-slate-400 block text-[10px] uppercase">Recruiter Note:</strong>
                        {app.recruiter_notes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Scheduled Interviews & Placement Alerts */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Upcoming Interviews Card */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Upcoming Interviews</span>
            </h2>

            {interviews.length === 0 ? (
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center text-slate-400">
                <p className="text-xs">No interviews currently scheduled.</p>
              </div>
            ) : (
              interviews.map(inv => (
                <div key={inv.id} className="p-4 rounded-2xl bg-slate-900 border border-amber-500/30 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold text-[10px]">
                      {inv.round_type}
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      {new Date(inv.scheduled_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-white text-sm">{inv.job_title}</h3>
                    <p className="text-xs text-purple-400">{inv.company_name}</p>
                    {inv.interviewer_name && (
                      <p className="text-[11px] text-slate-400 mt-0.5">Interviewer: {inv.interviewer_name}</p>
                    )}
                  </div>

                  {inv.meeting_link && (
                    <a
                      href={inv.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Join Online Meeting</span>
                    </a>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Campus Announcements */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Placement Board Circulars</span>
            </h2>

            <div className="space-y-3">
              {announcements.map(ann => (
                <div key={ann.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-purple-500/20 text-purple-300">
                      {ann.priority} priority
                    </span>
                    <span className="text-[10px] text-slate-500">{new Date(ann.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 className="text-xs font-bold text-white">{ann.title}</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Verified Student Credentials & Profile Details Card */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>Verified Student Credentials & Placement Profile</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Live records saved to Supabase database. These verified parameters govern your placement eligibility.
            </p>
          </div>
          <button
            onClick={() => onNavigate('student-profile')}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-md shadow-purple-600/20 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <FileText className="w-4 h-4" />
            <span>Edit Profile</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          {/* Column 1: Academic & Contact */}
          <div className="space-y-3 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider text-purple-400">
              Academic & Contact Info
            </h3>
            <div className="space-y-1.5 text-slate-300">
              <p><strong className="text-slate-400">Full Name:</strong> {currentUser.full_name || 'N/A'}</p>
              <p><strong className="text-slate-400">Student ID:</strong> {currentUser.student_id || currentUser.college_id || 'N/A'}</p>
              <p><strong className="text-slate-400">College:</strong> {currentUser.college_name || 'N/A'}</p>
              <p><strong className="text-slate-400">Department:</strong> {currentUser.department || currentUser.branch || 'N/A'}</p>
              <p><strong className="text-slate-400">Degree & Year:</strong> {currentUser.degree_and_year || 'B.Tech'}</p>
              <p><strong className="text-slate-400">Graduation Year:</strong> {currentUser.graduation_year || currentUser.batch_year || '2026'}</p>
              <p><strong className="text-slate-400">Email:</strong> {currentUser.email || 'N/A'}</p>
              <p><strong className="text-slate-400">Phone:</strong> {currentUser.phone || 'N/A'}</p>
              <p><strong className="text-slate-400">Verified CGPA:</strong> <span className="font-bold text-emerald-400">{currentUser.cgpa !== undefined && currentUser.cgpa !== null ? Number(currentUser.cgpa).toFixed(2) : '0.00'} / 10.0</span></p>
            </div>
          </div>

          {/* Column 2: Technical Skills & Languages */}
          <div className="space-y-3 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider text-purple-400">
              Technical Competencies
            </h3>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Technical Skills & Frameworks:</span>
              <div className="flex flex-wrap gap-1.5">
                {(currentUser.technical_skills || currentUser.skills || []).length > 0 ? (
                  (currentUser.technical_skills || currentUser.skills || []).map((skill, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-purple-500/15 text-purple-300 border border-purple-500/30 text-[11px] font-medium">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic text-[11px]">No technical skills added yet.</span>
                )}
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Programming Languages:</span>
              <div className="flex flex-wrap gap-1.5">
                {(currentUser.programming_languages || []).length > 0 ? (
                  (currentUser.programming_languages || []).map((lang, idx) => (
                    <span key={idx} className="px-2.5 py-0.5 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[11px] font-medium">
                      {lang}
                    </span>
                  ))
                ) : (
                  <span className="text-slate-500 italic text-[11px]">No programming languages listed.</span>
                )}
              </div>
            </div>

            {/* Official Resume */}
            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">Official Student Resume:</span>
              {currentUser.resume_filename || currentUser.resume_url ? (
                <div className="p-2 rounded-xl bg-purple-950/40 border border-purple-500/40 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 truncate">
                    <FileText className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="text-white text-xs font-medium truncate">
                      {currentUser.resume_filename || 'Verified_Resume.pdf'}
                    </span>
                  </div>
                  {currentUser.resume_url ? (
                    <a
                      href={currentUser.resume_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-purple-300 hover:text-white underline shrink-0"
                    >
                      View
                    </a>
                  ) : (
                    <span className="text-[10px] text-emerald-400 shrink-0 font-medium">Uploaded</span>
                  )}
                </div>
              ) : (
                <span className="text-amber-400 text-[11px]">No resume uploaded yet.</span>
              )}
            </div>
          </div>

          {/* Column 3: Projects & Certifications */}
          <div className="space-y-3 bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider text-purple-400">
              Projects & Certifications
            </h3>
            
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Academic Projects ({(currentUser.projects || []).length}):
              </span>
              {(currentUser.projects || []).length > 0 ? (
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {(currentUser.projects || []).map(p => (
                    <div key={p.id} className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                      <h4 className="font-bold text-white">{p.title}</h4>
                      <p className="text-[10px] text-purple-300">{p.tech_stack}</p>
                      <p className="text-slate-400 line-clamp-2 mt-0.5">{p.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-slate-500 italic text-[11px]">No projects added.</span>
              )}
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-1">
                Certifications ({(currentUser.certifications || []).length}):
              </span>
              {(currentUser.certifications || []).length > 0 ? (
                <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                  {(currentUser.certifications || []).map(c => (
                    <div key={c.id} className="text-[11px] text-slate-300">
                      • <strong className="text-white">{c.title}</strong> — {c.issuer} ({c.year})
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-slate-500 italic text-[11px]">No certifications listed.</span>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
