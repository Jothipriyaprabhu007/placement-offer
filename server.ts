import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini SDK with User-Agent header as required
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// ==========================================
// AI ENDPOINTS
// ==========================================

// 1. Resume Analyzer
app.post('/api/ai/resume-analyzer', async (req: Request, res: Response) => {
  try {
    const { resumeText, targetRole = 'Software Engineer' } = req.body;
    if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide valid resume text of at least 20 characters.' });
    }

    if (!ai) {
      // Fallback response if GEMINI_API_KEY is not yet set
      return res.json({
        score: 82,
        atsReadiness: 'Moderate',
        summary: 'Resume demonstrates solid core software development skills and hands-on projects, but needs higher quantifiable business impact metrics.',
        strengths: [
          'Clear technical skills taxonomy covering modern stacks (React, TypeScript, Node.js)',
          'Demonstrated project ownership with concrete project descriptions',
          'Good academic track record'
        ],
        weaknesses: [
          'Lacks quantified metrics (e.g. latency reduced by X%, throughput improved)',
          'Missing cloud-native deployment details (Docker container orchestration, CI/CD)',
          'Action verbs could be stronger (use "Engineered", "Architected" instead of "Worked on")'
        ],
        missingKeywords: ['Docker', 'CI/CD Pipelines', 'Automated Testing / Jest', 'System Architecture', 'Microservices'],
        formattingSuggestions: [
          'Ensure uniform date format (e.g., MMM YYYY) across projects and experience',
          'Place Technical Skills immediately after Education for campus placement screeners',
          'Limit resume strictly to a clean single page'
        ],
        bulletPointRewrites: [
          {
            original: 'Worked on the frontend of an analytics dashboard using React.',
            improved: 'Architected responsive real-time analytics dashboard in React & TypeScript, boosting user task completion rate by 28%.',
            impactExplanation: 'Replaces passive verb "worked" with "Architected" and adds measurable business value.'
          },
          {
            original: 'Made backend APIs in Node.js and connected database.',
            improved: 'Designed and deployed 14+ RESTful microservices in Node.js/PostgreSQL with indexed queries, reducing p99 API latency by 35%.',
            impactExplanation: 'Highlights technical scale, specific endpoints count, and performance optimization outcome.'
          }
        ]
      });
    }

    const prompt = `You are a Senior Technical Recruiter and University Placement Director. Analyze this student resume specifically targeting the role "${targetRole}".
Resume Text:
"""
${resumeText.slice(0, 8000)}
"""

Provide an honest, constructive, and actionable assessment. Do NOT invent qualifications or employment history that is not present.
Respond ONLY with a valid JSON object matching this schema:
{
  "score": number (0 to 100 integer rating),
  "atsReadiness": "High" | "Moderate" | "Needs Improvement",
  "summary": string (2-3 concise sentences summarizing candidate readiness),
  "strengths": string[] (3 to 5 realistic strengths evident from text),
  "weaknesses": string[] (3 to 4 areas needing enhancement),
  "missingKeywords": string[] (5 to 8 keywords expected for ${targetRole} missing from text),
  "formattingSuggestions": string[] (2 to 3 formatting or layout suggestions),
  "bulletPointRewrites": [
    {
      "original": string,
      "improved": string,
      "impactExplanation": string
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/resume-analyzer:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze resume' });
  }
});

// 2. Job Matching
app.post('/api/ai/job-match', async (req: Request, res: Response) => {
  try {
    const { studentProfile, jobDetails } = req.body;
    if (!studentProfile || !jobDetails) {
      return res.status(400).json({ error: 'Missing studentProfile or jobDetails' });
    }

    if (!ai) {
      // Deterministic calculation fallback
      const studentSkills: string[] = (studentProfile.skills || []).map((s: string) => s.toLowerCase());
      const requiredSkills: string[] = (jobDetails.required_skills || []).map((s: string) => s.toLowerCase());
      
      const matched = requiredSkills.filter(s => studentSkills.some(st => st.includes(s) || s.includes(st)));
      const missing = requiredSkills.filter(s => !studentSkills.some(st => st.includes(s) || s.includes(st)));
      
      const skillsPercentage = requiredSkills.length > 0 ? Math.round((matched.length / requiredSkills.length) * 100) : 80;
      const cgpa = Number(studentProfile.cgpa) || 8.0;
      const minCgpa = Number(jobDetails.min_cgpa) || 6.5;
      const academicMatch = cgpa >= minCgpa ? 100 : Math.max(50, Math.round((cgpa / minCgpa) * 90));
      const overall = Math.round((skillsPercentage * 0.7) + (academicMatch * 0.3));

      return res.json({
        overallScore: Math.min(98, Math.max(45, overall)),
        skillsMatchScore: skillsPercentage,
        academicMatchScore: academicMatch,
        matchingSkills: matched,
        missingSkills: missing,
        recommendationVerdict: overall >= 75 ? 'Strong Match – Highly Recommended to Apply' : 'Moderate Match – Review Skill Gaps',
        explanation: `Candidate possesses ${matched.length} of ${requiredSkills.length} required skill competencies with CGPA (${cgpa}) ${cgpa >= minCgpa ? 'satisfying' : 'below'} the ${minCgpa} cutoff.`,
        suggestedActionItems: [
          missing.length > 0 ? `Brush up on ${missing.slice(0, 2).join(' and ')} fundamentals before interview round` : 'Prepare STAR stories on past portfolio projects',
          'Review company recent products and engineering blog'
        ]
      });
    }

    const prompt = `Compare this student profile against the job vacancy requirements. Be transparent and honest.
Student Profile:
- Branch: ${studentProfile.branch || 'CSE'}
- CGPA: ${studentProfile.cgpa || 8.0}
- Skills: ${(studentProfile.skills || []).join(', ')}
- Resume Snippet: ${(studentProfile.resume_text || '').slice(0, 1500)}

Job Vacancy:
- Title: ${jobDetails.title}
- Company: ${jobDetails.company_name}
- Cutoff CGPA: ${jobDetails.min_cgpa}
- Required Skills: ${(jobDetails.required_skills || []).join(', ')}
- Description: ${(jobDetails.description || '').slice(0, 1000)}

Respond ONLY in JSON with schema:
{
  "overallScore": number (0-100),
  "skillsMatchScore": number (0-100),
  "academicMatchScore": number (0-100),
  "matchingSkills": string[],
  "missingSkills": string[],
  "recommendationVerdict": string,
  "explanation": string (clear summary of why they do or do not match),
  "suggestedActionItems": string[] (2-3 concrete steps candidate should take)
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/ai/job-match:', error);
    return res.status(500).json({ error: error.message || 'Failed to compute job match' });
  }
});

// 3. Mock Interview Question Generation & Answer Feedback
app.post('/api/ai/interview/generate-questions', async (req: Request, res: Response) => {
  try {
    const { roleTitle = 'Software Engineer', round = 'Technical', difficulty = 'Medium' } = req.body;

    if (!ai) {
      return res.json({
        questions: [
          {
            id: 'q-1',
            question: `Explain how indexing works in relational databases like PostgreSQL. How would you diagnose and optimize a slow-running query in a production application?`,
            category: 'Technical',
            expectedConcepts: ['B-Tree Indexes', 'EXPLAIN ANALYZE', 'Sequential Scan vs Index Scan', 'Composite Index Column Order'],
            sampleStarAnswer: 'When diagnosing a slow query, I inspect EXPLAIN ANALYZE to identify sequential scans, evaluate selectivity on filter columns, and create composite B-tree indexes matching query WHERE and JOIN criteria while monitoring write performance overhead.'
          },
          {
            id: 'q-2',
            question: `Describe the difference between server-side rendering (SSR), client-side rendering (CSR), and static site generation (SSG) in modern web development. When would you pick each?`,
            category: 'Technical',
            expectedConcepts: ['First Contentful Paint (FCP)', 'SEO Crawlability', 'Server Overhead', 'Hydration', 'Cacheability'],
            sampleStarAnswer: 'I evaluate rendering based on dynamism and SEO. Marketing and e-commerce product pages benefit from SSG or SSR for sub-second FCP and search ranking, whereas authenticated internal dashboards leverage CSR with cached API endpoints.'
          },
          {
            id: 'q-3',
            question: `Tell me about a time when you disagreed with a teammate on an architectural or code decision. How did you resolve the conflict?`,
            category: 'Behavioral',
            expectedConcepts: ['Active Listening', 'Objective Benchmarking / POCs', 'Team Alignment', 'No Ego / Blameless Posture'],
            sampleStarAnswer: 'In our capstone project, our team debated between GraphQL and REST. Rather than arguing, I proposed creating a 1-day benchmark testing network payloads on mobile latency, which objectively revealed REST was 40% faster for our payload shapes.'
          }
        ]
      });
    }

    const prompt = `Generate 3 realistic campus placement interview questions for the role "${roleTitle}" (${round} Round, ${difficulty} level).
Include both in-depth technical inquiry and behavioral assessment.
Respond ONLY in JSON with schema:
{
  "questions": [
    {
      "id": string,
      "question": string,
      "category": "Technical" | "HR" | "System Design" | "Behavioral",
      "expectedConcepts": string[],
      "sampleStarAnswer": string
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error generating questions:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate interview questions' });
  }
});

app.post('/api/ai/interview/evaluate-answer', async (req: Request, res: Response) => {
  try {
    const { question, answer, category = 'Technical' } = req.body;
    if (!question || !answer || answer.trim().length < 10) {
      return res.status(400).json({ error: 'Please provide both the question and your answer.' });
    }

    if (!ai) {
      return res.json({
        score: 85,
        starMethodCompliance: 'Satisfactory',
        depthRating: 'Deep',
        positives: [
          'Directly addressed the core technical dilemma asked in the question',
          'Mentioned relevant concrete tools and real trade-offs',
          'Good logical flow from problem statement to resolution'
        ],
        critique: [
          'Could quantify the results more explicitly (e.g. latency numbers, team velocity)',
          'Elaborate on edge cases or failure modes'
        ],
        improvedAnswerModel: `To make this response top-tier, anchor it in the STAR format: "Situation: Our API response time spiked to 1.8s under peak load. Task: I was responsible for optimizing the database throughput. Action: I used EXPLAIN ANALYZE, added targeted composite indexes on user_id and created_at, and introduced Redis caching. Result: p95 latency dropped by 62% to 220ms with zero downtime."`
      });
    }

    const prompt = `You are a Senior Interviewer evaluating a candidate's answer for a placement interview.
Question: "${question}"
Category: "${category}"
Candidate's Answer:
"""
${answer.slice(0, 3000)}
"""

Evaluate the response objectively. Evaluate technical depth, structure (STAR framework for behavioral, conceptual clarity for technical), and communication.
Respond ONLY in JSON with schema:
{
  "score": number (0-100),
  "starMethodCompliance": "Excellent" | "Satisfactory" | "Needs Structure",
  "depthRating": "Deep" | "Moderate" | "Superficial",
  "positives": string[] (2-4 concrete strengths),
  "critique": string[] (2-3 constructive recommendations),
  "improvedAnswerModel": string (an exemplary, polished version demonstrating how to ace this question)
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error evaluating answer:', error);
    return res.status(500).json({ error: error.message || 'Failed to evaluate answer' });
  }
});

// 4. Skill Gap Analysis & Learning Roadmap
app.post('/api/ai/skill-gap', async (req: Request, res: Response) => {
  try {
    const { currentSkills = [], targetRole = 'Full Stack Cloud Engineer' } = req.body;

    if (!ai) {
      return res.json({
        targetRole,
        currentMatchPercentage: 70,
        acquiredSkills: currentSkills,
        criticalMissingSkills: ['System Design & Scalability', 'Docker & Containerization', 'Automated CI/CD Workflows', 'Redis Caching'],
        niceToHaveSkills: ['Kubernetes', 'GraphQL', 'AWS Lambda Serverless'],
        marketDemandTrend: 'High Growth: 84% of campus software engineering openings require full-stack capability with containerization experience.',
        learningRoadmap: [
          {
            week: 1,
            title: 'Foundations & Database Indexing Mastery',
            description: 'Master relational schema design, ACID transactions, complex JOINs, and PostgreSQL query profiling.',
            milestone: 'Design a normalized e-commerce database with sub-50ms indexed search queries.',
            recommendedResources: ['PostgreSQL Official Documentation', 'Use The Index, Luke! Guide']
          },
          {
            week: 2,
            title: 'Containerization & Docker Orchestration',
            description: 'Containerize multi-container web apps with Dockerfile best practices and multi-stage builds.',
            milestone: 'Deploy a multi-container app with frontend, backend, and PostgreSQL using Docker Compose.',
            recommendedResources: ['Docker Getting Started Tutorial', 'FreeCodeCamp Docker for Beginners']
          },
          {
            week: 3,
            title: 'High Performance & Caching Patterns',
            description: 'Integrate Redis for session storage, cache-aside pattern, and rate limiting.',
            milestone: 'Implement token bucket rate limiting on Express API with Redis cache invalidation.',
            recommendedResources: ['Redis University Course', 'System Design Primer (GitHub)']
          },
          {
            week: 4,
            title: 'Mock Interview Drills & Capstone Polish',
            description: 'Conduct peer code reviews, practice STAR behavioral questions, and deploy live portfolio demo.',
            milestone: 'Publish complete project to GitHub with README architecture diagram and CI/CD tests.',
            recommendedResources: ['LeetCode Top Interview 150', 'HireReady AI Interview Simulator']
          }
        ]
      });
    }

    const prompt = `Analyze skill gaps for a university student targeting the role "${targetRole}".
Current Student Skills: ${currentSkills.join(', ') || 'React, JavaScript, HTML, CSS, Basic Python'}

Generate an honest breakdown of what's missing and construct a realistic 4-week step-by-step learning roadmap with milestones.
Respond ONLY in JSON with schema:
{
  "targetRole": string,
  "currentMatchPercentage": number (0-100),
  "acquiredSkills": string[],
  "criticalMissingSkills": string[],
  "niceToHaveSkills": string[],
  "marketDemandTrend": string (current industry hiring trend insight),
  "learningRoadmap": [
    {
      "week": number,
      "title": string,
      "description": string,
      "milestone": string,
      "recommendedResources": string[]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error analyzing skill gap:', error);
    return res.status(500).json({ error: error.message || 'Failed to analyze skill gap' });
  }
});

// 5. AI Career Assistant Chat
app.post('/api/ai/career-chat', async (req: Request, res: Response) => {
  try {
    const { messages = [] } = req.body;
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const lastMessage = messages[messages.length - 1]?.text || 'Hello';

    if (!ai) {
      return res.json({
        reply: `Here are key recommendations regarding "${lastMessage}":
1. Focus on deep project mastery over breadth: Recruiters in campus placements probe 2-3 deep architectural decisions in your GitHub projects.
2. Structure all behavioral answers using STAR (Situation, Task, Action, Result).
3. Ensure your CGPA stays above the 7.5 threshold to qualify for 90%+ of Tier-1 drive eligibility filters.
What specific company or topic would you like to prepare for next?`
      });
    }

    const systemInstruction = `You are "HireReady AI Advisor", a distinguished university placement mentor, career coach, and technical recruiter.
Your guidance is:
1. Honest, encouraging, and highly specific to campus recruitment, placement drives, software interviews, internships, and resume ATS optimization.
2. Structured with bullet points, actionable tips, and concrete examples.
3. Strict rule: NEVER guarantee job offers or claim you can fabricate credentials. Always emphasize genuine technical competence and ethical career preparation.`;

    const formattedHistory = messages.slice(0, -1).map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        ...formattedHistory,
        { role: 'user', parts: [{ text: lastMessage }] }
      ],
      config: {
        systemInstruction,
      }
    });

    return res.json({ reply: response.text });
  } catch (error: any) {
    console.error('Error in /api/ai/career-chat:', error);
    return res.status(500).json({ error: error.message || 'Failed to generate career advice' });
  }
});

// System Health & Configuration Endpoint
app.get('/api/system-status', (_req: Request, res: Response) => {
  res.json({
    status: 'online',
    geminiEnabled: Boolean(apiKey),
    supabaseConfigured: Boolean(process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY),
    timestamp: new Date().toISOString()
  });
});

// ==========================================
// VITE DEV SERVER OR STATIC PRODUCTION
// ==========================================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HireReady AI Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
