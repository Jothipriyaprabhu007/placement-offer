import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  GraduationCap, 
  Building2, 
  UserCheck, 
  AlertCircle, 
  CheckCircle,
  Database
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { DataStore } from '../../lib/storage';
import { isSupabaseConfigured, authenticateWithSupabase, registerWithSupabase, fetchStudentProfileSupabase } from '../../lib/supabase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'login' | 'register';
  onAuthSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode,
  onAuthSuccess
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setRole] = useState<'student' | 'recruiter' | 'placement_officer'>('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [branch, setBranch] = useState('Computer Science');
  const [collegeId, setCollegeId] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [designation, setDesignation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const hasSupabase = isSupabaseConfigured();

  const handleDemoSignIn = (userRole: UserRole) => {
    const user = DataStore.switchRole(userRole);
    onAuthSuccess(user);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        let authUserId: string | undefined = undefined;
        if (hasSupabase) {
          const { data, error: sbError } = await authenticateWithSupabase(email, password);
          if (sbError) throw sbError;
          if (data?.user) {
            authUserId = data.user.id;
            const { profile: sbProfile } = await fetchStudentProfileSupabase(data.user.id, data.user.email);
            if (sbProfile) {
              DataStore.saveProfile(sbProfile);
              DataStore.setCurrentUser(sbProfile.id);
              onAuthSuccess(sbProfile);
              onClose();
              return;
            }
          }
        }
        
        // Find or create profile in store
        const profiles = DataStore.getProfiles();
        let matched = profiles.find(p => p.email.toLowerCase() === email.toLowerCase());
        if (!matched) {
          // If user logs in with new credentials, create new student account requiring profile setup
          matched = {
            id: authUserId || `usr-${Date.now()}`,
            auth_user_id: authUserId,
            role: 'student',
            full_name: email.split('@')[0],
            email,
            status: 'active',
            is_profile_completed: false,
            created_at: new Date().toISOString()
          };
          DataStore.saveProfile(matched);
        }
        DataStore.setCurrentUser(matched.id);
        onAuthSuccess(matched);
        onClose();
      } else {
        // Registration
        if (!fullName.trim() || !email.trim() || !password.trim()) {
          throw new Error('Please fill all required fields.');
        }

        let authUserId: string | undefined = undefined;
        if (hasSupabase) {
          const { data: regData, error: sbError } = await registerWithSupabase(email, password, {
            full_name: fullName.trim(),
            role
          });
          if (sbError) throw sbError;
          if (regData?.user) {
            authUserId = regData.user.id;
          }
        }

        const newProfile: UserProfile = {
          id: authUserId || `usr-${Date.now()}`,
          auth_user_id: authUserId,
          role: role,
          full_name: fullName.trim(),
          email: email.trim(),
          status: 'active',
          is_profile_completed: false,
          branch: role === 'student' ? branch : undefined,
          college_id: role === 'student' ? (collegeId.trim() || undefined) : undefined,
          company_name: role === 'recruiter' ? companyName || 'Company' : undefined,
          designation: role === 'recruiter' ? designation || 'Hiring Manager' : undefined,
          created_at: new Date().toISOString()
        };

        DataStore.saveProfile(newProfile);
        DataStore.setCurrentUser(newProfile.id);
        DataStore.addAuditLog('REGISTERED_USER', 'PROFILE', newProfile.id, { role, email });
        onAuthSuccess(newProfile);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-100 animate-in fade-in zoom-in-95">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center mb-3 shadow-lg shadow-indigo-600/30">
            {mode === 'login' ? <LogIn className="w-6 h-6 text-white" /> : <UserPlus className="w-6 h-6 text-white" />}
          </div>
          <h3 className="text-xl font-bold text-white">
            {mode === 'login' ? 'Welcome Back to HireReady AI' : 'Create Your HireReady Account'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login' 
              ? 'Enter your credentials or choose a quick 1-click demo persona' 
              : 'Register to access campus placements and recruiting tools'}
          </p>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
            <Database className="w-3.5 h-3.5 text-purple-400" />
            <span>
              {hasSupabase ? 'Connected to Live Supabase Auth' : 'Running in Local State & Demo Mode'}
            </span>
          </div>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 bg-slate-800/80 rounded-xl mb-5 text-xs font-semibold">
          <button
            onClick={() => { setMode('login'); setError(null); }}
            className={`py-2 rounded-lg transition ${mode === 'login' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setError(null); }}
            className={`py-2 rounded-lg transition ${mode === 'register' ? 'bg-purple-600 text-white shadow' : 'text-slate-400 hover:text-white'}`}
          >
            Register
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* 1-Click Instant Demo Persona Buttons */}
        <div className="mb-5 p-3 rounded-xl bg-slate-800/40 border border-slate-800">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Instant 1-Click Demo Login:
          </p>
          <div className="grid grid-cols-2 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => handleDemoSignIn('student')}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20 text-left flex items-center gap-1.5 transition"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignIn('recruiter')}
              className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 text-left flex items-center gap-1.5 transition"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Recruiter</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignIn('placement_officer')}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 text-left flex items-center gap-1.5 transition"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Placement Officer</span>
            </button>
            <button
              type="button"
              onClick={() => handleDemoSignIn('admin')}
              className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 hover:bg-purple-500/20 text-left flex items-center gap-1.5 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Administrator</span>
            </button>
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          
          {mode === 'register' && (
            <>
              {/* Role Selection (Excludes Admin for security!) */}
              <div>
                <label className="block text-slate-300 font-medium mb-1">Select Role</label>
                <div className="grid grid-cols-3 gap-1.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`py-2 px-1 rounded-lg border text-center transition font-medium ${
                      role === 'student' ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('recruiter')}
                    className={`py-2 px-1 rounded-lg border text-center transition font-medium ${
                      role === 'recruiter' ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Recruiter
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('placement_officer')}
                    className={`py-2 px-1 rounded-lg border text-center transition font-medium ${
                      role === 'placement_officer' ? 'bg-purple-600 text-white border-purple-500' : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                  >
                    Placement Off.
                  </button>
                </div>
                <p className="text-[10px] text-slate-300 mt-1">
                  * Note: Administrator privileges are securely server-managed only.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                />
              </div>

              {role === 'student' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Branch</label>
                    <select
                      value={branch}
                      onChange={e => setBranch(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500 text-xs"
                    >
                      <option value="Computer Science">Computer Science</option>
                      <option value="Information Technology">Information Technology</option>
                      <option value="Electronics & Communication">ECE</option>
                      <option value="Electrical & Electronics">EEE</option>
                      <option value="Mechanical Engineering">Mechanical</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">College Roll / ID</label>
                    <input
                      type="text"
                      value={collegeId}
                      onChange={e => setCollegeId(e.target.value)}
                      placeholder="e.g. 2022CS089"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

              {role === 'recruiter' && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. TechNova Inc."
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-300 font-medium mb-1">Designation</label>
                    <input
                      type="text"
                      value={designation}
                      onChange={e => setDesignation(e.target.value)}
                      placeholder="e.g. Senior Tech Recruiter"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-slate-300 font-medium mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Dashboard</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Complete Registration</span>
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
