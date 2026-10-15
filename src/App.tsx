import React, { useState, useEffect } from 'react';
import { UserProfile, UserRole } from './types';
import { DataStore } from './lib/storage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';

// Public pages
import { LandingPage } from './pages/public/LandingPage';
import { FindJobsPage } from './pages/public/FindJobsPage';
import { AICareerAssistantPage } from './pages/public/AICareerAssistantPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';

// Student pages
import { StudentDashboard } from './pages/student/StudentDashboard';
import { StudentApplications } from './pages/student/StudentApplications';
import { AIResumeAnalyzer } from './pages/student/AIResumeAnalyzer';
import { AIMockInterview } from './pages/student/AIMockInterview';
import { AISkillGapRoadmap } from './pages/student/AISkillGapRoadmap';
import { StudentDrives } from './pages/student/StudentDrives';
import { StudentOffers } from './pages/student/StudentOffers';
import { StudentProfilePage } from './pages/student/StudentProfile';
import { StudentProfileSetup } from './pages/student/StudentProfileSetup';

// Recruiter pages
import { RecruiterDashboard } from './pages/recruiter/RecruiterDashboard';
import { JobPostBuilder } from './pages/recruiter/JobPostBuilder';
import { ApplicantsPipeline } from './pages/recruiter/ApplicantsPipeline';

// TPO pages
import { TPODashboard } from './pages/tpo/TPODashboard';
import { StudentPlacementDirectory } from './pages/tpo/StudentPlacementDirectory';
import { DriveManagement } from './pages/tpo/DriveManagement';

// Admin pages
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { JobModeration } from './pages/admin/JobModeration';
import { UserManagement } from './pages/admin/UserManagement';
import { AuditLogsPage } from './pages/admin/AuditLogsPage';

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(DataStore.getCurrentUser());
  const [currentView, setCurrentView] = useState<string>('home');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [notificationsOpen, setNotificationsOpen] = useState<boolean>(false);
  const [notifications, setNotifications] = useState(DataStore.getNotifications(currentUser.id));

  // Sync state when storage changes
  useEffect(() => {
    const handleStorageUpdate = () => {
      const freshUser = DataStore.getCurrentUser();
      setCurrentUser(freshUser);
      setNotifications(DataStore.getNotifications(freshUser.id));
    };

    window.addEventListener('hireready_storage_update', handleStorageUpdate);
    return () => window.removeEventListener('hireready_storage_update', handleStorageUpdate);
  }, []);

  // Redirection guard: When a user is in the Student role and has not completed profile setup,
  // guide them to the profile setup form instead of inner portal dashboards
  useEffect(() => {
    if (currentUser.role === 'student' && !DataStore.isStudentProfileComplete(currentUser)) {
      const studentPortalViews = [
        'student-dashboard',
        'student-applications',
        'student-saved-jobs',
        'student-drives',
        'student-resume-analyzer',
        'student-mock-interview',
        'student-skill-gap',
        'student-offers'
      ];
      if (studentPortalViews.includes(currentView)) {
        setCurrentView('student-profile-setup');
      }
    }
  }, [currentUser, currentView]);

  const refreshUserData = () => {
    const freshUser = DataStore.getCurrentUser();
    setCurrentUser(freshUser);
    setNotifications(DataStore.getNotifications(freshUser.id));
  };

  const handleSwitchUser = (user: UserProfile) => {
    setCurrentUser(user);
    setNotifications(DataStore.getNotifications(user.id));
  };

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Determine if current view should display the dashboard sidebar
  const isPortalView = [
    'student-profile-setup',
    'student-dashboard',
    'student-applications',
    'student-saved-jobs',
    'student-drives',
    'student-resume-analyzer',
    'student-mock-interview',
    'student-skill-gap',
    'student-offers',
    'student-profile',
    'recruiter-dashboard',
    'recruiter-post-job',
    'recruiter-manage-jobs',
    'recruiter-applicants',
    'recruiter-interviews',
    'recruiter-offers',
    'recruiter-company',
    'tpo-dashboard',
    'tpo-directory',
    'tpo-drives',
    'tpo-reports',
    'tpo-announcements',
    'admin-dashboard',
    'admin-jobs',
    'admin-students',
    'admin-recruiters',
    'admin-skills',
    'admin-audit',
    'admin-announcements'
  ].includes(currentView);

  const renderContent = () => {
    switch (currentView) {
      // Public views
      case 'home':
        return <LandingPage onNavigate={setCurrentView} onOpenAuth={handleOpenAuth} />;
      case 'find-jobs':
        return <FindJobsPage currentUser={currentUser} initialType="all" onNavigate={setCurrentView} />;
      case 'internships':
        return <FindJobsPage currentUser={currentUser} initialType="internship" onNavigate={setCurrentView} />;
      case 'ai-assistant':
        return <AICareerAssistantPage currentUser={currentUser} onNavigate={setCurrentView} />;
      case 'about':
        return <AboutPage />;
      case 'contact':
        return <ContactPage />;

      // Student views
      case 'student-profile-setup':
        return (
          <StudentProfileSetup 
            currentUser={currentUser} 
            onProfileSaved={(updatedUser) => {
              handleSwitchUser(updatedUser);
              setCurrentView('student-dashboard');
            }}
            onNavigateToDashboard={() => setCurrentView('student-dashboard')}
            isEditing={DataStore.isStudentProfileComplete(currentUser)}
          />
        );
      case 'student-dashboard':
        return <StudentDashboard currentUser={currentUser} onNavigate={setCurrentView} />;
      case 'student-applications':
        return <StudentApplications currentUser={currentUser} onNavigate={setCurrentView} />;
      case 'student-saved-jobs':
        return <FindJobsPage currentUser={currentUser} initialType="all" onNavigate={setCurrentView} />;
      case 'student-drives':
        return <StudentDrives currentUser={currentUser} />;
      case 'student-resume-analyzer':
        return <AIResumeAnalyzer currentUser={currentUser} onUpdateProfile={handleSwitchUser} />;
      case 'student-mock-interview':
        return <AIMockInterview currentUser={currentUser} />;
      case 'student-skill-gap':
        return <AISkillGapRoadmap currentUser={currentUser} />;
      case 'student-offers':
        return <StudentOffers currentUser={currentUser} onRefreshUser={handleSwitchUser} />;
      case 'student-profile':
        return (
          <StudentProfileSetup 
            currentUser={currentUser} 
            onProfileSaved={(updatedUser) => {
              handleSwitchUser(updatedUser);
              setCurrentView('student-dashboard');
            }}
            onNavigateToDashboard={() => setCurrentView('student-dashboard')}
            isEditing={true}
          />
        );

      // Recruiter views
      case 'recruiter-dashboard':
      case 'recruiter-company':
        return <RecruiterDashboard currentUser={currentUser} onNavigate={setCurrentView} />;
      case 'recruiter-post-job':
        return <JobPostBuilder currentUser={currentUser} onNavigate={setCurrentView} />;
      case 'recruiter-manage-jobs':
        return <JobModeration />;
      case 'recruiter-applicants':
      case 'recruiter-interviews':
      case 'recruiter-offers':
        return <ApplicantsPipeline currentUser={currentUser} />;

      // TPO views
      case 'tpo-dashboard':
      case 'tpo-reports':
        return <TPODashboard currentUser={currentUser} onNavigate={setCurrentView} />;
      case 'tpo-directory':
        return <StudentPlacementDirectory />;
      case 'tpo-drives':
      case 'tpo-announcements':
        return <DriveManagement currentUser={currentUser} />;

      // Admin views
      case 'admin-dashboard':
        return <AdminDashboard currentUser={currentUser} onNavigate={setCurrentView} />;
      case 'admin-jobs':
      case 'admin-skills':
        return <JobModeration />;
      case 'admin-students':
      case 'admin-recruiters':
        return <UserManagement />;
      case 'admin-audit':
        return <AuditLogsPage />;
      case 'admin-announcements':
        return <DriveManagement currentUser={currentUser} />;

      default:
        return <LandingPage onNavigate={setCurrentView} onOpenAuth={handleOpenAuth} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-purple-600 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={setCurrentView}
        currentUser={currentUser}
        onSwitchUser={handleSwitchUser}
        onOpenAuth={handleOpenAuth}
        onToggleNotifications={() => setNotificationsOpen(prev => !prev)}
        unreadCount={unreadCount}
      />

      {/* Main Body */}
      {isPortalView ? (
        <div className="flex-1 flex min-h-[calc(100vh-4rem)]">
          <Sidebar
            currentView={currentView}
            onNavigate={setCurrentView}
            currentUser={currentUser}
          />
          <main className="flex-1 bg-slate-950 overflow-y-auto">
            {renderContent()}
          </main>
        </div>
      ) : (
        <main className="flex-1">
          {renderContent()}
        </main>
      )}

      {/* Footer */}
      {!isPortalView && (
        <Footer onNavigate={setCurrentView} />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onAuthSuccess={user => {
          handleSwitchUser(user);
          refreshUserData();
          if (user.role === 'student') {
            if (DataStore.isStudentProfileComplete(user)) {
              setCurrentView('student-dashboard');
            } else {
              setCurrentView('student-profile-setup');
            }
          } else if (user.role === 'recruiter') {
            setCurrentView('recruiter-dashboard');
          } else if (user.role === 'placement_officer') {
            setCurrentView('tpo-dashboard');
          } else if (user.role === 'admin') {
            setCurrentView('admin-dashboard');
          }
        }}
      />

      {/* Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        notifications={notifications}
        onNavigate={setCurrentView}
        onRefresh={refreshUserData}
      />

    </div>
  );
}
