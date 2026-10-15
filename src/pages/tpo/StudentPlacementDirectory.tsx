import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Users
} from 'lucide-react';
import { UserProfile } from '../../types';
import { DataStore } from '../../lib/storage';
import { exportToCSV } from '../../lib/csvExport';

export const StudentPlacementDirectory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [branchFilter, setBranchFilter] = useState('all');
  const [placementFilter, setPlacementFilter] = useState<'all' | 'placed' | 'unplaced'>('all');
  const [minCgpa, setMinCgpa] = useState<number>(0);

  const students = DataStore.getProfiles().filter(p => p.role === 'student');

  const filtered = students.filter(s => {
    if (branchFilter !== 'all' && s.branch !== branchFilter) return false;
    if (placementFilter === 'placed' && !s.is_placed) return false;
    if (placementFilter === 'unplaced' && s.is_placed) return false;
    if ((s.cgpa || 0) < minCgpa) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = s.full_name.toLowerCase().includes(q);
      const matchRoll = (s.college_id || '').toLowerCase().includes(q);
      const matchEmail = s.email.toLowerCase().includes(q);
      if (!matchName && !matchRoll && !matchEmail) return false;
    }
    return true;
  });

  const handleExportCSV = () => {
    const rows = filtered.map(s => ({
      'Roll Number': s.college_id || 'APEX-N/A',
      'Full Name': s.full_name,
      'Email': s.email,
      'Phone': s.phone || 'N/A',
      'Branch': s.branch || 'CSE',
      'CGPA': s.cgpa || 0,
      'Backlogs': s.backlogs || 0,
      'Placement Status': s.is_placed ? 'PLACED' : 'UNPLACED',
      'Placement Company / Offer': s.current_placement || 'None',
      'Verified Skills': (s.skills || []).join('; ')
    }));
    exportToCSV(`Apex_Student_Placement_Directory_${new Date().getFullYear()}`, rows);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <GraduationCap className="w-6 h-6 text-purple-400" />
            <span>Student Placement Directory & Eligibility Records</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Authoritative institutional records for graduating candidates with verified academic criteria.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/25 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Filtered Records (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-900 p-3.5 rounded-2xl border border-slate-800 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search candidate, roll ID, or email..."
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-xs"
          />
        </div>

        <div>
          <select
            value={branchFilter}
            onChange={e => setBranchFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-xs"
          >
            <option value="all">All Academic Departments</option>
            <option value="Computer Science & Engineering">Computer Science</option>
            <option value="Information Technology">Information Technology</option>
            <option value="Electronics & Communication">ECE</option>
          </select>
        </div>

        <div>
          <select
            value={placementFilter}
            onChange={e => setPlacementFilter(e.target.value as any)}
            className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-xs"
          >
            <option value="all">All Placement Statuses</option>
            <option value="placed">Placed Only</option>
            <option value="unplaced">Unplaced (Seeking Placement)</option>
          </select>
        </div>

        <div>
          <select
            value={minCgpa}
            onChange={e => setMinCgpa(Number(e.target.value))}
            className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-xs"
          >
            <option value={0}>All CGPA Ranges</option>
            <option value={8.0}>CGPA ≥ 8.0 (Tier-1 Eligible)</option>
            <option value={7.0}>CGPA ≥ 7.0</option>
            <option value={6.0}>CGPA ≥ 6.0</option>
          </select>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Student & Roll No.</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-4">CGPA</th>
                <th className="py-3 px-4">Verified Skills</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Current Placement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(student => (
                <tr key={student.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3.5 px-4">
                    <strong className="text-white block font-medium">{student.full_name}</strong>
                    <span className="text-[11px] text-slate-400 font-mono">{student.college_id || 'APEX2026CS'}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span>{student.branch || 'Computer Science'}</span>
                    <span className="text-[11px] text-slate-500 block">Batch {student.batch_year || 2026}</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="font-extrabold text-emerald-400 text-sm">{student.cgpa || 8.0}</span>
                    <span className="text-[10px] text-slate-500 block">0 Backlogs</span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {(student.skills || ['React', 'TypeScript', 'Node.js']).slice(0, 3).map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    {student.is_placed ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-max">
                        <CheckCircle2 className="w-3 h-3" />
                        Placed
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-400 border border-slate-700 w-max block">
                        Seeking
                      </span>
                    )}
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="text-xs text-slate-200">
                      {student.current_placement || '—'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
