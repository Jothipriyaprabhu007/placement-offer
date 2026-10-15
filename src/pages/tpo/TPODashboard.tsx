import React from 'react';
import { 
  GraduationCap, 
  TrendingUp, 
  Award, 
  Building2, 
  Calendar, 
  Download, 
  Users, 
  CheckCircle2, 
  ExternalLink,
  PlusCircle,
  BellRing
} from 'lucide-react';
import { UserProfile, PlacementDrive } from '../../types';
import { DataStore } from '../../lib/storage';
import { exportToCSV } from '../../lib/csvExport';

interface TPODashboardProps {
  currentUser: UserProfile;
  onNavigate: (view: string) => void;
}

export const TPODashboard: React.FC<TPODashboardProps> = ({ 
  currentUser, 
  onNavigate 
}) => {
  const students = DataStore.getProfiles().filter(p => p.role === 'student');
  const drives = DataStore.getPlacementDrives();
  const offers = DataStore.getOffers();

  const totalStudents = students.length;
  const placedCount = students.filter(s => s.is_placed).length;
  const placementRate = totalStudents > 0 ? Math.round((placedCount / totalStudents) * 100) : 0;

  const handleExportBatchCSV = () => {
    const exportData = students.map(s => ({
      'Roll Number': s.college_id || 'APEX-NA',
      'Student Name': s.full_name,
      'Email': s.email,
      'Branch': s.branch || 'CSE',
      'Batch': s.batch_year || 2026,
      'CGPA': s.cgpa || 8.0,
      'Placement Status': s.is_placed ? 'PLACED' : 'UNPLACED',
      'Offer Details': s.current_placement || 'Pending',
      'Skills': (s.skills || []).join('; ')
    }));
    exportToCSV('Apex_Campus_Placement_Batch_2026', exportData);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Executive Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-indigo-950/60 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
            Training & Placement Directorate (TPO)
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Campus Placement Cell Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            {currentUser.full_name} • {currentUser.department || 'Central Career Development Centre'} ({currentUser.employee_code || 'TPO-DIR-802'})
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onNavigate('tpo-drives')}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Campus Drive</span>
          </button>
          <button
            onClick={handleExportBatchCSV}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 font-semibold text-xs transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>Export Batch CSV</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Placement Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-3xl font-extrabold text-emerald-400">{placementRate}%</div>
          <span className="text-[11px] text-slate-500">{placedCount} of {totalStudents} placed</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Highest Package</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">₹20.0 LPA</div>
          <span className="text-[11px] text-purple-400 font-medium">FinVantage Global</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Average Package</span>
            <Building2 className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">₹11.8 LPA</div>
          <span className="text-[11px] text-slate-500">Tier-1 campus average</span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium">Upcoming Drives</span>
            <Calendar className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white">{drives.length}</div>
          <span className="text-[11px] text-amber-400 font-medium">Scheduled visit slots</span>
        </div>

      </div>

      {/* Drives & Quick Directory Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Drives List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>Campus Recruitment Drives</span>
            </h2>
            <button
              onClick={() => onNavigate('tpo-drives')}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              Manage All Drives
            </button>
          </div>

          <div className="space-y-3">
            {drives.map(drive => (
              <div
                key={drive.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">{drive.title}</h3>
                    <p className="text-xs text-purple-400 font-semibold">{drive.company_name}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300">
                    {drive.package_ctc}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-800 text-slate-400">
                  <span>Visit Date: <strong className="text-white">{drive.drive_date}</strong></span>
                  <span>Min Cutoff: {drive.min_cgpa} CGPA</span>
                  <span className="text-amber-400 font-semibold">{drive.registered_students_count} enrolled</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Graduating Students Directory Snapshot */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-purple-400" />
              <span>Graduating Batch 2026</span>
            </h2>
            <button
              onClick={() => onNavigate('tpo-directory')}
              className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
            >
              Full Directory
            </button>
          </div>

          <div className="space-y-3">
            {students.slice(0, 3).map(student => (
              <div
                key={student.id}
                className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-white text-sm">{student.full_name}</h4>
                    <p className="text-xs text-slate-400">{student.branch}</p>
                  </div>
                  {student.is_placed ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Placed
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700">
                      Seeking
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>Roll: {student.college_id || 'APEX2026'}</span>
                  <span>CGPA: <strong className="text-emerald-400">{student.cgpa || 8.5}</strong></span>
                  {student.current_placement && (
                    <span className="text-[10px] text-slate-300 truncate max-w-[140px]">{student.current_placement}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
