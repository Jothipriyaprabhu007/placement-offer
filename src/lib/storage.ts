import { 
  UserProfile, 
  Job, 
  Application, 
  PlacementDrive, 
  Interview, 
  Offer, 
  NotificationItem, 
  Announcement, 
  AuditLog, 
  Company,
  UserRole
} from '../types';
import { 
  INITIAL_PROFILES, 
  INITIAL_COMPANIES, 
  INITIAL_JOBS, 
  INITIAL_APPLICATIONS, 
  INITIAL_DRIVES, 
  INITIAL_INTERVIEWS, 
  INITIAL_OFFERS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_ANNOUNCEMENTS, 
  INITIAL_AUDIT_LOGS 
} from './mockData';

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'hireready_current_user_id',
  PROFILES: 'hireready_profiles',
  COMPANIES: 'hireready_companies',
  JOBS: 'hireready_jobs',
  APPLICATIONS: 'hireready_applications',
  SAVED_JOBS: 'hireready_saved_jobs',
  DRIVES: 'hireready_drives',
  INTERVIEWS: 'hireready_interviews',
  OFFERS: 'hireready_offers',
  NOTIFICATIONS: 'hireready_notifications',
  ANNOUNCEMENTS: 'hireready_announcements',
  AUDIT_LOGS: 'hireready_audit_logs',
};

// Safe localStorage access
function getFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (e) {
    console.error(`Error reading ${key} from storage:`, e);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event('hireready_storage_update'));
  } catch (e) {
    console.error(`Error saving ${key} to storage:`, e);
  }
}

export const DataStore = {
  // Profiles
  getProfiles(): UserProfile[] {
    return getFromStorage<UserProfile[]>(STORAGE_KEYS.PROFILES, INITIAL_PROFILES);
  },
  
  saveProfile(profile: UserProfile): void {
    const profiles = this.getProfiles();
    const index = profiles.findIndex(p => p.id === profile.id);
    if (index >= 0) {
      profiles[index] = { ...profiles[index], ...profile, updated_at: new Date().toISOString() };
    } else {
      profiles.push({ ...profile, created_at: new Date().toISOString() });
    }
    saveToStorage(STORAGE_KEYS.PROFILES, profiles);
  },

  getCurrentUser(): UserProfile {
    const currentId = getFromStorage<string | null>(STORAGE_KEYS.CURRENT_USER_ID, null);
    const profiles = this.getProfiles();
    if (currentId) {
      const found = profiles.find(p => p.id === currentId);
      if (found) return found;
    }

    // Check if there is an existing student profile
    const student = profiles.find(p => p.role === 'student');
    if (student) {
      this.setCurrentUser(student.id);
      return student;
    }

    // Default to a new student needing profile setup
    const newStudent: UserProfile = {
      id: `usr-student-${Date.now()}`,
      role: 'student',
      full_name: '',
      email: '',
      status: 'active',
      is_profile_completed: false,
      created_at: new Date().toISOString()
    };
    this.saveProfile(newStudent);
    this.setCurrentUser(newStudent.id);
    return newStudent;
  },

  setCurrentUser(userId: string): void {
    saveToStorage(STORAGE_KEYS.CURRENT_USER_ID, userId);
  },

  isStudentProfileComplete(profile?: UserProfile | null): boolean {
    if (!profile) return false;
    if (profile.role !== 'student') return true;
    return Boolean(
      profile.is_profile_completed &&
      profile.full_name?.trim() &&
      (profile.student_id?.trim() || profile.college_id?.trim()) &&
      profile.college_name?.trim() &&
      (profile.department?.trim() || profile.branch?.trim()) &&
      profile.email?.trim() &&
      profile.phone?.trim() &&
      typeof profile.cgpa === 'number' &&
      profile.cgpa >= 0
    );
  },

  switchRole(role: UserRole): UserProfile {
    const profiles = this.getProfiles();
    const matching = profiles.find(p => p.role === role);
    if (matching) {
      this.setCurrentUser(matching.id);
      return matching;
    }

    if (role === 'student') {
      const freshStudent: UserProfile = {
        id: `usr-student-${Date.now()}`,
        role: 'student',
        full_name: '',
        email: '',
        status: 'active',
        is_profile_completed: false,
        created_at: new Date().toISOString()
      };
      this.saveProfile(freshStudent);
      this.setCurrentUser(freshStudent.id);
      return freshStudent;
    }

    return this.getCurrentUser();
  },

  // Companies
  getCompanies(): Company[] {
    return getFromStorage<Company[]>(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
  },

  updateCompanyStatus(companyId: string, status: 'verified' | 'rejected' | 'pending'): void {
    const companies = this.getCompanies();
    const target = companies.find(c => c.id === companyId);
    if (target) {
      target.verification_status = status;
      saveToStorage(STORAGE_KEYS.COMPANIES, companies);
      this.addAuditLog('UPDATED_COMPANY_VERIFICATION', 'COMPANY', companyId, { status });
    }
  },

  // Jobs
  getJobs(): Job[] {
    return getFromStorage<Job[]>(STORAGE_KEYS.JOBS, INITIAL_JOBS);
  },

  getJobById(jobId: string): Job | undefined {
    return this.getJobs().find(j => j.id === jobId);
  },

  createJob(jobData: Omit<Job, 'id' | 'created_at' | 'applicant_count'>): Job {
    const jobs = this.getJobs();
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      created_at: new Date().toISOString(),
      applicant_count: 0
    };
    jobs.unshift(newJob);
    saveToStorage(STORAGE_KEYS.JOBS, jobs);
    this.addAuditLog('CREATED_JOB', 'JOB', newJob.id, { title: newJob.title });
    return newJob;
  },

  updateJob(jobId: string, updates: Partial<Job>): void {
    const jobs = this.getJobs();
    const index = jobs.findIndex(j => j.id === jobId);
    if (index >= 0) {
      jobs[index] = { ...jobs[index], ...updates };
      saveToStorage(STORAGE_KEYS.JOBS, jobs);
    }
  },

  deleteJob(jobId: string): void {
    const jobs = this.getJobs().filter(j => j.id !== jobId);
    saveToStorage(STORAGE_KEYS.JOBS, jobs);
  },

  // Applications
  getApplications(): Application[] {
    return getFromStorage<Application[]>(STORAGE_KEYS.APPLICATIONS, INITIAL_APPLICATIONS);
  },

  applyForJob(jobId: string, student: UserProfile, coverNote: string, matchScore = 85): Application {
    const applications = this.getApplications();
    const job = this.getJobById(jobId);
    
    // Check if already applied
    const existing = applications.find(a => a.job_id === jobId && a.student_id === student.id);
    if (existing) {
      return existing;
    }

    const newApp: Application = {
      id: `app-${Date.now()}`,
      job_id: jobId,
      job_title: job?.title || 'Engineering Role',
      company_name: job?.company_name || 'Hiring Partner',
      student_id: student.id,
      student_name: student.full_name,
      student_email: student.email,
      student_branch: student.branch,
      student_cgpa: student.cgpa,
      student_resume_url: student.resume_url,
      status: 'applied',
      cover_note: coverNote,
      match_score: matchScore,
      applied_at: new Date().toISOString()
    };

    applications.unshift(newApp);
    saveToStorage(STORAGE_KEYS.APPLICATIONS, applications);

    // Update job applicant count
    if (job) {
      this.updateJob(jobId, { applicant_count: (job.applicant_count || 0) + 1 });
    }

    // Notify recruiter & student
    this.addNotification({
      user_id: student.id,
      title: 'Application Submitted Successfully',
      message: `Your application for ${job?.title} at ${job?.company_name} has been received.`,
      type: 'application'
    });

    this.addAuditLog('APPLIED_FOR_JOB', 'APPLICATION', newApp.id, { jobId, studentId: student.id });
    return newApp;
  },

  updateApplicationStatus(appId: string, status: Application['status'], notes?: string): void {
    const apps = this.getApplications();
    const app = apps.find(a => a.id === appId);
    if (app) {
      app.status = status;
      if (notes) app.recruiter_notes = notes;
      app.updated_at = new Date().toISOString();
      saveToStorage(STORAGE_KEYS.APPLICATIONS, apps);

      // Notify candidate
      this.addNotification({
        user_id: app.student_id,
        title: `Application Status Updated: ${status.replace('_', ' ').toUpperCase()}`,
        message: `Your application for ${app.job_title} at ${app.company_name} is now: ${status.replace('_', ' ')}.`,
        type: 'application'
      });
      this.addAuditLog('UPDATED_APPLICATION_STATUS', 'APPLICATION', appId, { status });
    }
  },

  // Saved Jobs
  getSavedJobIds(studentId: string): string[] {
    const saved = getFromStorage<Record<string, string[]>>(STORAGE_KEYS.SAVED_JOBS, {});
    return saved[studentId] || [];
  },

  toggleSaveJob(studentId: string, jobId: string): boolean {
    const saved = getFromStorage<Record<string, string[]>>(STORAGE_KEYS.SAVED_JOBS, {});
    const list = saved[studentId] || [];
    const index = list.indexOf(jobId);
    let isSavedNow = false;
    if (index >= 0) {
      list.splice(index, 1);
      isSavedNow = false;
    } else {
      list.push(jobId);
      isSavedNow = true;
    }
    saved[studentId] = list;
    saveToStorage(STORAGE_KEYS.SAVED_JOBS, saved);
    return isSavedNow;
  },

  // Placement Drives
  getPlacementDrives(): PlacementDrive[] {
    return getFromStorage<PlacementDrive[]>(STORAGE_KEYS.DRIVES, INITIAL_DRIVES);
  },

  createPlacementDrive(driveData: Omit<PlacementDrive, 'id' | 'created_at' | 'registered_students_count'>): PlacementDrive {
    const drives = this.getPlacementDrives();
    const newDrive: PlacementDrive = {
      ...driveData,
      id: `drive-${Date.now()}`,
      registered_students_count: 0,
      created_at: new Date().toISOString()
    };
    drives.unshift(newDrive);
    saveToStorage(STORAGE_KEYS.DRIVES, drives);
    this.addAuditLog('CREATED_PLACEMENT_DRIVE', 'DRIVE', newDrive.id, { title: newDrive.title });
    return newDrive;
  },

  registerForDrive(driveId: string, studentId: string): void {
    const drives = this.getPlacementDrives();
    const drive = drives.find(d => d.id === driveId);
    if (drive) {
      drive.registered_students_count = (drive.registered_students_count || 0) + 1;
      saveToStorage(STORAGE_KEYS.DRIVES, drives);
      this.addNotification({
        user_id: studentId,
        title: 'Registered for Placement Drive',
        message: `You have successfully registered for the ${drive.title} on ${drive.drive_date}.`,
        type: 'drive'
      });
    }
  },

  // Interviews
  getInterviews(): Interview[] {
    return getFromStorage<Interview[]>(STORAGE_KEYS.INTERVIEWS, INITIAL_INTERVIEWS);
  },

  scheduleInterview(interviewData: Omit<Interview, 'id' | 'created_at' | 'status'>): Interview {
    const interviews = this.getInterviews();
    const newInt: Interview = {
      ...interviewData,
      id: `int-${Date.now()}`,
      status: 'scheduled',
      created_at: new Date().toISOString()
    };
    interviews.unshift(newInt);
    saveToStorage(STORAGE_KEYS.INTERVIEWS, interviews);

    // Also update application status
    this.updateApplicationStatus(newInt.application_id, 'interview_scheduled');

    // Notify candidate
    this.addNotification({
      user_id: newInt.student_id,
      title: `Interview Scheduled: ${newInt.round_type}`,
      message: `You have an interview with ${newInt.company_name} on ${new Date(newInt.scheduled_at).toLocaleString()}. Meeting link attached.`,
      type: 'interview'
    });

    return newInt;
  },

  // Offers
  getOffers(): Offer[] {
    return getFromStorage<Offer[]>(STORAGE_KEYS.OFFERS, INITIAL_OFFERS);
  },

  createOffer(offerData: Omit<Offer, 'id' | 'issued_at' | 'status'>): Offer {
    const offers = this.getOffers();
    const newOffer: Offer = {
      ...offerData,
      id: `off-${Date.now()}`,
      status: 'pending',
      issued_at: new Date().toISOString()
    };
    offers.unshift(newOffer);
    saveToStorage(STORAGE_KEYS.OFFERS, offers);

    this.updateApplicationStatus(newOffer.application_id, 'offered');
    this.addNotification({
      user_id: newOffer.student_id,
      title: 'Congratulations! Official Job Offer Extended',
      message: `${newOffer.company_name} has extended an offer for ${newOffer.role_title} (${newOffer.ctc_or_stipend}). Review details and respond.`,
      type: 'offer'
    });
    return newOffer;
  },

  respondToOffer(offerId: string, status: 'accepted' | 'declined'): void {
    const offers = this.getOffers();
    const offer = offers.find(o => o.id === offerId);
    if (offer) {
      offer.status = status;
      offer.responded_at = new Date().toISOString();
      saveToStorage(STORAGE_KEYS.OFFERS, offers);

      if (status === 'accepted') {
        // Mark student as placed
        const profiles = this.getProfiles();
        const student = profiles.find(p => p.id === offer.student_id);
        if (student) {
          student.is_placed = true;
          student.current_placement = `${offer.company_name} – ${offer.role_title} (${offer.ctc_or_stipend})`;
          this.saveProfile(student);
        }
      }
      this.addAuditLog('RESPONDED_TO_OFFER', 'OFFER', offerId, { status });
    }
  },

  // Notifications
  getNotifications(userId: string): NotificationItem[] {
    const all = getFromStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    return all.filter(n => n.user_id === userId);
  },

  addNotification(item: Omit<NotificationItem, 'id' | 'read' | 'created_at'>): void {
    const all = getFromStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    all.unshift({
      ...item,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      read: false,
      created_at: new Date().toISOString()
    });
    saveToStorage(STORAGE_KEYS.NOTIFICATIONS, all);
  },

  markNotificationRead(notificationId: string): void {
    const all = getFromStorage<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, INITIAL_NOTIFICATIONS);
    const target = all.find(n => n.id === notificationId);
    if (target) {
      target.read = true;
      saveToStorage(STORAGE_KEYS.NOTIFICATIONS, all);
    }
  },

  // Announcements
  getAnnouncements(): Announcement[] {
    return getFromStorage<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  },

  createAnnouncement(ann: Omit<Announcement, 'id' | 'created_at'>): Announcement {
    const announcements = this.getAnnouncements();
    const newAnn: Announcement = {
      ...ann,
      id: `ann-${Date.now()}`,
      created_at: new Date().toISOString()
    };
    announcements.unshift(newAnn);
    saveToStorage(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
    this.addAuditLog('CREATED_ANNOUNCEMENT', 'ANNOUNCEMENT', newAnn.id, { title: newAnn.title });
    return newAnn;
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return getFromStorage<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  addAuditLog(action: string, entityType: string, entityId: string, details: Record<string, any> = {}): void {
    const logs = this.getAuditLogs();
    const currentUser = this.getCurrentUser();
    logs.unshift({
      id: `aud-${Date.now()}`,
      actor_id: currentUser?.id,
      actor_email: currentUser?.email || 'system@hireready.ai',
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      created_at: new Date().toISOString()
    });
    // Keep max 200 logs
    if (logs.length > 200) logs.length = 200;
    saveToStorage(STORAGE_KEYS.AUDIT_LOGS, logs);
  },

  // Reset to initial state
  resetAllData(): void {
    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    window.dispatchEvent(new Event('hireready_storage_update'));
  }
};
