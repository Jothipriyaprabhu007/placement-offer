import React, { useState } from 'react';
import { 
  Sparkles, 
  HelpCircle, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  ChevronRight, 
  RefreshCw, 
  Award, 
  BookOpen, 
  MessageSquare,
  ThumbsUp,
  Cpu
} from 'lucide-react';
import { UserProfile, InterviewQuestionItem, AnswerFeedback } from '../../types';
import { ApiService } from '../../lib/api';

interface AIMockInterviewProps {
  currentUser: UserProfile;
}

export const AIMockInterview: React.FC<AIMockInterviewProps> = ({ currentUser }) => {
  const [roleTitle, setRoleTitle] = useState('Full Stack Software Engineer');
  const [round, setRound] = useState('Technical Round 1');
  const [difficulty, setDifficulty] = useState('Medium');
  
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState<InterviewQuestionItem[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);

  const [evaluating, setEvaluating] = useState(false);
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);

  const handleGenerateQuestions = async () => {
    setGenerating(true);
    setFeedback(null);
    setUserAnswer('');
    setShowHint(false);
    try {
      const res = await ApiService.generateInterviewQuestions(roleTitle, round, difficulty);
      setQuestions(res.questions || []);
      setActiveIndex(0);
    } catch (err) {
      console.error(err);
      alert('Failed to generate interview questions. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleEvaluate = async () => {
    if (!userAnswer.trim() || userAnswer.length < 10) {
      alert('Please provide a complete answer to evaluate.');
      return;
    }
    const currentQ = questions[activeIndex];
    if (!currentQ) return;

    setEvaluating(true);
    try {
      const res = await ApiService.evaluateInterviewAnswer(
        currentQ.question,
        userAnswer,
        currentQ.category
      );
      setFeedback(res);
    } catch (err) {
      console.error(err);
      alert('Failed to evaluate answer. Please try again.');
    } finally {
      setEvaluating(false);
    }
  };

  const currentQ = questions[activeIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold mb-2 border border-purple-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Placement Simulator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            AI Technical & HR Mock Interview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Practice role-specific interview inquiries and receive structured STAR-framework critique.
          </p>
        </div>
      </div>

      {/* Configuration Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Target Job Role</label>
          <select
            value={roleTitle}
            onChange={e => setRoleTitle(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="Full Stack Software Engineer">Full Stack Software Engineer</option>
            <option value="Backend Developer (Node / Go / PostgreSQL)">Backend Developer</option>
            <option value="Frontend React Developer">Frontend React Developer</option>
            <option value="Cloud DevOps Engineer">Cloud DevOps Engineer</option>
            <option value="Quantitative Data Analyst">Data Analyst</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Interview Round</label>
          <select
            value={round}
            onChange={e => setRound(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="Technical Round 1">Technical Round 1 (Foundations)</option>
            <option value="Technical Round 2">Technical Round 2 (System & Scale)</option>
            <option value="HR & Behavioral">HR & Behavioral (STAR)</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Difficulty</label>
          <select
            value={difficulty}
            onChange={e => setDifficulty(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-500"
          >
            <option value="Entry Level">Campus Entry Level</option>
            <option value="Medium">Standard Tier-1 Medium</option>
            <option value="Challenging">Advanced Product Tier</option>
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={handleGenerateQuestions}
            disabled={generating}
            className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs transition flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/25"
          >
            {generating ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Generate Questions</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Simulation View */}
      {questions.length > 0 ? (
        <div className="space-y-6">
          
          {/* Question Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {questions.map((q, idx) => (
              <button
                key={q.id || idx}
                onClick={() => {
                  setActiveIndex(idx);
                  setFeedback(null);
                  setUserAnswer('');
                  setShowHint(false);
                }}
                className={`px-4 py-2 rounded-xl text-xs font-semibold shrink-0 transition flex items-center gap-2 border ${
                  activeIndex === idx
                    ? 'bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-600/25'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span>Question {idx + 1}</span>
                <span className="text-[10px] opacity-75 font-normal">({q.category})</span>
              </button>
            ))}
          </div>

          {/* Active Question Card */}
          {currentQ && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between text-xs text-purple-400 font-semibold">
                <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30">
                  {currentQ.category} Assessment
                </span>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="text-slate-400 hover:text-white flex items-center gap-1 transition"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-purple-400" />
                  <span>{showHint ? 'Hide Concept Hints' : 'View Key Concepts'}</span>
                </button>
              </div>

              <h2 className="text-base sm:text-lg font-bold text-white leading-relaxed">
                "{currentQ.question}"
              </h2>

              {showHint && currentQ.expectedConcepts && (
                <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1.5 animate-in fade-in">
                  <span className="text-purple-300 font-semibold block text-[11px] uppercase tracking-wider">
                    Recommended Concepts to Touch On:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {currentQ.expectedConcepts.map(c => (
                      <span key={c} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Answer Input */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-300">
                  Your Answer (Use the STAR framework: Situation, Task, Action, Result for behavioral; explain architectural trade-offs for technical)
                </label>
                <textarea
                  rows={6}
                  value={userAnswer}
                  onChange={e => setUserAnswer(e.target.value)}
                  placeholder="Type your response as you would speak it to the interviewer..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-2xl p-4 text-xs text-white leading-relaxed focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={handleEvaluate}
                  disabled={evaluating || !userAnswer.trim()}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/25 transition flex items-center gap-1.5 disabled:opacity-40"
                >
                  {evaluating ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Evaluating Response...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Evaluate My Answer</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          )}

          {/* Feedback Card */}
          {feedback && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-extrabold text-white">
                    {feedback.score} <span className="text-sm font-normal text-slate-400">/ 100</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Interviewer Assessment</h3>
                    <p className="text-xs text-slate-400">STAR Compliance: <strong className="text-purple-400">{feedback.starMethodCompliance}</strong></p>
                  </div>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30 self-start sm:self-auto">
                  Depth: {feedback.depthRating}
                </span>
              </div>

              {/* Positives & Critique */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-800/60 border border-emerald-500/20 space-y-2">
                  <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <ThumbsUp className="w-4 h-4" />
                    <span>What You Did Well</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {feedback.positives.map((p, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-slate-800/60 border border-amber-500/20 space-y-2">
                  <h4 className="font-bold text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4" />
                    <span>Areas for Improvement</span>
                  </h4>
                  <ul className="space-y-1.5 text-slate-300">
                    {feedback.critique.map((c, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Exemplary Model Answer */}
              {feedback.improvedAnswerModel && (
                <div className="p-4 rounded-2xl bg-purple-950/20 border border-purple-500/30 space-y-2 text-xs">
                  <span className="font-bold text-purple-300 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                    <BookOpen className="w-4 h-4 text-purple-400" />
                    <span>Model Answer (Benchmark Standard)</span>
                  </span>
                  <p className="text-slate-300 leading-relaxed italic whitespace-pre-line">
                    "{feedback.improvedAnswerModel}"
                  </p>
                </div>
              )}

            </div>
          )}

        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-slate-900 border border-slate-800 text-center text-slate-400 space-y-3">
          <MessageSquare className="w-12 h-12 mx-auto opacity-30 text-purple-400" />
          <h3 className="font-bold text-white text-base">Start a Practice Session</h3>
          <p className="text-xs max-w-md mx-auto leading-relaxed">
            Select your desired engineering role and interview round above, then click "Generate Questions" to begin interactive mock interview drills.
          </p>
        </div>
      )}

    </div>
  );
};
