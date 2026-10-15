-- ==============================================================================
-- HireReady AI – Intelligent Job Matching and Student Placement Management System
-- Complete PostgreSQL / Supabase Schema with Row Level Security (RLS) & Policies
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_user_id UUID UNIQUE, -- linked to auth.users if Supabase Auth is enabled
    role TEXT NOT NULL CHECK (role IN ('student', 'recruiter', 'placement_officer', 'admin')),
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    status TEXT CHECK (status IN ('active', 'suspended', 'pending_verification')) DEFAULT 'active',
    
    -- Student Profile specific fields
    college_id TEXT,
    college_name TEXT DEFAULT 'Apex Institute of Technology & Engineering',
    branch TEXT,
    batch_year INTEGER,
    cgpa NUMERIC(3, 2),
    backlogs INTEGER DEFAULT 0,
    resume_url TEXT,
    resume_filename TEXT,
    resume_text TEXT,
    skills TEXT[] DEFAULT '{}',
    github_url TEXT,
    linkedin_url TEXT,
    portfolio_url TEXT,
    is_placed BOOLEAN DEFAULT false,
    current_placement TEXT,

    -- Recruiter specific fields
    company_id UUID,
    designation TEXT,
    company_name TEXT,

    -- Placement Officer specific fields
    department TEXT,
    employee_code TEXT,

    -- Admin specific fields
    is_superadmin BOOLEAN DEFAULT false,

    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. COMPANIES TABLE
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    website TEXT,
    logo_url TEXT,
    industry TEXT NOT NULL,
    size TEXT,
    description TEXT,
    location TEXT,
    verification_status TEXT CHECK (verification_status IN ('pending', 'verified', 'rejected')) DEFAULT 'verified',
    verification_docs TEXT[] DEFAULT '{}',
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Link profile.company_id foreign key
ALTER TABLE public.profiles 
    ADD CONSTRAINT fk_profile_company 
    FOREIGN KEY (company_id) 
    REFERENCES public.companies(id) 
    ON DELETE SET NULL;

-- 3. JOBS TABLE
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    recruiter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    type TEXT CHECK (type IN ('full-time', 'internship', 'contract')) DEFAULT 'full-time',
    location TEXT NOT NULL,
    work_mode TEXT CHECK (work_mode IN ('on-site', 'hybrid', 'remote')) DEFAULT 'on-site',
    salary_range TEXT NOT NULL,
    min_cgpa NUMERIC(3, 2) DEFAULT 6.0,
    eligible_branches TEXT[] DEFAULT ARRAY['Computer Science', 'Information Technology', 'Electronics & Comm'],
    batch_year INTEGER DEFAULT 2026,
    required_skills TEXT[] DEFAULT '{}',
    deadline DATE,
    openings INTEGER DEFAULT 5,
    status TEXT CHECK (status IN ('active', 'draft', 'closed', 'flagged')) DEFAULT 'active',
    is_reported BOOLEAN DEFAULT false,
    report_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    status TEXT CHECK (status IN ('applied', 'under_review', 'shortlisted', 'interview_scheduled', 'offered', 'rejected')) DEFAULT 'applied',
    cover_note TEXT,
    resume_url TEXT,
    match_score INTEGER DEFAULT 75,
    match_breakdown JSONB DEFAULT '{}',
    recruiter_notes TEXT,
    applied_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(job_id, student_id)
);

-- 5. SAVED JOBS TABLE
CREATE TABLE IF NOT EXISTS public.saved_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(student_id, job_id)
);

-- 6. SKILLS TAXONOMY
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    category TEXT NOT NULL
);

-- 7. PLACEMENT DRIVES TABLE
CREATE TABLE IF NOT EXISTS public.placement_drives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    company_name TEXT NOT NULL,
    company_id UUID REFERENCES public.companies(id) ON DELETE SET NULL,
    drive_date DATE NOT NULL,
    min_cgpa NUMERIC(3, 2) DEFAULT 6.5,
    eligible_branches TEXT[] DEFAULT ARRAY['Computer Science', 'Information Technology'],
    batch_year INTEGER NOT NULL DEFAULT 2026,
    package_ctc TEXT NOT NULL,
    description TEXT,
    venue TEXT DEFAULT 'Campus Auditorium / Virtual Google Meet',
    status TEXT CHECK (status IN ('upcoming', 'ongoing', 'completed', 'cancelled')) DEFAULT 'upcoming',
    created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    registered_students_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 8. INTERVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.interviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    recruiter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    round_type TEXT CHECK (round_type IN ('Technical Round 1', 'Technical Round 2', 'Coding Assessment', 'Managerial', 'HR Round')) DEFAULT 'Technical Round 1',
    scheduled_at TIMESTAMPTZ NOT NULL,
    meeting_link TEXT,
    status TEXT CHECK (status IN ('scheduled', 'completed', 'rescheduled', 'cancelled')) DEFAULT 'scheduled',
    interviewer_name TEXT,
    feedback_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 9. OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    ctc_or_stipend TEXT NOT NULL,
    role_title TEXT NOT NULL,
    joining_date DATE,
    bond_details TEXT DEFAULT 'No bond / standard 30-day notice period',
    offer_letter_url TEXT,
    status TEXT CHECK (status IN ('pending', 'accepted', 'declined', 'revoked')) DEFAULT 'pending',
    issued_at TIMESTAMPTZ DEFAULT now(),
    responded_at TIMESTAMPTZ
);

-- 10. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT CHECK (type IN ('application', 'interview', 'offer', 'drive', 'system')) DEFAULT 'system',
    read BOOLEAN DEFAULT false,
    action_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 11. ANNOUNCEMENTS TABLE
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target_audience TEXT CHECK (target_audience IN ('all', 'students', 'recruiters', 'placement_officers')) DEFAULT 'all',
    priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    author_name TEXT DEFAULT 'Placement Cell Administrator',
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 12. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_email TEXT,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT,
    details JSONB DEFAULT '{}',
    ip_address TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 13. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_jobs_status ON public.jobs(status);
CREATE INDEX IF NOT EXISTS idx_jobs_company_id ON public.jobs(company_id);
CREATE INDEX IF NOT EXISTS idx_applications_job ON public.applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_student ON public.applications(student_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_placement_drives_date ON public.placement_drives(drive_date);
CREATE INDEX IF NOT EXISTS idx_interviews_student ON public.interviews(student_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placement_drives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE auth_user_id = auth.uid() AND role = 'admin' AND status = 'active'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Profiles: Users can read public profile summaries, update their own profile; admins can manage all
CREATE POLICY "Public profiles read" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Self update profile" ON public.profiles FOR UPDATE USING (auth_user_id = auth.uid() OR public.is_admin());

-- Jobs: Anyone can read active jobs; Recruiters can manage their company jobs; Admins can moderate all
CREATE POLICY "Public read active jobs" ON public.jobs FOR SELECT USING (status = 'active' OR public.is_admin());
CREATE POLICY "Recruiter manage company jobs" ON public.jobs FOR ALL USING (
    recruiter_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()) OR public.is_admin()
);

-- Applications: Students can view/create their own applications; Recruiters can view applications to their own company's jobs; TPOs & Admins have authorized access
CREATE POLICY "Student read own applications" ON public.applications FOR SELECT USING (
    student_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()) 
    OR job_id IN (SELECT id FROM public.jobs WHERE recruiter_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()))
    OR EXISTS (SELECT 1 FROM public.profiles WHERE auth_user_id = auth.uid() AND role IN ('placement_officer', 'admin'))
);
CREATE POLICY "Student apply" ON public.applications FOR INSERT WITH CHECK (
    student_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
);
CREATE POLICY "Recruiter update application status" ON public.applications FOR UPDATE USING (
    job_id IN (SELECT id FROM public.jobs WHERE recruiter_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid()))
    OR public.is_admin()
);

-- Saved jobs: Students manage their own
CREATE POLICY "Student saved jobs" ON public.saved_jobs FOR ALL USING (
    student_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
);

-- Offers: Student views own offer; Recruiter views issued offers; Placement officer and Admin view authorized
CREATE POLICY "Offers access" ON public.offers FOR SELECT USING (
    student_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
    OR company_id IN (SELECT company_id FROM public.profiles WHERE auth_user_id = auth.uid())
    OR EXISTS (SELECT 1 FROM public.profiles WHERE auth_user_id = auth.uid() AND role IN ('placement_officer', 'admin'))
);

-- Notifications: User reads only own notifications
CREATE POLICY "User notifications" ON public.notifications FOR ALL USING (
    user_id IN (SELECT id FROM public.profiles WHERE auth_user_id = auth.uid())
);
