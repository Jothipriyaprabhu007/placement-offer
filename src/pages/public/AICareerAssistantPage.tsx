import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  HelpCircle, 
  FileText, 
  CheckCircle2, 
  Compass, 
  Briefcase, 
  Lightbulb 
} from 'lucide-react';
import { ChatMessage, UserProfile } from '../../types';
import { ApiService } from '../../lib/api';

interface AICareerAssistantProps {
  currentUser: UserProfile;
  onNavigate: (view: string) => void;
}

export const AICareerAssistantPage: React.FC<AICareerAssistantProps> = ({ 
  currentUser,
  onNavigate 
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: `Hello ${currentUser.full_name || 'there'}! I am your HireReady AI Career Advisor.

I can help you:
• Optimize your resume bullet points using the Google X-Y-Z formula
• Prepare STAR-method responses for campus placement technical & HR rounds
• Address academic questions (e.g. justifying a semester CGPA or gap)
• Evaluate compensation breakdown (fixed vs variable CTC and employment bond clauses)

What career challenge are you working through today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const promptSuggestions = [
    'How do I rephrase a resume bullet to show quantifiable business impact?',
    'What are the most frequent technical interview questions for a Full Stack Node/React role?',
    'How can I answer "Tell me about a time you failed" using the STAR framework?',
    'Explain the difference between Fixed CTC, Performance Bonus, and Retention Bonds.'
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await ApiService.sendCareerChat(newHistory);
      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...newHistory, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        sender: 'assistant',
        text: 'I ran into an issue processing that query. Please try again or rephrase your question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...newHistory, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col h-[calc(100vh-6rem)]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-800 gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-600/25">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <span>AI Career Assistant</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-semibold border border-purple-500/30">
                Gemini 3.8 Flash
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Campus placement advisory, resume refinement & behavioral coaching
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('student-mock-interview')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-purple-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <Compass className="w-3.5 h-3.5 text-purple-400" />
            <span>Practice Mock Interview</span>
          </button>
          <button
            onClick={() => onNavigate('student-resume-analyzer')}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span>ATS Resume Scan</span>
          </button>
        </div>
      </div>

      {/* Suggested Starters */}
      <div className="py-3 flex items-center gap-2 overflow-x-auto text-xs shrink-0 no-scrollbar">
        <span className="text-[11px] text-slate-500 flex items-center gap-1 shrink-0 font-medium">
          <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Quick Prompts:
        </span>
        {promptSuggestions.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="shrink-0 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 hover:border-purple-500/50 text-slate-300 hover:text-white transition text-[11px]"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-xs leading-relaxed space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-sm shadow-lg shadow-indigo-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>
              <div className={`text-[10px] ${msg.sender === 'user' ? 'text-purple-200 text-right' : 'text-slate-500'}`}>
                {msg.timestamp}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/30 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/30">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-150"></span>
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse delay-300"></span>
              <span className="text-[11px] text-slate-400 ml-1">Analyzing career inquiry...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="pt-3 border-t border-slate-800 shrink-0">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-2xl p-2 focus-within:border-purple-500 transition"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask about placement preparation, resume bullets, or interview strategies..."
            className="flex-1 bg-transparent border-none text-xs text-white px-3 py-1.5 focus:outline-none"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="p-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white disabled:opacity-40 transition shadow-md shadow-indigo-600/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-500 text-center mt-1.5">
          HireReady AI provides guidance based on verified recruitment standards. Final drive rules adhere to your institution's Placement Policy.
        </p>
      </div>

    </div>
  );
};
