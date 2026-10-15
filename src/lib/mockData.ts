import { 
  UserProfile, 
  Company, 
  Job, 
  Application, 
  PlacementDrive, 
  Interview, 
  Offer, 
  NotificationItem, 
  Announcement, 
  AuditLog 
} from '../types';

export const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'usr-recruiter-001',
    role: 'recruiter',
    full_name: 'Vikramaditya Roy',
    email: 'vikram.roy@technova.io',
    phone: '+91 99887 76655',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    company_id: 'comp-001',
    company_name: 'TechNova Solutions',
    designation: 'Head of University Talent Acquisition',
    created_at: '2025-11-05T09:00:00Z'
  },
  {
    id: 'usr-tpo-001',
    role: 'placement_officer',
    full_name: 'Dr. Meenakshi Sundaram',
    email: 'tpo@apex.edu',
    phone: '+91 94440 12345',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    department: 'Central Placement & Career Development Cell',
    employee_code: 'TPO-DIR-802',
    college_name: 'Apex Institute of Technology & Engineering',
    created_at: '2025-08-15T08:00:00Z'
  },
  {
    id: 'usr-admin-001',
    role: 'admin',
    full_name: 'System Administrator (Placement Board)',
    email: 'admin.hire@apex.edu',
    phone: '+91 90000 00001',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    status: 'active',
    is_superadmin: true,
    created_at: '2025-01-01T00:00:00Z'
  }
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-001',
    name: 'TechNova Solutions',
    website: 'https://technova.io',
    logo_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    industry: 'Enterprise Software & Cloud Platforms',
    size: '1,000 - 5,000 employees',
    description: 'TechNova delivers high-throughput cloud infrastructure and enterprise SaaS products for global fintech and healthcare leaders.',
    location: 'Bengaluru / Hyderabad, India',
    verification_status: 'verified',
    created_by: 'usr-recruiter-001',
    created_at: '2025-11-05T09:00:00Z'
  },
  {
    id: 'comp-002',
    name: 'Nexus Cloud Systems',
    website: 'https://nexuscloud.ai',
    logo_url: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&auto=format&fit=crop&q=80',
    industry: 'Artificial Intelligence & DevOps',
    size: '500 - 1,000 employees',
    description: 'Pioneering Kubernetes orchestration and agentic AI runtime systems for next-generation developer tooling.',
    location: 'Pune / Remote, India',
    verification_status: 'verified',
    created_at: '2025-12-01T10:00:00Z'
  },
  {
    id: 'comp-003',
    name: 'FinVantage Global',
    website: 'https://finvantage.com',
    logo_url: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&auto=format&fit=crop&q=80',
    industry: 'Financial Technology & Quantitative Trading',
    size: '5,000+ employees',
    description: 'Tier-1 quantitative investment technology firm building sub-millisecond execution engines and risk analytics.',
    location: 'Mumbai / Gurugram, India',
    verification_status: 'verified',
    created_at: '2025-10-15T08:00:00Z'
  },
  {
    id: 'comp-004',
    name: 'CyberShield Security',
    website: 'https://cybershield.sec',
    logo_url: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80',
    industry: 'Cybersecurity & Zero Trust Architecture',
    size: '200 - 500 employees',
    description: 'Autonomous security operation center (SOC) software and intrusion detection pipelines.',
    location: 'Bengaluru, India',
    verification_status: 'pending',
    created_at: '2026-02-01T14:00:00Z'
  }
];

export const INITIAL_JOBS: Job[] = [
  {
    id: 'job-001',
    company_id: 'comp-001',
    company_name: 'TechNova Solutions',
    company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    recruiter_id: 'usr-recruiter-001',
    title: 'Associate Software Engineer (Full Stack)',
    description: 'We are seeking passionate 2026 graduates to join our Core Engineering team. You will build high-traffic frontend user experiences using React and TypeScript, design RESTful microservices in Node.js/Go, and collaborate directly with product architects.',
    type: 'full-time',
    location: 'Bengaluru, India',
    work_mode: 'hybrid',
    salary_range: '₹10 LPA - ₹14 LPA',
    min_cgpa: 7.5,
    eligible_branches: ['Computer Science', 'Information Technology', 'Electronics & Comm'],
    batch_year: 2026,
    required_skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Git', 'Data Structures & Algorithms'],
    deadline: '2026-11-30',
    openings: 12,
    status: 'active',
    created_at: '2026-09-01T08:00:00Z',
    applicant_count: 0
  },
  {
    id: 'job-002',
    company_id: 'comp-002',
    company_name: 'Nexus Cloud Systems',
    company_logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&auto=format&fit=crop&q=80',
    recruiter_id: 'usr-recruiter-001',
    title: 'Cloud & DevOps Engineering Intern',
    description: '6-month pre-placement internship opportunity. Work hands-on with Docker containers, Kubernetes deployments, AWS cloud architecture, and CI/CD pipelines. PPO offered based on internship milestones.',
    type: 'internship',
    location: 'Pune / Remote',
    work_mode: 'remote',
    salary_range: '₹40,000 / month Stipend (PPO: ₹12 LPA)',
    min_cgpa: 7.0,
    eligible_branches: ['Computer Science', 'Information Technology', 'Electrical & Electronics'],
    batch_year: 2026,
    required_skills: ['Linux', 'Docker', 'AWS', 'Python', 'CI/CD', 'Bash'],
    deadline: '2026-11-20',
    openings: 6,
    status: 'active',
    created_at: '2026-09-10T11:00:00Z',
    applicant_count: 0
  },
  {
    id: 'job-003',
    company_id: 'comp-003',
    company_name: 'FinVantage Global',
    company_logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&auto=format&fit=crop&q=80',
    title: 'Quantitative Data Analyst',
    description: 'Analyze multi-terabyte market datasets, write low-latency SQL pipelines, and develop automated algorithmic validation dashboards using Python and Tableau.',
    type: 'full-time',
    location: 'Mumbai, India',
    work_mode: 'on-site',
    salary_range: '₹16 LPA - ₹20 LPA',
    min_cgpa: 8.0,
    eligible_branches: ['Computer Science', 'Information Technology', 'Mathematics & Computing'],
    batch_year: 2026,
    required_skills: ['Python', 'SQL', 'Data Analytics', 'Probability & Statistics', 'Pandas'],
    deadline: '2026-12-05',
    openings: 4,
    status: 'active',
    created_at: '2026-09-15T09:30:00Z',
    applicant_count: 0
  },
  {
    id: 'job-004',
    company_id: 'comp-001',
    company_name: 'TechNova Solutions',
    company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    recruiter_id: 'usr-recruiter-001',
    title: 'Frontend React Developer',
    description: 'Craft intuitive interfaces for our flagship analytics suite. Solid command of modern React, Tailwind CSS, component state management, and accessibility standards.',
    type: 'full-time',
    location: 'Bengaluru, India',
    work_mode: 'hybrid',
    salary_range: '₹9 LPA - ₹12 LPA',
    min_cgpa: 6.5,
    eligible_branches: ['All Engineering Branches'],
    batch_year: 2026,
    required_skills: ['React', 'JavaScript', 'HTML5/CSS3', 'Tailwind CSS', 'REST APIs'],
    deadline: '2026-11-25',
    openings: 8,
    status: 'active',
    created_at: '2026-09-20T14:00:00Z',
    applicant_count: 0
  },
  {
    id: 'job-005',
    company_id: 'comp-004',
    company_name: 'CyberShield Security',
    company_logo: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=120&auto=format&fit=crop&q=80',
    title: 'Cybersecurity Associate Analyst',
    description: 'Monitor threat alerts, perform vulnerability assessments, conduct penetration testing audits, and participate in incident response drills.',
    type: 'full-time',
    location: 'Bengaluru, India',
    work_mode: 'on-site',
    salary_range: '₹8 LPA - ₹11 LPA',
    min_cgpa: 7.0,
    eligible_branches: ['Computer Science', 'Information Technology', 'Cybersecurity'],
    batch_year: 2026,
    required_skills: ['Network Security', 'Linux', 'Wireshark', 'Python', 'OWASP Top 10'],
    deadline: '2026-12-15',
    openings: 5,
    status: 'active',
    created_at: '2026-09-22T10:00:00Z',
    applicant_count: 0
  }
];

export const INITIAL_APPLICATIONS: Application[] = [];

export const INITIAL_DRIVES: PlacementDrive[] = [
  {
    id: 'drive-001',
    title: 'TechNova Solutions – Campus Placement Drive 2026',
    company_name: 'TechNova Solutions',
    company_id: 'comp-001',
    company_logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    drive_date: '2026-11-04',
    min_cgpa: 7.5,
    eligible_branches: ['Computer Science', 'Information Technology', 'Electronics & Comm'],
    batch_year: 2026,
    package_ctc: '₹10.0 - ₹14.0 LPA',
    description: 'Comprehensive campus drive covering Online Coding Assessment, Technical Interviews, and HR discussions. Pre-placement talk will be held in the Main Auditorium at 9:30 AM.',
    venue: 'Campus Main Auditorium & Placement Computer Labs',
    status: 'upcoming',
    registered_students_count: 0,
    created_at: '2026-08-20T10:00:00Z'
  },
  {
    id: 'drive-002',
    title: 'FinVantage Global – Quantitative Technology Drive',
    company_name: 'FinVantage Global',
    company_id: 'comp-003',
    company_logo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=120&auto=format&fit=crop&q=80',
    drive_date: '2026-11-15',
    min_cgpa: 8.0,
    eligible_branches: ['Computer Science', 'Information Technology', 'Mathematics & Computing'],
    batch_year: 2026,
    package_ctc: '₹16.0 - ₹20.0 LPA',
    description: 'Hiring for high-frequency trading platforms and financial analytics teams. Includes advanced algorithmic challenges and statistical reasoning questions.',
    venue: 'Virtual Platform (HireReady Assessment Engine)',
    status: 'upcoming',
    registered_students_count: 0,
    created_at: '2026-08-25T14:00:00Z'
  },
  {
    id: 'drive-003',
    title: 'Nexus Cloud Systems – University Tech Day',
    company_name: 'Nexus Cloud Systems',
    company_id: 'comp-002',
    company_logo: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=120&auto=format&fit=crop&q=80',
    drive_date: '2026-10-28',
    min_cgpa: 7.0,
    eligible_branches: ['All Engineering Branches'],
    batch_year: 2026,
    package_ctc: '₹12.0 LPA (PPO)',
    description: 'Campus hackathon and recruitment round for cloud engineering and infrastructure interns.',
    venue: 'Seminar Hall 3',
    status: 'upcoming',
    registered_students_count: 0,
    created_at: '2026-09-01T09:00:00Z'
  }
];

export const INITIAL_INTERVIEWS: Interview[] = [];

export const INITIAL_OFFERS: Offer[] = [];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-001',
    title: 'Mandatory Placement Policy & Resume Verification Deadline',
    content: 'All graduating batch students must verify their official CGPA and complete their placement profile in HireReady AI. Accurate profile details are required to apply for active company drives.',
    target_audience: 'students',
    priority: 'high',
    author_name: 'Dr. Meenakshi Sundaram (Placement Director)',
    created_at: '2026-10-01T09:00:00Z'
  },
  {
    id: 'ann-002',
    title: 'HireReady AI Mock Interview & Skill Gap Analysis Now Live',
    content: 'Students can now practice role-specific technical and HR mock interviews powered by Gemini AI, receive instant STAR-method feedback, and generate custom learning roadmaps.',
    target_audience: 'all',
    priority: 'medium',
    author_name: 'Placement & Career Development Cell',
    created_at: '2026-10-05T10:00:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'aud-001',
    actor_id: 'usr-admin-001',
    actor_email: 'admin.hire@apex.edu',
    action: 'VERIFIED_COMPANY',
    entity_type: 'COMPANY',
    entity_id: 'comp-001',
    details: { company_name: 'TechNova Solutions', status: 'verified' },
    created_at: '2026-10-10T08:15:00Z'
  },
  {
    id: 'aud-002',
    actor_id: 'usr-tpo-001',
    actor_email: 'tpo@apex.edu',
    action: 'CREATED_PLACEMENT_DRIVE',
    entity_type: 'PLACEMENT_DRIVE',
    entity_id: 'drive-001',
    details: { title: 'TechNova Solutions – Campus Placement Drive 2026' },
    created_at: '2026-08-20T10:00:00Z'
  }
];
