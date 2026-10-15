import React, { useState } from 'react';
import { 
  Calendar, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  MapPin, 
  Users, 
  Building2, 
  Check 
} from 'lucide-react';
import { PlacementDrive, UserProfile } from '../../types';
import { DataStore } from '../../lib/storage';

interface StudentDrivesProps {
  currentUser: UserProfile;
}

export const StudentDrives: React.FC<StudentDrivesProps> = ({ currentUser }) => {
  const [drives, setDrives] = useState<PlacementDrive[]>(DataStore.getPlacementDrives());
  const [registeredIds, setRegisteredIds] = useState<string[]>(['drive-001']);

  const handleRegister = (drive: PlacementDrive) => {
    DataStore.registerForDrive(drive.id, currentUser.id);
    setRegisteredIds(prev => [...prev, drive.id]);
    setDrives(DataStore.getPlacementDrives());
  };

  const studentCgpa = currentUser.cgpa !== undefined && currentUser.cgpa !== null ? Number(currentUser.cgpa) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-purple-400" />
            <span>Campus Placement Drives & Visits</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Official recruitment drives coordinated by the Central Placement Office.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Your Eligibility CGPA:</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/30">
            {studentCgpa} / 10.0
          </span>
        </div>
      </div>

      {/* Drives List */}
      <div className="space-y-4">
        {drives.map(drive => {
          const isEligible = studentCgpa >= drive.min_cgpa;
          const isRegistered = registeredIds.includes(drive.id);

          return (
            <div
              key={drive.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-4"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      Drive Date: {drive.drive_date}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{drive.venue}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{drive.title}</h3>
                  <p className="text-xs text-purple-400 font-semibold">{drive.company_name}</p>
                </div>

                <div className="text-left md:text-right">
                  <span className="text-xs text-slate-400 block">Package CTC</span>
                  <span className="text-base font-extrabold text-emerald-400">{drive.package_ctc}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {drive.description}
              </p>

              {/* Eligibility & Action Bar */}
              <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-2.5 py-1 rounded-lg border font-semibold text-[11px] flex items-center gap-1.5 ${
                    isEligible
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  }`}>
                    {isEligible ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    <span>Cutoff: {drive.min_cgpa} CGPA ({isEligible ? 'Eligible' : 'Ineligible'})</span>
                  </span>

                  <span className="text-slate-400 text-[11px]">
                    Eligible: {drive.eligible_branches.join(', ')}
                  </span>
                </div>

                <div>
                  {isRegistered ? (
                    <span className="px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30 flex items-center gap-1.5">
                      <Check className="w-4 h-4" />
                      <span>Registered for Drive</span>
                    </span>
                  ) : isEligible ? (
                    <button
                      onClick={() => handleRegister(drive)}
                      className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition shadow-lg shadow-purple-600/25"
                    >
                      Register for Drive
                    </button>
                  ) : (
                    <button
                      disabled
                      className="px-4 py-2 rounded-xl bg-slate-800 text-slate-500 font-semibold cursor-not-allowed border border-slate-700"
                    >
                      CGPA Below Criteria
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
