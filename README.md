# HireReady AI – Intelligent Job Matching and Student Placement Management System

HireReady AI is an enterprise-grade, centralized career intelligence and campus placement management platform. It unifies students, recruiters, and college placement directors (TPO) with server-verified administrator governance, Row Level Security (RLS), and Gemini 3.8 Flash AI features.

---

## 🌟 Key Features

### 1. Student Portal
- **Profile & Academics**: Manage cumulative CGPA, department, graduation batch, verified skills, and portfolio links.
- **AI Job Matching**: Transparent mathematical match scoring against stored vacancy criteria (skills match %, academic cutoff verification, and constructive rationale).
- **AI Resume Analyzer**: In-depth ATS compliance scoring, keyword gap diagnostics, and bullet point transformations (passive to quantified business impact).
- **AI Technical & HR Mock Interview**: Role-specific question generation and automated answer evaluation with STAR method scoring and benchmark model answers.
- **Personalized Skill Gap Roadmaps**: 4-week step-by-step learning milestones with recommended resources to unlock higher compensation brackets.
- **Application Tracking Pipeline**: Real-time status tracker (`applied` → `under_review` → `shortlisted` → `interview_scheduled` → `offered`).
- **Official Offer Acceptance**: Review compensation packages, bond terms, and record formal acceptance.

### 2. Recruiter / Company Portal
- **Employer Profile & Verification**: Verified corporate badge status.
- **Vacancy Builder**: Post full-time and pre-placement internship openings with cutoff CGPA, eligible departments, batch year, and skill requirements.
- **Candidate Pipeline**: Filter applicants by job vacancy, status, and match score; view verified student credentials.
- **Integrated Interview Scheduler**: Set up assessment rounds (Technical 1/2, Coding, HR) with direct video meeting links.
- **Offer Management**: Issue formal job offer letters with fixed/variable CTC breakdown and track student responses.

### 3. College Placement Officer (TPO) Portal
- **Student Placement Directory**: Multi-department student database filterable by CGPA and placement status.
- **CSV Data Export**: One-click export of complete graduating cohort records for university compliance audits.
- **Campus Placement Drives**: Organize corporate visits, audit eligibility cutoffs, and broadcast real-time notifications to eligible students with one click.
- **Institutional Analytics**: Real-time tracking of placement percentages, average CTC, and top recruiting companies.

### 4. Administrator Console
- **Platform Overview**: System-wide telemetry (Total Students, Recruiters, Companies, Active Jobs, and Applications).
- **Security & RBAC Enforcement**: Server-side authorized administrator privileges (users cannot self-assign admin roles during signup).
- **Job Posting Moderation**: Moderate, flag, or remove fraudulent or unapproved job listings.
- **Employer Verification Queue**: Verify corporate credentials and business domains.
- **User Account Suspension & Reactivation**: Audit and manage student, recruiter, and TPO accounts.
- **Security Audit Logs**: Immutable system ledger recording every administrative and operational action with CSV export.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Icons & Motion**: Lucide React, Motion
- **AI Engine**: Google GenAI SDK (`@google/genai`) using `gemini-3.8-flash`
- **Database & Storage**: PostgreSQL relational schema with Supabase Auth & Storage integration (includes automated offline/demo fallback store)
- **Server**: Express with Vite middleware in development (`tsx server.ts`)

---

## ⚙️ Environment Variables

Create a `.env` file in the project root:

```env
# Gemini API Key (Required for AI Resume Audit, Mock Interviews, Match Scoring, and Career Assistant)
GEMINI_API_KEY="your-gemini-api-key"

# App URL (Self-referential URL for dev/production)
APP_URL="http://localhost:3000"

# Supabase Configuration (Optional - falls back to robust local demo store if omitted)
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-public-key"
SUPABASE_SERVICE_ROLE_KEY="your-supabase-service-role-key"
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Database Migration (Supabase PostgreSQL)
Copy the SQL migration from `supabase/schema.sql` and run it in your Supabase SQL Editor. This provisions all tables, foreign keys, indexes, triggers, and Row Level Security (RLS) policies.

### 3. Run Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🚢 Deployment Instructions

### GitHub Synchronization
1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: HireReady AI Platform"
   ```
2. Push to your GitHub repository:
   ```bash
   git remote add origin https://github.com/your-username/hireready-ai.git
   git branch -M main
   git push -u origin main
   ```

### Vercel Deployment
1. Import the repository in [Vercel](https://vercel.com).
2. Set Environment Variables:
   - `GEMINI_API_KEY`
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Build Command: `npm run build`
4. Output Directory: `dist`
5. Click **Deploy**.

---

## 🔒 Security Architecture

1. **Row Level Security (RLS)**: Applied to all private tables (`profiles`, `applications`, `saved_jobs`, `offers`, `notifications`).
2. **Server-Side AI Secrets**: The `GEMINI_API_KEY` and Supabase service-role keys reside exclusively on the server (`server.ts`) and are never leaked to client bundles.
3. **Admin Privilege Isolation**: Administrator roles can only be granted via trusted server-side procedures; registration forms explicitly forbid self-assigning administrator access.
