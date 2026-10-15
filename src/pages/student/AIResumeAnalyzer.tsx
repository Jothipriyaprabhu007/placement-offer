import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Upload, 
  RefreshCw, 
  Save, 
  Check, 
  ChevronRight 
} from 'lucide-react';
import { UserProfile, ResumeAnalysisResult } from '../../types';
import { ApiService } from '../../lib/api';
import { DataStore } from '../../lib/storage';

interface AIResumeAnalyzerProps {
  currentUser: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
}

export const AIResumeAnalyzer: React.FC<AIResumeAnalyzerProps> = ({ 
  currentUser,
  onUpdateProfile 
}) => {
  const [resumeText, setResumeText] = useState(
    currentUser.resume_text || 
    (currentUser.full_name 
      ? `${currentUser.full_name} - ${currentUser.department || currentUser.branch || 'Student'}, ${currentUser.college_name || 'College'}\nCGPA: ${currentUser.cgpa !== undefined && currentUser.cgpa !== null ? Number(currentUser.cgpa).toFixed(2) : '0.00'}/10.0\nGraduation Year: ${currentUser.graduation_year || currentUser.batch_year || '2026'}\nTechnical Skills: ${(currentUser.technical_skills || currentUser.skills || []).join(', ')}\nProgramming Languages: ${(currentUser.programming_languages || []).join(', ')}`
      : '')
  );
  
  const [targetRole, setTargetRole] = useState('Full Stack Software Engineer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResumeAnalysisResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleAnalyze = async () => {
    if (!resumeText.trim() || resumeText.length < 20) {
      alert('Please enter or paste your complete resume text.');
      return;
    }
    setLoading(true);
    try {
      const data = await ApiService.analyzeResume(resumeText, targetRole);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToProfile = () => {
    const updated = {
      ...currentUser,
      resume_text: resumeText,
      resume_filename: `${currentUser.full_name.replace(/\s+/g, '_')}_Resume_Reviewed.pdf`
    };
    DataStore.saveProfile(updated);
    onUpdateProfile(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-2 border border-purple-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ATS Diagnostic Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            AI Resume Analyzer & ATS Optimizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Evaluate your campus placement resume against real industry benchmarks with Gemini 3.8 Flash.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveToProfile}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {savedSuccess ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Saved to Profile' : 'Save Resume Text'}</span>
          </button>
        </div>
      </div>

      {/* Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-5 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Target Job Profile
              </label>
              <select
                value={targetRole}
                onChange={e => setTargetRole(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="Full Stack Software Engineer">Full Stack Software Engineer</option>
                <option value="Backend Developer (Node / Go / Java)">Backend Developer (Node / Go / Java)</option>
                <option value="Frontend Engineer (React / TypeScript)">Frontend Engineer (React / TypeScript)</option>
                <option value="Cloud & DevOps Engineer">Cloud & DevOps Engineer</option>
                <option value="Data Analyst / Business Intelligence">Data Analyst / Business Intelligence</option>
                <option value="Machine Learning / AI Associate">Machine Learning / AI Associate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Paste Resume Text or Bullet Points
              </label>
              <textarea
                rows={14}
                value={resumeText}
                onChange={e => setResumeText(e.target.value)}
                placeholder="Paste your education, skills, projects, and work experience here..."
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-white font-mono leading-relaxed focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Auditing with Gemini 3.8 Flash...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Complete ATS Audit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-7 space-y-6">
          {result ? (
            <div className="space-y-6">
              
              {/* Scorecard Banner */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Overall ATS Readiness
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-extrabold text-white">{result.score}</span>
                    <span className="text-slate-400 text-sm">/ 100</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {result.summary}
                  </p>
                </div>

                <div className="shrink-0 text-center sm:text-right">
                  <span className={`inline-block px-3 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider border ${
                    result.atsReadiness === 'High' 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                      : result.atsReadiness === 'Moderate'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  }`}>
                    {result.atsReadiness} ATS Match
                  </span>
                  <p className="text-[10px] text-slate-500 mt-1.5">Evaluated for: {targetRole}</p>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/20 space-y-2">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Identified Strengths</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {result.strengths.map((s, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-400">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-900 border border-amber-500/20 space-y-2">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Areas for Enhancement</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {result.weaknesses.map((w, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing Keywords Chips */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                  Recommended Missing Keywords for {targetRole}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {result.missingKeywords.map(keyword => (
                    <span 
                      key={keyword}
                      className="px-2.5 py-1 rounded-lg bg-purple-500/10 text-purple-300 border border-purple-500/30 text-xs font-medium"
                    >
                      + {keyword}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bullet Point Transformer */}
              {result.bulletPointRewrites && result.bulletPointRewrites.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-400" />
                    <span>High-Impact Bullet Point Transformations</span>
                  </h4>

                  {result.bulletPointRewrites.map((rw, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-400">
                        <span className="text-[10px] text-rose-400 font-bold block uppercase mb-0.5">Original (Passive):</span>
                        "{rw.original}"
                      </div>
                      <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-200">
                        <span className="text-[10px] text-emerald-400 font-bold block uppercase mb-0.5">Recommended (Quantified Impact):</span>
                        "{rw.improved}"
                      </div>
                      <p className="text-[11px] text-slate-400 italic">
                        Why this works: {rw.impactExplanation}
                      </p>
                    </div>
                  ))}
                </div>
              )}

            </div>
          ) : (
            <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 space-y-3">
              <FileText className="w-12 h-12 mx-auto opacity-30 text-purple-400" />
              <h3 className="font-bold text-white text-base">Run Your Resume Diagnostics</h3>
              <p className="text-xs max-w-md mx-auto leading-relaxed">
                Review your resume text on the left, select your target role, and click "Run Complete ATS Audit" to receive constructive suggestions and bullet point revisions.
              </p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
