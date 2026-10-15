import { 
  ResumeAnalysisResult, 
  JobMatchBreakdown, 
  InterviewQuestionItem, 
  AnswerFeedback, 
  SkillGapAnalysisResult,
  ChatMessage
} from '../types';

export const ApiService = {
  // Resume Analyzer
  async analyzeResume(resumeText: string, targetRole: string): Promise<ResumeAnalysisResult> {
    const res = await fetch('/api/ai/resume-analyzer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText, targetRole })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to analyze resume');
    }
    return res.json();
  },

  // Job Match
  async computeJobMatch(studentProfile: any, jobDetails: any): Promise<JobMatchBreakdown> {
    const res = await fetch('/api/ai/job-match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ studentProfile, jobDetails })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to compute job match');
    }
    return res.json();
  },

  // Mock Interview Questions
  async generateInterviewQuestions(roleTitle: string, round: string, difficulty: string): Promise<{ questions: InterviewQuestionItem[] }> {
    const res = await fetch('/api/ai/interview/generate-questions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleTitle, round, difficulty })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to generate interview questions');
    }
    return res.json();
  },

  // Mock Interview Answer Evaluation
  async evaluateInterviewAnswer(question: string, answer: string, category: string): Promise<AnswerFeedback> {
    const res = await fetch('/api/ai/interview/evaluate-answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, answer, category })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to evaluate interview answer');
    }
    return res.json();
  },

  // Skill Gap Analysis
  async analyzeSkillGap(currentSkills: string[], targetRole: string): Promise<SkillGapAnalysisResult> {
    const res = await fetch('/api/ai/skill-gap', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentSkills, targetRole })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to compute skill gap analysis');
    }
    return res.json();
  },

  // Career Chat
  async sendCareerChat(messages: ChatMessage[]): Promise<{ reply: string }> {
    const res = await fetch('/api/ai/career-chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || 'Failed to send career chat');
    }
    return res.json();
  },

  // System Status
  async getSystemStatus(): Promise<{ status: string; geminiEnabled: boolean; supabaseConfigured: boolean }> {
    try {
      const res = await fetch('/api/system-status');
      if (!res.ok) throw new Error('Status error');
      return res.json();
    } catch {
      return { status: 'offline', geminiEnabled: false, supabaseConfigured: false };
    }
  }
};
