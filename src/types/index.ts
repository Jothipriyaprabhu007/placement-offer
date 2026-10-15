export type UserRole = 'student' | 'recruiter' | 'placement_officer' | 'admin';

export type JobType = 'full-time' | 'internship' | 'contract';
export type WorkMode = 'on-site' | 'hybrid' | 'remote';
export type JobStatus = 'active' | 'draft' | 'closed' | 'flagged';
export type ApplicationStatus = 'applied' | 'under_review' | 'shortlisted' | 'interview_scheduled' | 'offered' | 'rejected';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';
export type DriveStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type InterviewRound = 'Technical Round 1' | 'Technical Round 2' | 'Coding Assessment' | 'Managerial' | 'HR Round';
export type InterviewStatus = 'scheduled' | 'completed' | 'rescheduled' | 'cancelled';
export type OfferStatus = 'pending' | 'accepted' | 'declined' | 'revoked';

export interface StudentProject {
  id: string;
  title: string;
  description: string;
  tech_stack: string;
  link?: string;
}

export interface StudentCertification {
  id: string;
  title: string;
  issuer: string;
  year: string;
}

export interface UserProfile {
  id: string;
  auth_user_id?: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  status: 'active' | 'suspended' | 'pending_verification';
  created_at: string;
  updated_at?: string;

  // Student specific details
  student_id?: string;
  college_name?: string;
  department?: string;
  degree_and_year?: string;
  graduation_year?: number;
  cgpa?: number;
  backlogs?: number;
  technical_skills?: string[];
  programming_languages?: string[];
  projects?: StudentProject[];
  certifications?: StudentCertification[];
  resume_url?: string;
  resume_filename?: string;
  resume_text?: string;
  is_profile_completed?: boolean;
  is_placed?: boolean;
  current_placement?: string;

  // Legacy student fields for backward compatibility
  college_id?: string;
  branch?: string;
  batch_year?: number;
  skills?: string[];
  github_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;

  // Recruiter details
  company_id?: string;
  company_name?: string;
  designation?: string;

  // Placement Officer details
  employee_code?: string;

  // Admin
  is_superadmin?: boolean;
}

export interface Company {
  id: string;
  name: string;
  website?: string;
  logo_url?: string;
  industry: string;
  size?: string;
  description: string;
  location: string;
  verification_status: VerificationStatus;
  verification_docs?: string[];
  created_by?: string;
  created_at: string;
}

export interface Job {
  id: string;
  company_id: string;
  company_name: string;
  company_logo?: string;
  recruiter_id?: string;
  title: string;
  description: string;
  type: JobType;
  location: string;
  work_mode: WorkMode;
  salary_range: string;
  min_cgpa: number;
  eligible_branches: string[];
  batch_year: number;
  required_skills: string[];
  deadline: string;
  openings: number;
  status: JobStatus;
  is_reported?: boolean;
  report_reason?: string;
  created_at: string;
  applicant_count?: number;
}

export interface Application {
  id: string;
  job_id: string;
  job_title: string;
  company_name: string;
  student_id: string;
  student_name: string;
  student_email: string;
  student_branch?: string;
  student_cgpa?: number;
  student_resume_url?: string;
  status: ApplicationStatus;
  cover_note?: string;
  resume_url?: string;
  match_score: number;
  match_breakdown?: {
    matchedSkills?: string[];
    missingSkills?: string[];
    summary?: string;
  };
  recruiter_notes?: string;
  applied_at: string;
  updated_at?: string;
}

export interface PlacementDrive {
  id: string;
  title: string;
  company_name: string;
  company_id?: string;
  company_logo?: string;
  drive_date: string;
  min_cgpa: number;
  eligible_branches: string[];
  batch_year: number;
  package_ctc: string;
  description: string;
  venue: string;
  status: DriveStatus;
  registered_students_count: number;
  created_by?: string;
  created_at: string;
}

export interface Interview {
  id: string;
  application_id: string;
  job_id: string;
  job_title: string;
  company_name: string;
  student_id: string;
  student_name: string;
  recruiter_id?: string;
  round_type: InterviewRound;
  scheduled_at: string;
  meeting_link?: string;
  status: InterviewStatus;
  interviewer_name?: string;
  feedback_notes?: string;
  created_at: string;
}

export interface Offer {
  id: string;
  application_id: string;
  student_id: string;
  student_name: string;
  company_id: string;
  company_name: string;
  job_id: string;
  role_title: string;
  ctc_or_stipend: string;
  joining_date: string;
  bond_details: string;
  offer_letter_url?: string;
  status: OfferStatus;
  issued_at: string;
  responded_at?: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'application' | 'interview' | 'offer' | 'drive' | 'system';
  read: boolean;
  action_url?: string;
  created_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  target_audience: 'all' | 'students' | 'recruiters' | 'placement_officers';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  author_name: string;
  author_id?: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id?: string;
  actor_email: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, any>;
  ip_address?: string;
  created_at: string;
}

export interface SystemStats {
  totalStudents: number;
  placedStudents: number;
  placementPercentage: number;
  totalRecruiters: number;
  totalCompanies: number;
  verifiedCompanies: number;
  activeJobs: number;
  totalApplications: number;
  averagePackage: string;
  highestPackage: string;
  upcomingDrivesCount: number;
}

// AI Feature Types
export interface ResumeAnalysisResult {
  score: number;
  atsReadiness: 'High' | 'Moderate' | 'Needs Improvement';
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingKeywords: string[];
  formattingSuggestions: string[];
  bulletPointRewrites: Array<{
    original: string;
    improved: string;
    impactExplanation: string;
  }>;
}

export interface JobMatchBreakdown {
  overallScore: number;
  skillsMatchScore: number;
  academicMatchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  recommendationVerdict: string;
  explanation: string;
  suggestedActionItems: string[];
}

export interface InterviewQuestionItem {
  id: string;
  question: string;
  category: 'Technical' | 'HR' | 'System Design' | 'Behavioral';
  expectedConcepts: string[];
  sampleStarAnswer: string;
}

export interface AnswerFeedback {
  score: number; // 0-100
  starMethodCompliance: 'Excellent' | 'Satisfactory' | 'Needs Structure';
  depthRating: 'Deep' | 'Moderate' | 'Superficial';
  positives: string[];
  critique: string[];
  improvedAnswerModel: string;
}

export interface SkillGapAnalysisResult {
  targetRole: string;
  currentMatchPercentage: number;
  acquiredSkills: string[];
  criticalMissingSkills: string[];
  niceToHaveSkills: string[];
  marketDemandTrend: string;
  learningRoadmap: Array<{
    week: number;
    title: string;
    description: string;
    milestone: string;
    recommendedResources: string[];
  }>;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
