import React, { useState } from 'react';
import { 
  PlusCircle, 
  Briefcase, 
  Check, 
  AlertCircle, 
  X, 
  Plus, 
  Building2 
} from 'lucide-react';
import { UserProfile, Job, JobType, WorkMode } from '../../types';
import { DataStore } from '../../lib/storage';

interface JobPostBuilderProps {
  currentUser: UserProfile;
  onNavigate: (view: string) => void;
}

export const JobPostBuilder: React.FC<JobPostBuilderProps> = ({ 
  currentUser,
  onNavigate 
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<JobType>('full-time');
  const [workMode, setWorkMode] = useState<WorkMode>('hybrid');
  const [location, setLocation] = useState('Bengaluru, India');
  const [salaryRange, setSalaryRange] = useState('₹12 LPA - ₹16 LPA');
  const [minCgpa, setMinCgpa] = useState<number>(7.5);
  const [batchYear, setBatchYear] = useState<number>(2026);
  const [openings, setOpenings] = useState<number>(5);
  const [deadline, setDeadline] = useState('2026-12-15');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState<string[]>(['React', 'TypeScript', 'Node.js', 'PostgreSQL']);
  const [newSkill, setNewSkill] = useState('');
  const [branches, setBranches] = useState<string[]>(['Computer Science', 'Information Technology', 'Electronics & Comm']);
  const [success, setSuccess] = useState(false);

  const handleAddSkill = () => {
    if (newSkill.trim() && !requiredSkills.includes(newSkill.trim())) {
      setRequiredSkills([...requiredSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter(s => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert('Please fill all required job details.');
      return;
    }

    const companyName = currentUser.company_name || 'TechNova Solutions';

    DataStore.createJob({
      company_id: currentUser.company_id || 'comp-001',
      company_name: companyName,
      recruiter_id: currentUser.id,
      title,
      description,
      type,
      location,
      work_mode: workMode,
      salary_range: salaryRange,
      min_cgpa: Number(minCgpa),
      eligible_branches: branches,
      batch_year: Number(batchYear),
      required_skills: requiredSkills,
      deadline,
      openings: Number(openings),
      status: 'active'
    });

    setSuccess(true);
    setTimeout(() => {
      onNavigate('recruiter-manage-jobs');
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      <div className="pb-6 border-b border-slate-800">
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
          <PlusCircle className="w-6 h-6 text-indigo-400" />
          <span>Publish New Campus Placement Vacancy</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Post full-time or internship requirements for verified graduating students.
        </p>
      </div>

      {success ? (
        <div className="p-12 text-center bg-slate-900 rounded-3xl border border-emerald-500/30 space-y-3">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Check className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-white">Job Listing Published!</h2>
          <p className="text-xs text-slate-400">Your vacancy is now live on the student placement board.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* Basic Info */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Role & Department
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Job Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Associate Cloud Infrastructure Engineer"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Hiring Organization</label>
                <input
                  type="text"
                  disabled
                  value={currentUser.company_name || 'TechNova Solutions'}
                  className="w-full bg-slate-800/60 border border-slate-700/60 rounded-xl px-3 py-2 text-slate-400 text-xs cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Employment Type</label>
                <select
                  value={type}
                  onChange={e => setType(e.target.value as JobType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="full-time">Full-Time Placement</option>
                  <option value="internship">Pre-Placement Internship</option>
                  <option value="contract">Graduate Trainee</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Work Arrangement</label>
                <select
                  value={workMode}
                  onChange={e => setWorkMode(e.target.value as WorkMode)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                >
                  <option value="hybrid">Hybrid (Campus / Work from Office)</option>
                  <option value="on-site">On-Site Corporate Office</option>
                  <option value="remote">Fully Remote</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Office Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="e.g. Bengaluru / Pune, India"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Package CTC or Stipend *</label>
                <input
                  type="text"
                  required
                  value={salaryRange}
                  onChange={e => setSalaryRange(e.target.value)}
                  placeholder="e.g. ₹12 LPA - ₹15 LPA or ₹40k/mo"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Academic Eligibility */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Academic Eligibility Criteria
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Minimum CGPA Cutoff</label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={minCgpa}
                  onChange={e => setMinCgpa(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Graduation Batch Year</label>
                <input
                  type="number"
                  value={batchYear}
                  onChange={e => setBatchYear(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Application Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Required Skills */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Required Technical Competencies
            </h2>

            <div className="flex flex-wrap gap-2 mb-3">
              {requiredSkills.map(s => (
                <span 
                  key={s}
                  className="px-3 py-1 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-medium flex items-center gap-1.5"
                >
                  <span>{s}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(s)}
                    className="hover:text-white"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2 max-w-sm">
              <input
                type="text"
                value={newSkill}
                onChange={e => setNewSkill(e.target.value)}
                placeholder="Add required skill (e.g. AWS, Docker)..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
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
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold transition"
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Job Description & Key Responsibilities *
            </h2>

            <textarea
              rows={6}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Outline role responsibilities, tech stack, day-to-day projects, and evaluation rounds..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => onNavigate('recruiter-dashboard')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold transition shadow-lg shadow-indigo-600/30"
            >
              Publish Job Listing
            </button>
          </div>

        </form>
      )}

    </div>
  );
};
