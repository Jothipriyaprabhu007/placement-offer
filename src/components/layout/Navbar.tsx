import React, { useState, useEffect } from 'react';
import { 
  Briefcase, 
  Sparkles, 
  Bell, 
  User, 
  ChevronDown, 
  LogIn, 
  LogOut, 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  UserCheck, 
  Menu, 
  X,
  ExternalLink
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { DataStore } from '../../lib/storage';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  currentUser: UserProfile;
  onSwitchUser: (user: UserProfile) => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onToggleNotifications: () => void;
  unreadCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  currentUser,
  onSwitchUser,
  onOpenAuth,
  onToggleNotifications,
  unreadCount
}) => {
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const profiles = DataStore.getProfiles();

  const roleBadgeConfig: Record<UserRole, { label: string; color: string; icon: any }> = {
    student: { label: 'Student', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: GraduationCap },
    recruiter: { label: 'Recruiter', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', icon: Building2 },
    placement_officer: { label: 'TPO Officer', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: UserCheck },
    admin: { label: 'Administrator', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30', icon: ShieldCheck }
  };

  const currentRoleInfo = roleBadgeConfig[currentUser.role];
  const CurrentRoleIcon = currentRoleInfo.icon;

  const publicNavItems = [
    { id: 'home', label: 'Home' },
    { id: 'find-jobs', label: 'Find Jobs' },
    { id: 'internships', label: 'Internships' },
    { id: 'ai-assistant', label: 'AI Career Assistant', highlight: true },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' }
  ];

  const getDashboardId = (role: UserRole) => {
    switch (role) {
      case 'student': return DataStore.isStudentProfileComplete(currentUser) ? 'student-dashboard' : 'student-profile-setup';
      case 'recruiter': return 'recruiter-dashboard';
      case 'placement_officer': return 'tpo-dashboard';
      case 'admin': return 'admin-dashboard';
    }
  };

  const handleRoleSelect = (targetRole: UserRole) => {
    const updated = DataStore.switchRole(targetRole);
    onSwitchUser(updated);
    setRoleMenuOpen(false);
    if (targetRole === 'student') {
      if (DataStore.isStudentProfileComplete(updated)) {
        onNavigate('student-dashboard');
      } else {
        onNavigate('student-profile-setup');
      }
    } else {
      onNavigate(getDashboardId(targetRole));
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => onNavigate('home')} 
              className="flex items-center gap-2.5 text-left group transition"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-blue-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 font-bold tracking-tight text-lg text-white">
                  <span>HireReady</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-300 font-extrabold text-sm px-1.5 py-0.5 rounded bg-purple-950/60 border border-purple-500/30">
                    AI
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium leading-none hidden sm:block">
                  Campus Placement & Job Intelligence
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Public Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            {publicNavItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                    isActive 
                      ? 'text-white bg-slate-800 font-semibold' 
                      : item.highlight
                      ? 'text-purple-300 hover:text-purple-200 hover:bg-purple-950/40 font-medium'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {item.highlight && <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />}
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Action Center: Role Switcher, Notifications & Auth */}
          <div className="flex items-center gap-2.5">
            
            {/* Quick Demo Role Switcher */}
            <div className="relative">
              <button
                onClick={() => setRoleMenuOpen(!roleMenuOpen)}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition ${currentRoleInfo.color} hover:bg-slate-800`}
                title="Switch demo persona to test each role view"
              >
                <CurrentRoleIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Role:</span>
                <span className="font-semibold">{currentRoleInfo.label}</span>
                <ChevronDown className="w-3 h-3 opacity-70" />
              </button>

              {roleMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2"
                  onMouseLeave={() => setRoleMenuOpen(false)}
                >
                  <div className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 mb-1">
                    Instant Demo Role Switcher
                  </div>
                  
                  <button
                    onClick={() => handleRoleSelect('student')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-left transition ${
                      currentUser.role === 'student' ? 'bg-emerald-500/15 text-emerald-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-emerald-400" />
                    <div>
                      <div className="font-medium">Student {currentUser.role === 'student' && currentUser.full_name ? `(${currentUser.full_name})` : '(Candidate Profile)'}</div>
                      <div className="text-[10px] text-slate-400">Apply, AI resume scan, mock interview</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('recruiter')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-left transition ${
                      currentUser.role === 'recruiter' ? 'bg-indigo-500/15 text-indigo-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-indigo-400" />
                    <div>
                      <div className="font-medium">Recruiter (Vikramaditya Roy)</div>
                      <div className="text-[10px] text-slate-400">Post jobs, review candidates, extend offers</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('placement_officer')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-left transition ${
                      currentUser.role === 'placement_officer' ? 'bg-amber-500/15 text-amber-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-amber-400" />
                    <div>
                      <div className="font-medium">Placement Officer (TPO)</div>
                      <div className="text-[10px] text-slate-400">Manage campus drives, export reports</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleRoleSelect('admin')}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs rounded-lg text-left transition ${
                      currentUser.role === 'admin' ? 'bg-purple-500/15 text-purple-300 font-semibold' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-400" />
                    <div>
                      <div className="font-medium">Administrator (Super Admin)</div>
                      <div className="text-[10px] text-slate-400">Moderation, audit logs, verifications</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Notifications Button */}
            <button
              onClick={onToggleNotifications}
              className="relative p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-purple-500 text-[10px] font-bold text-white rounded-full flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Dashboard Shortcut */}
            <button
              onClick={() => onNavigate(getDashboardId(currentUser.role))}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-md shadow-indigo-600/20 transition"
            >
              <span>Dashboard</span>
              <ExternalLink className="w-3 h-3" />
            </button>

            {/* User Profile Avatar / Sign In */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1 rounded-full border border-slate-700 hover:border-slate-500 transition"
              >
                {currentUser.avatar_url ? (
                  <img 
                    src={currentUser.avatar_url} 
                    alt={currentUser.full_name} 
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-purple-600/20 text-purple-300 flex items-center justify-center text-xs font-semibold">
                    {(currentUser.full_name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </button>

              {userMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-xs"
                  onMouseLeave={() => setUserMenuOpen(false)}
                >
                  <div className="px-3 py-2 border-b border-slate-800">
                    <p className="font-semibold text-white truncate">{currentUser.full_name || 'Student (Setup Required)'}</p>
                    <p className="text-slate-400 text-[11px] truncate">{currentUser.email || 'Email Pending'}</p>
                    <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                      Role: {currentUser.role.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onNavigate(getDashboardId(currentUser.role));
                      }}
                      className="w-full text-left px-3 py-1.5 rounded hover:bg-slate-800 text-slate-200"
                    >
                      Open My Portal Dashboard
                    </button>
                    {currentUser.role === 'student' && (
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          onNavigate('student-profile');
                        }}
                        className="w-full text-left px-3 py-1.5 rounded hover:bg-slate-800 text-slate-200"
                      >
                        Edit Student Profile & Resume
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        onOpenAuth('login');
                      }}
                      className="w-full text-left px-3 py-1.5 rounded hover:bg-slate-800 text-slate-200 flex items-center gap-1.5"
                    >
                      <LogIn className="w-3.5 h-3.5 text-purple-400" />
                      Sign In to Another Account
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900/95 px-4 pt-2 pb-4 space-y-1">
          {publicNavItems.map(item => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-between"
            >
              <span>{item.label}</span>
              {item.highlight && <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
            </button>
          ))}
          <div className="pt-2 border-t border-slate-800">
            <button
              onClick={() => {
                onNavigate(getDashboardId(currentUser.role));
                setMobileMenuOpen(false);
              }}
              className="w-full text-center py-2 px-3 rounded-lg bg-indigo-600 text-white font-semibold text-sm"
            >
              Go to {currentRoleInfo.label} Dashboard
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
