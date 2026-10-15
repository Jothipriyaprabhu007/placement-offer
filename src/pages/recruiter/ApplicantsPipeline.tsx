import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Calendar, 
  Award, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Sparkles, 
  X, 
  Send, 
  Building2, 
  ExternalLink 
} from 'lucide-react';
import { Application, UserProfile, InterviewRound } from '../../types';
import { DataStore } from '../../lib/storage';

interface ApplicantsPipelineProps {
  currentUser: UserProfile;
}

export const ApplicantsPipeline: React.FC<ApplicantsPipelineProps> = ({ currentUser }) => {
  const companyName = currentUser.company_name || 'TechNova Solutions';
  const [applications, setApplications] = useState<Application[]>(
    DataStore.getApplications().filter(a => a.company_name.toLowerCase().includes(companyName.toLowerCase()))
  );

  const [selectedJobId, setSelectedJobId] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  // Modals state
  const [candidateModalApp, setCandidateModalApp] = useState<Application | null>(null);
  const [interviewModalApp, setInterviewModalApp] = useState<Application | null>(null);
  const [offerModalApp, setOfferModalApp] = useState<Application | null>(null);

  // Interview form state
  const [roundType, setRoundType] = useState<InterviewRound>('Technical Round 1');
  const [interviewDate, setInterviewDate] = useState('2026-10-24T14:30');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/xyz-technova-hiring');
  const [interviewerName, setInterviewerName] = useState('Siddharth Nair (Lead Architect)');

  // Offer form state
  const [offerCtc, setOfferCtc] = useState('₹12.0 LPA (Fixed: ₹10.5 LPA + Performance: ₹1.5 LPA)');
  const [joiningDate, setJoiningDate] = useState('2026-07-01');
  const [bondDetails, setBondDetails] = useState('No bond required; 30-day notice period.');

  const reloadApps = () => {
    setApplications(
      DataStore.getApplications().filter(a => a.company_name.toLowerCase().includes(companyName.toLowerCase()))
    );
  };

  const handleUpdateStatus = (appId: string, status: Application['status']) => {
    DataStore.updateApplicationStatus(appId, status);
    reloadApps();
  };

  const handleScheduleInterview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewModalApp) return;

    DataStore.scheduleInterview({
      application_id: interviewModalApp.id,
      job_id: interviewModalApp.job_id,
      job_title: interviewModalApp.job_title,
      company_name: interviewModalApp.company_name,
      student_id: interviewModalApp.student_id,
      student_name: interviewModalApp.student_name,
      recruiter_id: currentUser.id,
      round_type: roundType,
      scheduled_at: new Date(interviewDate).toISOString(),
      meeting_link: meetingLink,
      interviewer_name: interviewerName
    });

    setInterviewModalApp(null);
    reloadApps();
  };

  const handleExtendOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerModalApp) return;

    DataStore.createOffer({
      application_id: offerModalApp.id,
      student_id: offerModalApp.student_id,
      student_name: offerModalApp.student_name,
      company_id: currentUser.company_id || 'comp-001',
      company_name: offerModalApp.company_name,
      job_id: offerModalApp.job_id,
      role_title: offerModalApp.job_title,
      ctc_or_stipend: offerCtc,
      joining_date: joiningDate,
      bond_details: bondDetails
    });

    setOfferModalApp(null);
    reloadApps();
  };

  // Filter logic
  const filtered = applications.filter(a => {
    if (selectedJobId !== 'all' && a.job_id !== selectedJobId) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return a.student_name.toLowerCase().includes(q) || a.job_title.toLowerCase().includes(q);
    }
    return true;
  });

  const jobsList = DataStore.getJobs().filter(j => j.company_name.toLowerCase().includes(companyName.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-400" />
            <span>Applicant Review & Recruitment Pipeline</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Evaluate student applicants, schedule interview rounds, and extend official offers.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Company:</span>
          <span className="font-bold text-white px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {companyName}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search candidate name or role..."
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-xs"
          />
        </div>

        <div>
          <select
            value={selectedJobId}
            onChange={e => setSelectedJobId(e.target.value)}
            className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-xs"
          >
            <option value="all">All Vacancies ({jobsList.length})</option>
            {jobsList.map(j => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-xs"
          >
            <option value="all">All Stages</option>
            <option value="applied">Applied (New)</option>
            <option value="under_review">Under Review</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="interview_scheduled">Interview Scheduled</option>
            <option value="offered">Offer Extended</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Candidates Table */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800 text-slate-400 space-y-2">
          <Users className="w-10 h-10 mx-auto opacity-30" />
          <p className="text-sm font-semibold text-slate-300">No applicants in this stage</p>
          <p className="text-xs">Adjust your job filter or search criteria to view submissions.</p>
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Role Applied</th>
                  <th className="py-3 px-4">Branch & CGPA</th>
                  <th className="py-3 px-4">AI Fit Score</th>
                  <th className="py-3 px-4">Recruitment Stage</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.map(app => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition">
                    
                    <td className="py-3 px-4">
                      <div>
                        <strong className="text-white block font-medium">{app.student_name}</strong>
                        <span className="text-[11px] text-slate-400">{app.student_email}</span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-white font-medium">{app.job_title}</span>
                    </td>

                    <td className="py-3 px-4">
                      <div>
                        <span>{app.student_branch || 'Engineering'}</span>
                        <span className="block text-[11px] font-bold text-emerald-400">
                          CGPA: {app.student_cgpa !== undefined && app.student_cgpa !== null ? Number(app.student_cgpa).toFixed(2) : 'N/A'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30 text-[11px]">
                        <Sparkles className="w-3 h-3 text-purple-400" />
                        {app.match_score}%
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={app.status}
                        onChange={e => handleUpdateStatus(app.id, e.target.value as any)}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-[11px] text-white focus:outline-none focus:border-indigo-500 font-medium"
                      >
                        <option value="applied">Applied</option>
                        <option value="under_review">Under Review</option>
                        <option value="shortlisted">Shortlisted</option>
                        <option value="interview_scheduled">Interview Scheduled</option>
                        <option value="offered">Offered</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                      <button
                        onClick={() => setCandidateModalApp(app)}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium"
                      >
                        View Profile
                      </button>

                      <button
                        onClick={() => setInterviewModalApp(app)}
                        className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-semibold"
                        title="Schedule Interview"
                      >
                        Interview
                      </button>

                      <button
                        onClick={() => setOfferModalApp(app)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-semibold"
                        title="Extend Job Offer"
                      >
                        Extend Offer
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Candidate Profile Drawer / Modal */}
      {candidateModalApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 space-y-4">
            <button
              onClick={() => setCandidateModalApp(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-lg border border-indigo-500/30">
                {candidateModalApp.student_name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{candidateModalApp.student_name}</h3>
                <p className="text-xs text-slate-400">{candidateModalApp.student_email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Department / Branch</span>
                <span className="font-semibold text-white">{candidateModalApp.student_branch || 'Computer Science'}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <span className="text-[10px] text-slate-400 block">Verified CGPA</span>
                <span className="font-bold text-emerald-400">
                  {candidateModalApp.student_cgpa !== undefined && candidateModalApp.student_cgpa !== null ? `${Number(candidateModalApp.student_cgpa).toFixed(2)} / 10.0` : 'N/A'}
                </span>
              </div>
            </div>

            {candidateModalApp.cover_note && (
              <div className="p-3 rounded-xl bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300">
                <span className="text-[10px] text-slate-400 font-bold uppercase block mb-1">Cover Note:</span>
                "{candidateModalApp.cover_note}"
              </div>
            )}

            <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs space-y-1">
              <span className="text-purple-300 font-bold block text-[11px] uppercase">AI Match Analysis ({candidateModalApp.match_score}%):</span>
              <p className="text-slate-300">
                Meets all academic CGPA requirements with verified competency in core backend and database operations.
              </p>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCandidateModalApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {interviewModalApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 space-y-4">
            <button
              onClick={() => setInterviewModalApp(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white">Schedule Interview Round</h3>
              <p className="text-xs text-purple-400 font-medium">{interviewModalApp.student_name} • {interviewModalApp.job_title}</p>
            </div>

            <form onSubmit={handleScheduleInterview} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Assessment Round</label>
                <select
                  value={roundType}
                  onChange={e => setRoundType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Technical Round 1">Technical Round 1</option>
                  <option value="Technical Round 2">Technical Round 2</option>
                  <option value="Coding Assessment">Coding Assessment</option>
                  <option value="Managerial">Managerial Round</option>
                  <option value="HR Round">HR Round</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={interviewDate}
                  onChange={e => setInterviewDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Lead Interviewer</label>
                <input
                  type="text"
                  required
                  value={interviewerName}
                  onChange={e => setInterviewerName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Online Meeting Link</label>
                <input
                  type="url"
                  required
                  value={meetingLink}
                  onChange={e => setMeetingLink(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInterviewModalApp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition shadow-lg shadow-indigo-600/30"
                >
                  Confirm & Notify Candidate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Extend Offer Modal */}
      {offerModalApp && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 text-slate-100 space-y-4">
            <button
              onClick={() => setOfferModalApp(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-white">Extend Formal Job Offer</h3>
              <p className="text-xs text-emerald-400 font-medium">{offerModalApp.student_name} • {offerModalApp.job_title}</p>
            </div>

            <form onSubmit={handleExtendOffer} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Package CTC / Stipend *</label>
                <input
                  type="text"
                  required
                  value={offerCtc}
                  onChange={e => setOfferCtc(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Projected Joining Date</label>
                <input
                  type="date"
                  required
                  value={joiningDate}
                  onChange={e => setJoiningDate(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Bond / Notice Conditions</label>
                <textarea
                  rows={3}
                  value={bondDetails}
                  onChange={e => setBondDetails(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setOfferModalApp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-lg shadow-emerald-600/30"
                >
                  Issue Offer Letter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
