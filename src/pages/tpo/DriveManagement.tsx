import React, { useState } from 'react';
import { 
  Calendar, 
  PlusCircle, 
  BellRing, 
  CheckCircle2, 
  Users, 
  MapPin, 
  Building2, 
  Check, 
  Sparkles 
} from 'lucide-react';
import { PlacementDrive, UserProfile } from '../../types';
import { DataStore } from '../../lib/storage';

interface DriveManagementProps {
  currentUser: UserProfile;
}

export const DriveManagement: React.FC<DriveManagementProps> = ({ currentUser }) => {
  const [drives, setDrives] = useState<PlacementDrive[]>(DataStore.getPlacementDrives());
  
  // Create drive modal
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [driveDate, setDriveDate] = useState('2026-11-20');
  const [minCgpa, setMinCgpa] = useState<number>(7.0);
  const [packageCtc, setPackageCtc] = useState('₹10.0 - ₹14.0 LPA');
  const [venue, setVenue] = useState('Auditorium & Virtual Coding Platform');
  const [description, setDescription] = useState('');

  // Notification feedback state
  const [notifiedDriveId, setNotifiedDriveId] = useState<string | null>(null);

  const handleCreateDrive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !companyName.trim()) return;

    const newDrive = DataStore.createPlacementDrive({
      title,
      company_name: companyName,
      drive_date: driveDate,
      min_cgpa: Number(minCgpa),
      eligible_branches: ['Computer Science', 'Information Technology', 'ECE'],
      batch_year: 2026,
      package_ctc: packageCtc,
      venue,
      description,
      status: 'upcoming'
    });

    setDrives(DataStore.getPlacementDrives());
    setShowCreate(false);
    setTitle('');
    setCompanyName('');
  };

  const handleNotifyEligibleStudents = (drive: PlacementDrive) => {
    const students = DataStore.getProfiles().filter(p => p.role === 'student');
    const eligibleStudents = students.filter(s => (s.cgpa || 0) >= drive.min_cgpa);

    eligibleStudents.forEach(student => {
      DataStore.addNotification({
        user_id: student.id,
        title: `Campus Drive Invitation: ${drive.company_name}`,
        message: `You meet the eligibility criteria (${drive.min_cgpa} CGPA) for ${drive.title} (${drive.package_ctc}). Register now!`,
        type: 'drive'
      });
    });

    setNotifiedDriveId(drive.id);
    setTimeout(() => setNotifiedDriveId(null), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-amber-400" />
            <span>Placement Drives & Recruitment Schedules</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Organize corporate campus visits, verify cutoffs, and broadcast drive notifications.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-lg shadow-amber-600/30 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Schedule New Campus Drive</span>
        </button>
      </div>

      {/* Create Drive Form */}
      {showCreate && (
        <form onSubmit={handleCreateDrive} className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 text-xs animate-in fade-in">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Schedule Corporate Drive Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Drive Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Amazon University Hiring 2026"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={companyName}
                onChange={e => setCompanyName(e.target.value)}
                placeholder="e.g. Amazon India"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Drive Date</label>
              <input
                type="date"
                required
                value={driveDate}
                onChange={e => setDriveDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Package CTC</label>
              <input
                type="text"
                value={packageCtc}
                onChange={e => setPackageCtc(e.target.value)}
                placeholder="e.g. ₹14.0 - ₹18.0 LPA"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Minimum CGPA Cutoff</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={minCgpa}
                onChange={e => setMinCgpa(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Venue / Mode</label>
              <input
                type="text"
                value={venue}
                onChange={e => setVenue(e.target.value)}
                placeholder="e.g. Auditorium / Virtual"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Drive Schedule & Instructions</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Outline online assessment dates, PPT timing, and interview rounds..."
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition shadow-md shadow-amber-600/30"
            >
              Create Drive & Announce
            </button>
          </div>
        </form>
      )}

      {/* Drives List */}
      <div className="space-y-4">
        {drives.map(drive => (
          <div
            key={drive.id}
            className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 hover:border-slate-700 transition"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Drive Date: {drive.drive_date}
                  </span>
                  <span className="text-xs text-slate-400">{drive.venue}</span>
                </div>
                <h3 className="text-lg font-bold text-white">{drive.title}</h3>
                <p className="text-xs text-purple-400 font-semibold">{drive.company_name}</p>
              </div>

              <div className="sm:text-right">
                <span className="text-xs text-slate-400 block">Package CTC</span>
                <span className="text-xl font-extrabold text-emerald-400">{drive.package_ctc}</span>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {drive.description}
            </p>

            <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 text-slate-400">
                <span>Cutoff: <strong className="text-white">{drive.min_cgpa} CGPA</strong></span>
                <span>•</span>
                <span>Eligible: {drive.eligible_branches.join(', ')}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{drive.registered_students_count} students registered</span>
              </div>

              <div>
                {notifiedDriveId === drive.id ? (
                  <span className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold flex items-center gap-1.5">
                    <Check className="w-4 h-4" />
                    <span>Eligible Cohort Notified!</span>
                  </span>
                ) : (
                  <button
                    onClick={() => handleNotifyEligibleStudents(drive)}
                    className="px-4 py-2 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 font-semibold flex items-center gap-1.5 transition"
                    title="Send immediate system notification to all candidates meeting CGPA criteria"
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    <span>Notify Eligible Students</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
