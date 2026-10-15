import React from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  FileText, 
  Sparkles, 
  MessageSquare, 
  Calendar, 
  Award, 
  User, 
  Building2, 
  PlusCircle, 
  Users, 
  FileCheck, 
  BarChart3, 
  ShieldCheck, 
  AlertTriangle, 
  Bookmark, 
  GraduationCap, 
  Clock, 
  Compass, 
  Settings,
  BellRing
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentUser: UserProfile;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  currentUser
}) => {
  const getNavSections = () => {
    switch (currentUser.role) {
      case 'student':
        return [
          {
            title: 'Placement Center',
            items: [
              { id: 'student-dashboard', label: 'Overview', icon: LayoutDashboard },
              { id: 'find-jobs', label: 'Explore Vacancies', icon: Briefcase },
              { id: 'student-applications', label: 'My Applications', icon: FileCheck },
              { id: 'student-saved-jobs', label: 'Saved Jobs', icon: Bookmark },
              { id: 'student-drives', label: 'Placement Drives', icon: Calendar },
              { id: 'student-offers', label: 'Job Offers', icon: Award }
            ]
          },
          {
            title: 'AI Career Suite',
            items: [
              { id: 'student-resume-analyzer', label: 'AI Resume Analyzer', icon: FileText, badge: 'ATS Pro' },
              { id: 'student-mock-interview', label: 'AI Mock Interview', icon: Sparkles, badge: 'STAR' },
              { id: 'student-skill-gap', label: 'Skill Gap & Roadmap', icon: Compass },
              { id: 'ai-assistant', label: 'AI Career Advisor', icon: MessageSquare }
            ]
          },
          {
            title: 'Account',
            items: [
              { id: 'student-profile', label: 'My Profile & Academics', icon: User }
            ]
          }
        ];

      case 'recruiter':
        return [
          {
            title: 'Talent Acquisition',
            items: [
              { id: 'recruiter-dashboard', label: 'Recruitment Hub', icon: LayoutDashboard },
              { id: 'recruiter-post-job', label: 'Post New Vacancy', icon: PlusCircle },
              { id: 'recruiter-manage-jobs', label: 'Active Job Listings', icon: Briefcase },
              { id: 'recruiter-applicants', label: 'Applicants Pipeline', icon: Users, badge: 'Live' },
              { id: 'recruiter-interviews', label: 'Interview Schedules', icon: Calendar },
              { id: 'recruiter-offers', label: 'Manage Offers', icon: Award }
            ]
          },
          {
            title: 'Organization',
            items: [
              { id: 'recruiter-company', label: 'Company Profile', icon: Building2 }
            ]
          }
        ];

      case 'placement_officer':
        return [
          {
            title: 'Placement Cell',
            items: [
              { id: 'tpo-dashboard', label: 'Executive Overview', icon: LayoutDashboard },
              { id: 'tpo-directory', label: 'Student Directory', icon: GraduationCap },
              { id: 'tpo-drives', label: 'Campus Drives & Visits', icon: Calendar },
              { id: 'tpo-reports', label: 'Reports & CSV Export', icon: BarChart3 },
              { id: 'tpo-announcements', label: 'Campus Announcements', icon: BellRing }
            ]
          }
        ];

      case 'admin':
        return [
          {
            title: 'Platform Administration',
            items: [
              { id: 'admin-dashboard', label: 'System Overview', icon: LayoutDashboard },
              { id: 'admin-jobs', label: 'Job Moderation', icon: Briefcase },
              { id: 'admin-students', label: 'Student Accounts', icon: GraduationCap },
              { id: 'admin-recruiters', label: 'Company Verification', icon: ShieldCheck, badge: 'Verif' },
              { id: 'admin-skills', label: 'Skills & Taxonomy', icon: Compass },
              { id: 'admin-announcements', label: 'Announcements', icon: BellRing },
              { id: 'admin-audit', label: 'Security Audit Logs', icon: Clock }
            ]
          }
        ];
    }
  };

  const sections = getNavSections();

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-4rem)]">
      {/* Current Persona Badge Banner */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/40">
        <div className="flex items-center gap-3">
          {currentUser.avatar_url ? (
            <img 
              src={currentUser.avatar_url} 
              alt={currentUser.full_name} 
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-purple-500/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 font-bold flex items-center justify-center">
              {(currentUser.full_name || 'U').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="overflow-hidden">
            <h4 className="text-xs font-semibold text-white truncate">{currentUser.full_name || 'New Student'}</h4>
            <p className="text-[11px] text-purple-400 font-medium capitalize">
              {currentUser.role.replace('_', ' ')}
            </p>
            {currentUser.branch && (
              <p className="text-[10px] text-slate-400 truncate">{currentUser.branch}</p>
            )}
            {currentUser.company_name && (
              <p className="text-[10px] text-slate-400 truncate">{currentUser.company_name}</p>
            )}
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-1">
            <h5 className="px-3 text-[10px] font-bold text-slate-300 uppercase tracking-wider mb-2">
              {section.title}
            </h5>
            {section.items.map(item => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-xs rounded-xl font-medium transition-all group ${
                    isActive 
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-purple-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isActive ? 'bg-white/20 text-white' : 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Database & System info footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/60 text-[10px] text-slate-300 space-y-1">
        <div className="flex items-center justify-between text-slate-200">
          <span className="font-semibold">HireReady Core</span>
          <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Operational
          </span>
        </div>
        <p className="text-slate-400">PostgreSQL Schema & Gemini 3.8 Flash</p>
      </div>
    </aside>
  );
};
