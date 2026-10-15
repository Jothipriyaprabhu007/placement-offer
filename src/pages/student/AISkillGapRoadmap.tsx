import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Calendar, 
  ExternalLink, 
  BookOpen, 
  Award,
  ArrowRight
} from 'lucide-react';
import { UserProfile, SkillGapAnalysisResult } from '../../types';
import { ApiService } from '../../lib/api';

interface AISkillGapRoadmapProps {
  currentUser: UserProfile;
}

export const AISkillGapRoadmap: React.FC<AISkillGapRoadmapProps> = ({ currentUser }) => {
  const [targetRole, setTargetRole] = useState('Full Stack Cloud Engineer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SkillGapAnalysisResult | null>(null);

  useEffect(() => {
    handleRunAnalysis();
  }, [targetRole]);

  const handleRunAnalysis = async () => {
    setLoading(true);
    try {
      const data = await ApiService.analyzeSkillGap(currentUser.skills || ['React', 'JavaScript', 'Node.js', 'SQL'], targetRole);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-2 border border-purple-500/20">
            <Compass className="w-3.5 h-3.5" />
            <span>Career Progression Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            AI Skill Gap Analysis & 4-Week Roadmap
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Compare your verified competencies against current industry demands to unlock higher CTC tiers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Target Role:</label>
          <select
            value={targetRole}
            onChange={e => setTargetRole(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="Full Stack Cloud Engineer">Full Stack Cloud Engineer</option>
            <option value="DevOps & Kubernetes Specialist">DevOps & Kubernetes</option>
            <option value="Data Scientist / ML Engineer">Data Scientist / ML Engineer</option>
            <option value="High-Frequency Quantitative Developer">Quant Developer</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center bg-slate-900 rounded-3xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <h3 className="text-sm font-bold text-white">Analyzing Skill Graph with Gemini...</h3>
          <p className="text-xs text-slate-400">Benchmarking verified campus skills against enterprise tech requirements.</p>
        </div>
      ) : result ? (
        <div className="space-y-8">
          
          {/* Readiness Banner */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                Current Role Readiness
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-extrabold text-white">{result.currentMatchPercentage}%</span>
                <span className="text-slate-400 text-sm">Competency Alignment</span>
              </div>
              <p className="text-xs text-slate-300 mt-2 max-w-xl leading-relaxed">
                {result.marketDemandTrend}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Target Role</span>
              <strong className="text-white text-sm">{result.targetRole}</strong>
            </div>
          </div>

          {/* Skills Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            
            <div className="p-4 rounded-2xl bg-slate-900 border border-emerald-500/20 space-y-2.5">
              <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Acquired Skills</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {result.acquiredSkills.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[11px]">
                    ✓ {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-rose-500/20 space-y-2.5">
              <h4 className="font-bold text-rose-400 flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Critical Missing Gaps</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {result.criticalMissingSkills.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/30 text-[11px]">
                    ✕ {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 border border-indigo-500/20 space-y-2.5">
              <h4 className="font-bold text-indigo-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Bonus / Nice-To-Have</span>
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {result.niceToHaveSkills.map(s => (
                  <span key={s} className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 text-[11px]">
                    + {s}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* 4-Week Step-by-Step Learning Roadmap */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-400" />
                <span>Personalized 4-Week Learning Roadmap</span>
              </h2>
              <span className="text-xs text-slate-400">Milestone-based completion</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.learningRoadmap.map(phase => (
                <div 
                  key={phase.week}
                  className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold text-[10px] uppercase border border-purple-500/30">
                        Week {phase.week}
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm">{phase.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{phase.description}</p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <div className="p-2.5 rounded-xl bg-purple-950/20 border border-purple-500/20 text-xs">
                      <span className="text-[10px] font-bold text-purple-300 block uppercase mb-0.5">Week Milestone:</span>
                      <span className="text-slate-300">{phase.milestone}</span>
                    </div>

                    {phase.recommendedResources && (
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                        <span>{phase.recommendedResources.join(' • ')}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
};
