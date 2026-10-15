import React, { useState } from 'react';
import { 
  GraduationCap, 
  User, 
  Mail, 
  Phone, 
  Building2, 
  BookOpen, 
  Calendar, 
  Award, 
  Upload, 
  FileText, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Database, 
  Sparkles, 
  ExternalLink,
  Code2,
  FolderGit2
} from 'lucide-react';
import { UserProfile, StudentProject, StudentCertification } from '../../types';
import { DataStore } from '../../lib/storage';
import { isSupabaseConfigured, saveStudentProfileSupabase, saveSupabaseCredentials, getSupabaseCredentials } from '../../lib/supabase';

interface StudentProfileSetupProps {
  currentUser: UserProfile;
  onProfileSaved: (updatedUser: UserProfile) => void;
  onNavigateToDashboard?: () => void;
  isEditing?: boolean;
}

export const StudentProfileSetup: React.FC<StudentProfileSetupProps> = ({
  currentUser,
  onProfileSaved,
  onNavigateToDashboard,
  isEditing = false
}) => {
  // Personal Details
  const [fullName, setFullName] = useState(currentUser.full_name || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');

  // Academic Credentials
  const [studentId, setStudentId] = useState(currentUser.student_id || currentUser.college_id || '');
  const [collegeName, setCollegeName] = useState(currentUser.college_name || '');
  const [department, setDepartment] = useState(currentUser.department || currentUser.branch || '');
  const [degreeAndYear, setDegreeAndYear] = useState(currentUser.degree_and_year || '');
  const [graduationYear, setGraduationYear] = useState<number | string>(currentUser.graduation_year || currentUser.batch_year || '');
  const [cgpa, setCgpa] = useState<number | string>(currentUser.cgpa !== undefined ? currentUser.cgpa : '');

  // Technical Competencies
  const [technicalSkills, setTechnicalSkills] = useState<string[]>(
    currentUser.technical_skills || currentUser.skills || []
  );
  const [skillInput, setSkillInput] = useState('');

  const [programmingLanguages, setProgrammingLanguages] = useState<string[]>(
    currentUser.programming_languages || []
  );
  const [langInput, setLangInput] = useState('');

  // Projects
  const [projects, setProjects] = useState<StudentProject[]>(currentUser.projects || []);
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectTech, setNewProjectTech] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  const [newProjectLink, setNewProjectLink] = useState('');
  const [showAddProject, setShowAddProject] = useState(false);

  // Certifications
  const [certifications, setCertifications] = useState<StudentCertification[]>(currentUser.certifications || []);
  const [newCertTitle, setNewCertTitle] = useState('');
  const [newCertIssuer, setNewCertIssuer] = useState('');
  const [newCertYear, setNewCertYear] = useState('');
  const [showAddCert, setShowAddCert] = useState(false);

  // Resume Upload
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFilename, setResumeFilename] = useState(currentUser.resume_filename || '');
  const [resumeText, setResumeText] = useState(currentUser.resume_text || '');

  // Validation & UI State
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  
  // Supabase Configuration Helper Modal
  const [showSupabaseConfig, setShowSupabaseConfig] = useState(false);
  const [configUrl, setConfigUrl] = useState(getSupabaseCredentials().url);
  const [configKey, setConfigKey] = useState(getSupabaseCredentials().key);

  const supabaseActive = isSupabaseConfigured();

  // Field validation
  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!fullName.trim()) {
      errs.fullName = 'Full Name is required.';
    }

    if (!studentId.trim()) {
      errs.studentId = 'Student ID / Register Number is required.';
    }

    if (!collegeName.trim()) {
      errs.collegeName = 'College Name is required.';
    }

    if (!department.trim()) {
      errs.department = 'Department / Branch is required.';
    }

    if (!degreeAndYear.trim()) {
      errs.degreeAndYear = 'Degree & Year of Study is required.';
    }

    if (!graduationYear || Number(graduationYear) < 2000 || Number(graduationYear) > 2035) {
      errs.graduationYear = 'Valid graduation year is required (e.g. 2026).';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      errs.email = 'Please provide a valid email address.';
    }

    // Phone validation
    const phoneClean = phone.replace(/[^0-9]/g, '');
    if (!phone.trim() || phoneClean.length < 10) {
      errs.phone = 'Valid 10-digit phone number is required.';
    }

    // CGPA validation
    const numCgpa = Number(cgpa);
    if (cgpa === '' || isNaN(numCgpa) || numCgpa < 0 || numCgpa > 10) {
      errs.cgpa = 'CGPA must be a valid number between 0.00 and 10.00.';
    }

    if (technicalSkills.length === 0) {
      errs.technicalSkills = 'Please add at least one technical skill.';
    }

    if (!resumeFile && !resumeFilename) {
      errs.resume = 'Please upload your official resume (PDF or Word format).';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Skill Handlers
  const handleAddSkill = () => {
    if (skillInput.trim() && !technicalSkills.includes(skillInput.trim())) {
      setTechnicalSkills([...technicalSkills, skillInput.trim()]);
      setSkillInput('');
      setErrors(prev => ({ ...prev, technicalSkills: '' }));
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setTechnicalSkills(technicalSkills.filter(s => s !== skill));
  };

  // Programming Language Handlers
  const handleAddLang = () => {
    if (langInput.trim() && !programmingLanguages.includes(langInput.trim())) {
      setProgrammingLanguages([...programmingLanguages, langInput.trim()]);
      setLangInput('');
    }
  };

  const handleRemoveLang = (lang: string) => {
    setProgrammingLanguages(programmingLanguages.filter(l => l !== lang));
  };

  // Project Handlers
  const handleAddProject = () => {
    if (!newProjectTitle.trim() || !newProjectDesc.trim()) {
      alert('Please provide project title and description.');
      return;
    }
    const newProj: StudentProject = {
      id: `proj-${Date.now()}`,
      title: newProjectTitle.trim(),
      tech_stack: newProjectTech.trim() || 'Software Tech',
      description: newProjectDesc.trim(),
      link: newProjectLink.trim()
    };
    setProjects([...projects, newProj]);
    setNewProjectTitle('');
    setNewProjectTech('');
    setNewProjectDesc('');
    setNewProjectLink('');
    setShowAddProject(false);
  };

  const handleRemoveProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  // Certification Handlers
  const handleAddCert = () => {
    if (!newCertTitle.trim()) {
      alert('Please provide certification title.');
      return;
    }
    const newCert: StudentCertification = {
      id: `cert-${Date.now()}`,
      title: newCertTitle.trim(),
      issuer: newCertIssuer.trim() || 'Accredited Issuer',
      year: newCertYear.trim() || new Date().getFullYear().toString()
    };
    setCertifications([...certifications, newCert]);
    setNewCertTitle('');
    setNewCertIssuer('');
    setNewCertYear('');
    setShowAddCert(false);
  };

  const handleRemoveCert = (id: string) => {
    setCertifications(certifications.filter(c => c.id !== id));
  };

  // File Upload Handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit. Please upload a smaller document.');
      return;
    }

    const validExtensions = ['pdf', 'doc', 'docx', 'txt'];
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    if (!fileExt || !validExtensions.includes(fileExt)) {
      alert('Invalid format. Please upload a .pdf, .doc, or .docx file.');
      return;
    }

    setResumeFile(file);
    setResumeFilename(file.name);
    setErrors(prev => ({ ...prev, resume: '' }));

    // Read text for local preview and AI analysis
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setResumeText(text.slice(0, 10000));
      }
    };
    reader.readAsText(file);
  };

  // Save Profile Submission
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSaving(true);
    setStatusMessage(null);

    const updatedProfile: UserProfile = {
      ...currentUser,
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      student_id: studentId.trim(),
      college_id: studentId.trim(),
      college_name: collegeName.trim(),
      department: department.trim(),
      branch: department.trim(),
      degree_and_year: degreeAndYear.trim(),
      graduation_year: Number(graduationYear),
      batch_year: Number(graduationYear),
      cgpa: Number(cgpa),
      technical_skills: technicalSkills,
      skills: technicalSkills,
      programming_languages: programmingLanguages,
      projects,
      certifications,
      resume_filename: resumeFilename || resumeFile?.name || 'Student_Resume.pdf',
      resume_text: resumeText || `${fullName} - ${department} Student, ${collegeName}. CGPA: ${cgpa}. Skills: ${technicalSkills.join(', ')}.`,
      is_profile_completed: true,
      updated_at: new Date().toISOString()
    };

    try {
      if (supabaseActive) {
        setStatusMessage('Saving student profile and uploading resume to Supabase PostgreSQL database...');
        const { profile: sbProfile, error: sbError } = await saveStudentProfileSupabase(updatedProfile, resumeFile || undefined);
        if (sbError) {
          console.warn('Supabase save error:', sbError);
          setStatusMessage(`⚠️ Supabase Sync Warning: ${sbError.message}. Changes saved to local session only.`);
        } else if (sbProfile) {
          updatedProfile.resume_url = sbProfile.resume_url;
          setStatusMessage('✅ Profile and resume successfully persisted to Supabase database.');
        }
      } else {
        setStatusMessage('⚠️ Supabase is not configured. Profile saved to temporary browser storage only. To enable cloud database persistence and resume storage with Row Level Security, configure your Supabase credentials.');
      }

      DataStore.saveProfile(updatedProfile);
      DataStore.setCurrentUser(updatedProfile.id);
      DataStore.addAuditLog('COMPLETED_STUDENT_PROFILE_SETUP', 'STUDENT_PROFILE', updatedProfile.id, {
        student_id: updatedProfile.student_id,
        cgpa: updatedProfile.cgpa
      });

      setSaveSuccess(true);
      setTimeout(() => {
        onProfileSaved(updatedProfile);
      }, 1500);

    } catch (err: any) {
      console.error('Error saving student profile:', err);
      alert('An error occurred while saving your profile. Please check all details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/80 via-slate-900 to-indigo-950/80 border border-purple-500/30 shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/40">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>{isEditing ? 'Edit Student Profile' : 'Student Onboarding & Verification'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isEditing ? 'Update Academic & Placement Profile' : 'Student Placement Profile Setup'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              Complete your authoritative student profile with verified academic credentials and your resume. All details are validated and saved to Supabase with Row Level Security.
            </p>
          </div>

          {isEditing && onNavigateToDashboard && (
            <button
              onClick={onNavigateToDashboard}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold self-start sm:self-auto transition"
            >
              Back to Dashboard
            </button>
          )}
        </div>

        {/* Supabase Status Alert */}
        <div className="mt-5 p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Database className={`w-4 h-4 shrink-0 ${supabaseActive ? 'text-emerald-400' : 'text-amber-400'}`} />
            <div>
              <span className="font-semibold text-white">
                Database & Storage Status:{' '}
              </span>
              <span className={supabaseActive ? 'text-emerald-400 font-bold' : 'text-amber-400 font-medium'}>
                {supabaseActive ? 'Live Supabase Connected (PostgreSQL & Storage Active)' : 'Supabase Not Configured (Local Browser Storage Mode)'}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowSupabaseConfig(!showSupabaseConfig)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 text-xs font-medium border border-slate-700 transition"
          >
            {supabaseActive ? 'View Supabase Config' : 'Configure Supabase Keys'}
          </button>
        </div>

        {/* Supabase Config Dialog */}
        {showSupabaseConfig && (
          <div className="mt-4 p-4 rounded-2xl bg-slate-900 border border-purple-500/40 text-xs space-y-3 animate-in fade-in">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Database className="w-4 h-4 text-purple-400" />
                <span>Supabase Configuration</span>
              </h3>
              <span className="text-[11px] text-slate-400">Environment or Browser Storage</span>
            </div>
            <p className="text-slate-400 text-xs">
              Provide your Supabase Project URL and Anon Public Key to persist student profiles and uploaded resume files to Supabase with Row Level Security.
            </p>
            <div className="space-y-2">
              <div>
                <label className="block text-slate-300 text-[11px] font-semibold mb-1">VITE_SUPABASE_URL</label>
                <input
                  type="text"
                  value={configUrl}
                  onChange={e => setConfigUrl(e.target.value)}
                  placeholder="https://your-project.supabase.co"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <div>
                <label className="block text-slate-300 text-[11px] font-semibold mb-1">VITE_SUPABASE_ANON_KEY</label>
                <input
                  type="password"
                  value={configKey}
                  onChange={e => setConfigKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowSupabaseConfig(false)}
                className="px-3 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!configUrl.trim() || !configKey.trim()) {
                    alert('Please enter both Supabase URL and Anon Key.');
                    return;
                  }
                  saveSupabaseCredentials(configUrl, configKey);
                }}
                className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold shadow"
              >
                Save & Connect Supabase
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Validation Summary Alert if Errors */}
      {Object.keys(errors).length > 0 && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1.5 animate-in fade-in">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Please complete all mandatory profile fields:</span>
          </div>
          <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
            {Object.values(errors).map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Status or Success Notification */}
      {saveSuccess && (
        <div className="p-5 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <h4 className="font-bold text-sm text-white">Profile Successfully Saved!</h4>
            <p className="text-slate-300">Redirecting to your student placement dashboard...</p>
          </div>
        </div>
      )}

      {statusMessage && !saveSuccess && (
        <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 text-xs">
          {statusMessage}
        </div>
      )}

      {/* Form Body */}
      <form onSubmit={handleSaveProfile} className="space-y-6 text-xs">
        
        {/* 1. Personal Information */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
            <User className="w-4 h-4 text-purple-400" />
            <span>1. Personal Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Full Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Rahul Sharma"
                className={`w-full bg-slate-800 border rounded-xl px-3 py-2 text-white text-xs focus:outline-none ${
                  errors.fullName ? 'border-rose-500' : 'border-slate-700 focus:border-purple-500'
                }`}
              />
              {errors.fullName && <p className="text-rose-400 text-[10px] mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Email Address <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="student@college.edu"
                className={`w-full bg-slate-800 border rounded-xl px-3 py-2 text-white text-xs focus:outline-none ${
                  errors.email ? 'border-rose-500' : 'border-slate-700 focus:border-purple-500'
                }`}
              />
              {errors.email && <p className="text-rose-400 text-[10px] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Phone Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={e => setPhone(e.target.value)}
                placeholder="e.g. 9876543210"
                className={`w-full bg-slate-800 border rounded-xl px-3 py-2 text-white text-xs focus:outline-none ${
                  errors.phone ? 'border-rose-500' : 'border-slate-700 focus:border-purple-500'
                }`}
              />
              {errors.phone && <p className="text-rose-400 text-[10px] mt-1">{errors.phone}</p>}
            </div>
          </div>
        </div>

        {/* 2. Academic Credentials */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <span>2. Academic Qualifications</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Student ID / Register No. <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={studentId}
                onChange={e => setStudentId(e.target.value)}
                placeholder="e.g. 2022CS104"
                className={`w-full bg-slate-800 border rounded-xl px-3 py-2 text-white text-xs focus:outline-none ${
                  errors.studentId ? 'border-rose-500' : 'border-slate-700 focus:border-purple-500'
                }`}
              />
              {errors.studentId && <p className="text-rose-400 text-[10px] mt-1">{errors.studentId}</p>}
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                College / University Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={collegeName}
                onChange={e => setCollegeName(e.target.value)}
                placeholder="e.g. Apex Institute of Technology"
                className={`w-full bg-slate-800 border rounded-xl px-3 py-2 text-white text-xs focus:outline-none ${
                  errors.collegeName ? 'border-rose-500' : 'border-slate-700 focus:border-purple-500'
                }`}
              />
              {errors.collegeName && <p className="text-rose-400 text-[10px] mt-1">{errors.collegeName}</p>}
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Department / Branch <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={department}
                onChange={e => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science & Engineering"
                className={`w-full bg-slate-800 border rounded-xl px-3 py-2 text-white text-xs focus:outline-none ${
                  errors.department ? 'border-rose-500' : 'border-slate-700 focus:border-purple-500'
                }`}
              />
              {errors.department && <p className="text-rose-400 text-[10px] mt-1">{errors.department}</p>}
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Degree and Year of Study <span className="text-rose-400">*</span>
              </label>
              <select
                required
                value={degreeAndYear}
                onChange={e => setDegreeAndYear(e.target.value)}
                className={`w-full bg-slate-800 border rounded-xl px-3 py-2 text-white text-xs focus:outline-none ${
                  errors.degreeAndYear ? 'border-rose-500' : 'border-slate-700 focus:border-purple-500'
                }`}
              >
                <option value="">-- Select Degree and Year of Study --</option>
                <option value="B.Tech - 4th Year (Final Year)">B.Tech - 4th Year (Final Year)</option>
                <option value="B.Tech - 3rd Year (Pre-Final)">B.Tech - 3rd Year (Pre-Final)</option>
                <option value="B.E - 4th Year">B.E - 4th Year</option>
                <option value="B.E - 3rd Year">B.E - 3rd Year</option>
                <option value="M.Tech - 2nd Year">M.Tech - 2nd Year</option>
                <option value="MCA - Final Year">MCA - Final Year</option>
                <option value="B.Sc / BCA - Final Year">B.Sc / BCA - Final Year</option>
              </select>
              {errors.degreeAndYear && <p className="text-rose-400 text-[10px] mt-1">{errors.degreeAndYear}</p>}
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Graduation Year <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                min="2020"
                max="2035"
                required
                value={graduationYear}
                onChange={e => setGraduationYear(e.target.value)}
                placeholder="2026"
                className={`w-full bg-slate-800 border rounded-xl px-3 py-2 text-white text-xs focus:outline-none ${
                  errors.graduationYear ? 'border-rose-500' : 'border-slate-700 focus:border-purple-500'
                }`}
              />
              {errors.graduationYear && <p className="text-rose-400 text-[10px] mt-1">{errors.graduationYear}</p>}
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Cumulative CGPA (0.00 - 10.00) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                value={cgpa}
                onChange={e => setCgpa(e.target.value)}
                placeholder="e.g. 8.50"
                className={`w-full bg-slate-800 border rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none ${
                  errors.cgpa ? 'border-rose-500' : 'border-slate-700 focus:border-purple-500'
                }`}
              />
              {errors.cgpa && <p className="text-rose-400 text-[10px] mt-1">{errors.cgpa}</p>}
            </div>
          </div>
        </div>

        {/* 3. Technical Competencies & Programming Languages */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
            <Code2 className="w-4 h-4 text-purple-400" />
            <span>3. Technical Skills & Programming Languages</span>
          </h2>

          <div className="space-y-4">
            {/* Technical Skills */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Technical Skills & Frameworks <span className="text-rose-400">*</span>
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {technicalSkills.map(skill => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 font-medium text-xs flex items-center gap-1.5"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 max-w-md">
                <input
                  type="text"
                  value={skillInput}
                  onChange={e => setSkillInput(e.target.value)}
                  placeholder="e.g. React, Node.js, PostgreSQL, Docker..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold transition"
                >
                  Add Skill
                </button>
              </div>
              {errors.technicalSkills && <p className="text-rose-400 text-[10px] mt-1">{errors.technicalSkills}</p>}
            </div>

            {/* Programming Languages */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Programming Languages
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {programmingLanguages.map(lang => (
                  <span
                    key={lang}
                    className="px-2.5 py-1 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-medium text-xs flex items-center gap-1.5"
                  >
                    <span>{lang}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveLang(lang)}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2 max-w-md">
                <input
                  type="text"
                  value={langInput}
                  onChange={e => setLangInput(e.target.value)}
                  placeholder="e.g. Python, Java, C++, TypeScript, SQL..."
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLang();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddLang}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
                >
                  Add Language
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Projects */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <FolderGit2 className="w-4 h-4 text-purple-400" />
              <span>4. Academic & Technical Projects ({projects.length})</span>
            </h2>
            <button
              type="button"
              onClick={() => setShowAddProject(!showAddProject)}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Project</span>
            </button>
          </div>

          {/* List of projects */}
          {projects.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No projects added yet. Click 'Add Project' to showcase your capstone or software projects.</p>
          ) : (
            <div className="space-y-3">
              {projects.map(proj => (
                <div key={proj.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-1 relative">
                  <button
                    type="button"
                    onClick={() => handleRemoveProject(proj.id)}
                    className="absolute top-3 right-3 text-slate-400 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <h4 className="font-bold text-white text-xs">{proj.title}</h4>
                  <span className="text-[10px] text-purple-400 font-semibold block">{proj.tech_stack}</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{proj.description}</p>
                  {proj.link && (
                    <a
                      href={proj.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-indigo-400 hover:underline inline-flex items-center gap-1 mt-1"
                    >
                      <span>Project Link / GitHub</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add project form */}
          {showAddProject && (
            <div className="p-4 rounded-2xl bg-slate-800 border border-purple-500/30 space-y-3 animate-in fade-in">
              <h4 className="font-bold text-white text-xs">New Project Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={newProjectTitle}
                  onChange={e => setNewProjectTitle(e.target.value)}
                  placeholder="Project Title (e.g. Distributed Task Queue)"
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
                <input
                  type="text"
                  value={newProjectTech}
                  onChange={e => setNewProjectTech(e.target.value)}
                  placeholder="Technologies Used (e.g. React, Node.js, Redis)"
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <textarea
                rows={2}
                value={newProjectDesc}
                onChange={e => setNewProjectDesc(e.target.value)}
                placeholder="Describe project architecture, your specific contributions, and measurable outcomes..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
              <input
                type="url"
                value={newProjectLink}
                onChange={e => setNewProjectLink(e.target.value)}
                placeholder="Repository or Demo URL (optional)"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddProject(false)}
                  className="px-3 py-1 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddProject}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs"
                >
                  Confirm Project
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 5. Certifications */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-400" />
              <span>5. Certifications ({certifications.length})</span>
            </h2>
            <button
              type="button"
              onClick={() => setShowAddCert(!showAddCert)}
              className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Certification</span>
            </button>
          </div>

          {certifications.length === 0 ? (
            <p className="text-xs text-slate-500 italic">No certifications added yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {certifications.map(cert => (
                <div key={cert.id} className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-white text-xs">{cert.title}</h4>
                    <span className="text-[10px] text-slate-400">{cert.issuer} • {cert.year}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveCert(cert.id)}
                    className="text-slate-400 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {showAddCert && (
            <div className="p-4 rounded-2xl bg-slate-800 border border-purple-500/30 space-y-3 animate-in fade-in">
              <h4 className="font-bold text-white text-xs">New Certification</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  value={newCertTitle}
                  onChange={e => setNewCertTitle(e.target.value)}
                  placeholder="Certification Title (e.g. AWS Certified Developer)"
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 sm:col-span-2"
                />
                <input
                  type="text"
                  value={newCertIssuer}
                  onChange={e => setNewCertIssuer(e.target.value)}
                  placeholder="Issuer (e.g. AWS, Oracle, Coursera)"
                  className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                />
              </div>
              <input
                type="text"
                value={newCertYear}
                onChange={e => setNewCertYear(e.target.value)}
                placeholder="Year (e.g. 2025)"
                className="w-32 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
              />
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowAddCert(false)}
                  className="px-3 py-1 rounded-lg text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCert}
                  className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs"
                >
                  Confirm Certification
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 6. Resume Upload */}
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-slate-800">
            <FileText className="w-4 h-4 text-purple-400" />
            <span>6. Official Resume Upload <span className="text-rose-400">*</span></span>
          </h2>

          <div className="border-2 border-dashed border-slate-700 hover:border-purple-500/60 rounded-2xl p-6 text-center space-y-3 bg-slate-800/40 transition">
            <Upload className="w-10 h-10 text-purple-400 mx-auto opacity-80" />
            
            <div>
              <p className="text-sm font-bold text-white">Upload Your Student Resume</p>
              <p className="text-xs text-slate-400 mt-0.5">Supports PDF or DOCX formats (maximum 5MB)</p>
            </div>

            <label className="inline-block cursor-pointer px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition shadow-md shadow-purple-600/30">
              <span>Choose Resume File</span>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {(resumeFilename || resumeFile) && (
              <div className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs text-purple-200 inline-flex items-center gap-2 max-w-md mx-auto">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold truncate">{resumeFile ? resumeFile.name : resumeFilename}</span>
                {resumeFile && (
                  <span className="text-[10px] text-slate-400">({(resumeFile.size / 1024).toFixed(0)} KB)</span>
                )}
              </div>
            )}

            {errors.resume && <p className="text-rose-400 text-[11px] font-medium">{errors.resume}</p>}
          </div>
        </div>

        {/* Action Buttons: Save Profile & Edit Profile */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
          {isEditing && onNavigateToDashboard && (
            <button
              type="button"
              onClick={onNavigateToDashboard}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition"
            >
              Cancel Updates
            </button>
          )}

          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Saving to Supabase & Verification...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>{isEditing ? 'Save Profile Updates' : 'Save Profile & Enter Placement Portal'}</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
