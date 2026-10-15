import React from 'react';
import { 
  Briefcase, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Calendar, 
  Cpu, 
  Award, 
  Building2, 
  GraduationCap, 
  Check, 
  Compass, 
  ExternalLink 
} from 'lucide-react';
import { DataStore } from '../../lib/storage';

interface LandingPageProps {
  onNavigate: (view: string) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate, onOpenAuth }) => {
  const jobs = DataStore.getJobs().slice(0, 3);
  const drives = DataStore.getPlacementDrives().slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Background gradient orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-purple-600/20 via-indigo-600/20 to-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-6 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Next-Gen Campus Placement & AI Job Matching Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Launch Your Career with{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-blue-400">
              HireReady AI
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            A centralized career intelligence ecosystem bridging students, recruiters, and college placement officers. Featuring ATS resume scoring, STAR mock interviews, and automated skill-gap learning roadmaps.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => onNavigate('find-jobs')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/25 transition-all flex items-center gap-2 group cursor-pointer"
            >
              <span>Explore Vacancies</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={() => onNavigate('student-resume-analyzer')}
              className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500 text-slate-200 font-semibold text-sm transition-all flex items-center gap-2 hover:bg-slate-800 cursor-pointer"
            >
              <FileText className="w-4 h-4 text-purple-400" />
              <span>AI Resume Analyzer</span>
            </button>

            <button
              onClick={() => onNavigate('recruiter-dashboard')}
              className="px-6 py-3.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-indigo-500 text-slate-200 font-semibold text-sm transition-all flex items-center gap-2 hover:bg-slate-800 cursor-pointer"
            >
              <Building2 className="w-4 h-4 text-indigo-400" />
              <span>Recruiter Portal</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">94.6%</div>
              <p className="text-xs text-slate-400 mt-1">Placement Success Rate</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">₹20.0 LPA</div>
              <p className="text-xs text-slate-400 mt-1">Highest Package</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">120+</div>
              <p className="text-xs text-slate-400 mt-1">Verified Hiring Partners</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-white">4.8 / 5</div>
              <p className="text-xs text-slate-400 mt-1">Student Satisfaction</p>
            </div>
          </div>

        </div>
      </section>

      {/* 4 Pillars Section */}
      <section className="py-16 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">
              Integrated Campus Architecture
            </h2>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">
              Designed for All Placement Stakeholders
            </h3>
            <p className="text-slate-400 text-xs sm:text-sm mt-2">
              Eliminate recruitment silos with dedicated role portals and automated eligibility verification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Student */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Students</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Personalized job matches, ATS resume audits, technical mock interviews, and one-click applications.
              </p>
              <button 
                onClick={() => onNavigate('student-dashboard')}
                className="text-xs font-semibold text-emerald-400 flex items-center gap-1 hover:text-emerald-300"
              >
                <span>Enter Student Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Recruiter */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Building2 className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Recruiters</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Publish criteria-backed vacancies, filter by verified CGPA and skills, run recruitment stages, and issue offers.
              </p>
              <button 
                onClick={() => onNavigate('recruiter-dashboard')}
                className="text-xs font-semibold text-indigo-400 flex items-center gap-1 hover:text-indigo-300"
              >
                <span>Enter Recruiter Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Placement Officer */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Placement Officers</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Coordinate campus drives, monitor placement rates, notify eligible student cohorts, and export CSV reports.
              </p>
              <button 
                onClick={() => onNavigate('tpo-dashboard')}
                className="text-xs font-semibold text-amber-400 flex items-center gap-1 hover:text-amber-300"
              >
                <span>Enter TPO Hub</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Administrator */}
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 hover:border-purple-500/40 transition group">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white mb-2">Administrators</h4>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                Server-verified security privilege, job posting moderation, employer credential verification, and audit logs.
              </p>
              <button 
                onClick={() => onNavigate('admin-dashboard')}
                className="text-xs font-semibold text-purple-400 flex items-center gap-1 hover:text-purple-300"
              >
                <span>Enter Admin Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* AI Features Showcase */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-900/40 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Gemini 3.8 Flash AI Engine</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white tracking-tight leading-snug">
              Transparent, Actionable Career Intelligence
            </h2>
            <p className="mt-4 text-slate-300 text-sm leading-relaxed">
              Our AI never hallucinates fake vacancies or promises guaranteed jobs. It provides mathematically grounded skill-match percentages, actionable ATS feedback, and realistic interview simulations.
            </p>

            <div className="mt-6 space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white block">Objective Skill Gap Breakdown</strong>
                  <span className="text-slate-400">Compares actual student competencies with target enterprise job listings to construct 4-week step-by-step milestones.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white block">STAR-Method Mock Interviews</strong>
                  <span className="text-slate-400">Evaluates answers on Situation, Task, Action, and Result with concrete exemplary answer models.</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3.5 h-3.5" />
                </div>
                <div>
                  <strong className="text-white block">ATS Bullet Point Transformer</strong>
                  <span className="text-slate-400">Rewrites passive resume bullet points into high-impact, quantifiable technical accomplishments.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button
                onClick={() => onNavigate('student-mock-interview')}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition"
              >
                Try Mock Interview
              </button>
              <button
                onClick={() => onNavigate('ai-assistant')}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition"
              >
                Open Career Advisor
              </button>
            </div>
          </div>

          {/* Interactive Mock Preview Card */}
          <div className="bg-gradient-to-tr from-slate-900 via-slate-800/90 to-purple-950/40 p-6 rounded-3xl border border-slate-700/80 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                <span className="text-xs text-slate-400 ml-2 font-mono">hireready-ai://match-engine</span>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                92% Fit Score
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60">
                <p className="text-slate-400 text-[11px] mb-1">Target Role: Associate Software Engineer</p>
                <p className="font-semibold text-white">TechNova Solutions (₹10 - ₹14 LPA)</p>
              </div>

              <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-purple-300 font-medium">Verified Matching Skills:</span>
                  <span className="text-purple-400 font-bold">5 / 6</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Git'].map(s => (
                    <span key={s} className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-200 text-[10px] font-medium border border-purple-500/30">
                      ✓ {s}
                    </span>
                  ))}
                  <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 text-[10px] font-medium border border-rose-500/30">
                    ✕ Docker (Recommended)
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 text-[11px] leading-relaxed">
                <span className="text-amber-400 font-semibold block mb-0.5">AI Placement Assessment:</span>
                Candidate academic credentials comfortably pass the criteria cutoff. Verified technical competencies and projects directly align with TechNova's microservices stack.
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 bg-slate-900/40 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Active Campus Vacancies</h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-1">Verified opportunities currently accepting graduating students.</p>
            </div>
            <button
              onClick={() => onNavigate('find-jobs')}
              className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View all openings</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {jobs.map(job => (
              <div 
                key={job.id} 
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {job.type}
                    </span>
                    <span className="text-xs text-slate-400">{job.location}</span>
                  </div>
                  <h3 className="font-bold text-white text-sm mb-1">{job.title}</h3>
                  <p className="text-xs text-purple-400 font-medium mb-3">{job.company_name}</p>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-4">
                    {job.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Package</span>
                    <span className="font-bold text-emerald-400">{job.salary_range}</span>
                  </div>
                  <button
                    onClick={() => onNavigate('find-jobs')}
                    className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 font-semibold text-xs border border-purple-500/30 transition"
                  >
                    View & Apply
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Upcoming Placement Drives */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="text-2xl font-bold text-white">Upcoming Campus Drives</h2>
          <p className="text-slate-400 text-xs mt-1">Official college recruitment schedules organized by the TPO cell.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {drives.map(drive => (
            <div key={drive.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 font-medium border border-amber-500/30 text-[10px]">
                    Drive Date: {drive.drive_date}
                  </span>
                  <span className="text-[10px] text-slate-400">Min CGPA: {drive.min_cgpa}</span>
                </div>
                <h3 className="font-bold text-white text-sm mb-1">{drive.title}</h3>
                <p className="text-xs text-slate-400 line-clamp-2 mb-3">{drive.description}</p>
                <div className="text-xs text-purple-400 font-semibold mb-2">
                  Package: {drive.package_ctc}
                </div>
              </div>
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[11px]">{drive.registered_students_count} registered</span>
                <button
                  onClick={() => onNavigate('student-drives')}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition"
                >
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 bg-gradient-to-r from-purple-900/60 via-indigo-900/40 to-slate-900 border-t border-slate-800">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <h2 className="text-3xl font-extrabold text-white">Ready for Placement Season?</h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Verify your academic profile, run our ATS analyzer, and practice role-tailored technical interviews today.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={() => onOpenAuth('register')}
              className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm shadow-xl shadow-purple-600/30 transition"
            >
              Get Started for Free
            </button>
            <button
              onClick={() => onNavigate('ai-assistant')}
              className="px-6 py-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 font-semibold text-sm hover:bg-slate-800 transition"
            >
              Ask AI Career Advisor
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
