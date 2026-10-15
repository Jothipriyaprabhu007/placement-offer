import React from 'react';
import { UserProfile } from '../../types';
import { StudentProfileSetup } from './StudentProfileSetup';

interface StudentProfileProps {
  currentUser: UserProfile;
  onUpdateProfile: (updated: UserProfile) => void;
  onNavigateToDashboard?: () => void;
}

export const StudentProfilePage: React.FC<StudentProfileProps> = ({ 
  currentUser, 
  onUpdateProfile,
  onNavigateToDashboard
}) => {
  return (
    <StudentProfileSetup 
      currentUser={currentUser} 
      onProfileSaved={onUpdateProfile} 
      onNavigateToDashboard={onNavigateToDashboard}
      isEditing={true} 
    />
  );
};
