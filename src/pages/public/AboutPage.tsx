import React from 'react';
import { ShieldCheck, Award, GraduationCap, Building2, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-slate-200 space-y-10">
      
      <div className="text-center space-y-3">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          About HireReady AI
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl mx-auto">
          Intelligent Job Matching & Student Placement Management System bridging universities and corporate hiring teams.
        </p>
      </div>

      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs leading-relaxed">
        <h2 className="text-lg font-bold text-white">Our Mission</h2>
        <p>
          University campus placements have historically suffered from disconnected spreadsheets, manual resume screening, and opaque shortlisting criteria. Students often lack objective insight into why they were rejected or what skills they need to acquire to land their dream job.
        </p>
        <p>
          HireReady AI unifies the entire placement ecosystem into an equitable, automated platform. Using PostgreSQL relational architecture with Row Level Security and Gemini 3.8 Flash, every student receives mathematically grounded skill gap roadmaps, authentic mock interview practice, and transparent fit scoring.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">Security & Privacy First</h3>
          <p className="text-slate-400">
            Row Level Security (RLS) ensures students access only their authorized records, and recruiters manage only their verified vacancies.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">No Hallucinations</h3>
          <p className="text-slate-400">
            AI recommendations reflect actual stored vacancies and verified student resumes, never inventing fake credentials.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-white text-sm">Empowering Colleges</h3>
          <p className="text-slate-400">
            Automates student notifications for qualifying drives, monitors placement rates, and exports verified institutional reports to CSV.
          </p>
        </div>
      </div>

    </div>
  );
};
