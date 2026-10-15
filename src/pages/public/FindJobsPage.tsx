import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Briefcase, 
  MapPin, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle, 
  AlertCircle, 
  X, 
  Send, 
  ArrowRight, 
  Clock, 
  Building2, 
  GraduationCap 
} from 'lucide-react';
import { Job, UserProfile } from '../../types';
import { DataStore } from '../../lib/storage';
import { ApiService } from '../../lib/api';

interface FindJobsProps {
  currentUser: UserProfile;
  initialType?: 'all' | 'full-time' | 'internship';
  onNavigate: (view: string) => void;
}

export const FindJobsPage: React.FC<FindJobsProps> = ({ 
  currentUser, 
  initialType = 'all',
  onNavigate 
}) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'full-time' | 'internship'>(initialType);
  const [workModeFilter, setWorkModeFilter] = useState<string>('all');
  const [savedJobIds, setSavedJobIds] = useState<string[]>([]);
  
  // Detail and Application state
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [applyModalJob, setApplyModalJob] = useState<Job | null>(null);
  const [coverNote, setCoverNote] = useState('');
  const [applying, setApplying] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // AI Match state
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResults, setMatchResults] = useState<Record<string, any>>({});

  useEffect(() => {
    loadJobs();
    if (currentUser.id) {
      setSavedJobIds(DataStore.getSavedJobIds(currentUser.id));
    }
  }, [currentUser]);

  const loadJobs = () => {
    const all = DataStore.getJobs().filter(j => j.status === 'active');
    setJobs(all);
  };

  const handleToggleSave = (jobId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const isSaved = DataStore.toggleSaveJob(currentUser.id, jobId);
    setSavedJobIds(prev => isSaved ? [...prev, jobId] : prev.filter(id => id !== jobId));
  };

  const handleCalculateMatch = async (job: Job, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setMatchLoading(true);
    try {
      const res = await ApiService.computeJobMatch(currentUser, job);
      setMatchResults(prev => ({ ...prev, [job.id]: res }));
    } catch (err) {
      console.error(err);
    } finally {
      setMatchLoading(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyModalJob) return;

    setApplying(true);
    try {
      const matchScore = matchResults[applyModalJob.id]?.overallScore || 85;
      DataStore.applyForJob(applyModalJob.id, currentUser, coverNote, matchScore);
      setApplySuccess(true);
      setTimeout(() => {
        setApplySuccess(false);
        setApplyModalJob(null);
        setCoverNote('');
        loadJobs();
      }, 1500);
    } catch (err) {
      console.error(err);
    } finally {
      setApplying(false);
    }
  };

  // Check if student has already applied
  const userApplications = DataStore.getApplications().filter(a => a.student_id === currentUser.id);
  const isApplied = (jobId: string) => userApplications.some(a => a.job_id === jobId);

  // Filter jobs
  const filteredJobs = jobs.filter(j => {
    if (typeFilter !== 'all' && j.type !== typeFilter) return false;
    if (workModeFilter !== 'all' && j.work_mode !== workModeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = j.title.toLowerCase().includes(q);
      const matchComp = j.company_name.toLowerCase().includes(q);
      const matchSkills = j.required_skills.some(s => s.toLowerCase().includes(q));
      if (!matchTitle && !matchComp && !matchSkills) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Title & Search Bar */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              {typeFilter === 'internship' ? 'Explore Internships' : 'Explore Campus Job Vacancies'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Verified corporate hiring drives with transparent AI qualification analysis.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Current Student CGPA:</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              {currentUser.cgpa !== undefined && currentUser.cgpa !== null ? Number(currentUser.cgpa).toFixed(2) : '0.00'} / 10.0
            </span>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800">
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by job title, company name, or skills (e.g. React, Python)..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <select
              value={typeFilter}
              onChange={e => setTypeFilter(e.target.value as any)}
              className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Employment Types</option>
              <option value="full-time">Full-Time Placement</option>
              <option value="internship">Pre-Placement Internship</option>
            </select>
          </div>

          <div>
            <select
              value={workModeFilter}
              onChange={e => setWorkModeFilter(e.target.value)}
              className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="all">All Work Environments</option>
              <option value="on-site">On-Site</option>
              <option value="hybrid">Hybrid</option>
              <option value="remote">Remote</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Jobs Listing & Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Job Cards List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span>Showing {filteredJobs.length} available opportunities</span>
            <span>Batch: {currentUser.batch_year || 2026}</span>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400">
              <Briefcase className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm font-semibold text-slate-300">No vacancies match your search filter</p>
              <p className="text-xs mt-1">Try broadening your search keywords or resetting filters.</p>
            </div>
          ) : (
            filteredJobs.map(job => {
              const isSelected = selectedJob?.id === job.id;
              const hasApplied = isApplied(job.id);
              const isSaved = savedJobIds.includes(job.id);
              const match = matchResults[job.id];
              const meetsCgpa = (currentUser.cgpa || 8.0) >= job.min_cgpa;

              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJob(job)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer relative ${
                    isSelected
                      ? 'bg-slate-800/90 border-purple-500 shadow-lg shadow-purple-500/10 ring-1 ring-purple-500/50'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      {job.company_logo ? (
                        <img 
                          src={job.company_logo} 
                          alt={job.company_name} 
                          className="w-12 h-12 rounded-xl object-cover shrink-0 border border-slate-700" 
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold text-sm shrink-0">
                          {job.company_name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-white text-base leading-snug">{job.title}</h3>
                        </div>
                        <p className="text-xs text-purple-400 font-semibold">{job.company_name}</p>
                        <div className="flex flex-wrap items-center gap-2 mt-1.5 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-500" />
                            {job.location} ({job.work_mode})
                          </span>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">{job.salary_range}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bookmark */}
                    <button
                      onClick={e => handleToggleSave(job.id, e)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-purple-400 transition"
                      title={isSaved ? 'Remove from saved' : 'Save job'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-purple-400 fill-purple-400/20" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* Skills tags */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {job.required_skills.slice(0, 5).map(skill => (
                      <span 
                        key={skill} 
                        className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-medium border border-slate-700"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.required_skills.length > 5 && (
                      <span className="text-[10px] text-slate-500 self-center">
                        +{job.required_skills.length - 5} more
                      </span>
                    )}
                  </div>

                  {/* Bottom Bar: Eligibility & Match Button */}
                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                        meetsCgpa 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                          : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                      }`}>
                        Min CGPA: {job.min_cgpa} {meetsCgpa ? '✓ Eligible' : '✕ Below Cutoff'}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        Deadline: {job.deadline}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {match ? (
                        <span className="px-2 py-1 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 font-bold text-[11px] flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-purple-400" />
                          {match.overallScore}% AI Fit
                        </span>
                      ) : (
                        <button
                          onClick={e => handleCalculateMatch(job, e)}
                          disabled={matchLoading}
                          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-400 font-medium text-[11px] border border-slate-700 flex items-center gap-1 transition"
                        >
                          <Sparkles className="w-3 h-3" />
                          <span>Check AI Fit</span>
                        </button>
                      )}

                      {hasApplied ? (
                        <span className="px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 font-semibold text-[11px] border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Applied
                        </span>
                      ) : (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedJob(job);
                            setApplyModalJob(job);
                          }}
                          className="px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-[11px] transition"
                        >
                          Apply Now
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Column: Active Job Detail Pane */}
        <div className="lg:col-span-5">
          {selectedJob ? (
            <div className="sticky top-20 p-6 rounded-3xl bg-slate-900 border border-slate-800 text-slate-200 space-y-5">
              
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2 inline-block">
                    {selectedJob.type}
                  </span>
                  <h2 className="text-xl font-bold text-white leading-tight">{selectedJob.title}</h2>
                  <p className="text-sm font-semibold text-purple-400">{selectedJob.company_name}</p>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-emerald-400">{selectedJob.salary_range}</div>
                  <div className="text-xs text-slate-400">{selectedJob.location}</div>
                </div>
              </div>

              {/* AI Fit Section */}
              {matchResults[selectedJob.id] ? (
                <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-purple-300 font-bold flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      AI Match Assessment: {matchResults[selectedJob.id].overallScore}%
                    </span>
                    <span className="text-[10px] text-purple-300 px-2 py-0.5 rounded bg-purple-900/60 font-semibold">
                      {matchResults[selectedJob.id].recommendationVerdict}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {matchResults[selectedJob.id].explanation}
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => handleCalculateMatch(selectedJob)}
                  disabled={matchLoading}
                  className="w-full py-2 px-3 rounded-xl bg-purple-950/40 border border-purple-500/30 hover:bg-purple-950/60 text-purple-300 font-semibold text-xs flex items-center justify-center gap-2 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>Analyze My Fit with Gemini AI</span>
                </button>
              )}

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Job Description</h4>
                <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedJob.description}
                </p>
              </div>

              {/* Eligibility Criteria */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Placement Eligibility</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">Min Academic Cutoff</span>
                    <span className="font-semibold text-white">{selectedJob.min_cgpa} CGPA (No backlogs)</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                    <span className="text-[10px] text-slate-400 block">Graduation Batch</span>
                    <span className="font-semibold text-white">Batch of {selectedJob.batch_year}</span>
                  </div>
                </div>
              </div>

              {/* Required Skills */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Required Competencies</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.required_skills.map(skill => (
                    <span 
                      key={skill}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-200 text-xs font-medium border border-slate-700"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {isApplied(selectedJob.id) ? (
                  <button
                    disabled
                    className="w-full py-3 rounded-xl bg-slate-800 text-slate-400 font-semibold text-xs border border-slate-700 flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Application Submitted & Under Review</span>
                  </button>
                ) : (
                  <button
                    onClick={() => setApplyModalJob(selectedJob)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-indigo-600/25 transition flex items-center justify-center gap-2"
                  >
                    <span>Submit Application for {selectedJob.title}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400">
              <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <h3 className="font-bold text-white text-sm mb-1">Select an opportunity</h3>
              <p className="text-xs">Click on any job or internship card on the left to inspect requirements and calculate your AI match score.</p>
            </div>
          )}
        </div>

      </div>

      {/* Application Modal */}
      {applyModalJob && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100">
            
            <button
              onClick={() => setApplyModalJob(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-4">
              <h3 className="text-lg font-bold text-white">Apply for {applyModalJob.title}</h3>
              <p className="text-xs text-purple-400 font-medium">{applyModalJob.company_name}</p>
            </div>

            {applySuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="font-bold text-base text-white">Application Successfully Submitted!</h4>
                <p className="text-xs text-slate-400">Your profile and resume have been shared with {applyModalJob.company_name}.</p>
              </div>
            ) : (
              <form onSubmit={handleApply} className="space-y-4 text-xs">
                
                {/* Candidate snapshot */}
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Applicant Name:</span>
                    <strong className="text-white">{currentUser.full_name}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Email:</span>
                    <span className="text-slate-300">{currentUser.email}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Academic CGPA:</span>
                    <span className="font-bold text-emerald-400">
                      {currentUser.cgpa !== undefined && currentUser.cgpa !== null ? Number(currentUser.cgpa).toFixed(2) : '0.00'} / 10.0
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-300">
                    <span>Attached Resume:</span>
                    <span className="text-purple-400 font-medium">{currentUser.resume_filename || 'Default_Campus_Resume.pdf'}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Cover Note / Elevator Pitch (Optional)
                  </label>
                  <textarea
                    rows={4}
                    value={coverNote}
                    onChange={e => setCoverNote(e.target.value)}
                    placeholder="Describe relevant projects, internship contributions, and why you are excited for this specific vacancy..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setApplyModalJob(null)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={applying}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-1.5"
                  >
                    {applying ? (
                      <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Confirm & Submit</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
