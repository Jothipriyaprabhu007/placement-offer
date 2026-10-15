import React from 'react';
import { Briefcase, Shield, Cpu, Github, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-white font-bold text-base">HireReady AI</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Intelligent Job Matching & Student Placement Management System bridging university talent, enterprise recruiters, and campus career cells.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-purple-400">
              <Cpu className="w-3.5 h-3.5" />
              <span>Powered by Gemini 3.8 Flash & Supabase PostgreSQL</span>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Candidate Suite</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('find-jobs')} className="hover:text-white transition">Explore Vacancies</button></li>
              <li><button onClick={() => onNavigate('internships')} className="hover:text-white transition">Campus Internships</button></li>
              <li><button onClick={() => onNavigate('ai-assistant')} className="hover:text-white transition">AI Career Advisor</button></li>
              <li><button onClick={() => onNavigate('student-resume-analyzer')} className="hover:text-white transition">ATS Resume Analyzer</button></li>
              <li><button onClick={() => onNavigate('student-mock-interview')} className="hover:text-white transition">Technical Mock Interview</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Placement & Enterprise</h4>
            <ul className="space-y-2">
              <li><button onClick={() => onNavigate('recruiter-dashboard')} className="hover:text-white transition">Recruiter Talent Hub</button></li>
              <li><button onClick={() => onNavigate('tpo-dashboard')} className="hover:text-white transition">College Placement Cell</button></li>
              <li><button onClick={() => onNavigate('admin-dashboard')} className="hover:text-white transition">Admin Security Dashboard</button></li>
              <li><button onClick={() => onNavigate('about')} className="hover:text-white transition">Placement Policy</button></li>
              <li><button onClick={() => onNavigate('contact')} className="hover:text-white transition">Support & Grievances</button></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Enterprise Security</h4>
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <Shield className="w-3.5 h-3.5" />
                <span>Row Level Security (RLS) Active</span>
              </div>
              <p className="text-slate-400">
                Data segregation enforced at the database layer. Student resumes are strictly isolated and authorized.
              </p>
            </div>
            <p className="text-[10px] text-slate-400">
              © {new Date().getFullYear()} HireReady AI Systems. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
};
