import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  ShieldCheck, 
  Building2, 
  GraduationCap, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle 
} from 'lucide-react';
import { UserProfile, UserRole } from '../../types';
import { DataStore } from '../../lib/storage';

export const UserManagement: React.FC = () => {
  const [profiles, setProfiles] = useState<UserProfile[]>(DataStore.getProfiles());
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const reloadProfiles = () => {
    setProfiles(DataStore.getProfiles());
  };

  const handleToggleStatus = (userId: string, currentStatus: UserProfile['status']) => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    const profile = profiles.find(p => p.id === userId);
    if (profile) {
      profile.status = nextStatus;
      DataStore.saveProfile(profile);
      DataStore.addAuditLog('TOGGLED_USER_STATUS', 'USER', userId, { nextStatus, email: profile.email });
      reloadProfiles();
    }
  };

  const filtered = profiles.filter(p => {
    if (roleFilter !== 'all' && p.role !== roleFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return p.full_name.toLowerCase().includes(q) || p.email.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-400" />
            <span>User Account & Security Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage permissions, suspend/reactivate accounts, and audit user access.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800 text-xs">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search user name or institutional email..."
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-xs"
          />
        </div>

        <div>
          <select
            value={roleFilter}
            onChange={e => setRoleFilter(e.target.value)}
            className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-xs"
          >
            <option value="all">All Account Roles</option>
            <option value="student">Students</option>
            <option value="recruiter">Recruiters</option>
            <option value="placement_officer">Placement Officers</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Details</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Access Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(user => {
                const isSuspended = user.status === 'suspended';

                return (
                  <tr key={user.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white shrink-0">
                          {user.full_name.charAt(0)}
                        </div>
                        <div>
                          <strong className="text-white block font-medium">{user.full_name}</strong>
                          <span className="text-[11px] text-slate-400">{user.email}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-[11px] text-slate-400">
                      {user.role === 'student' && (
                        <span>{user.branch} • CGPA: {user.cgpa || 8.5}</span>
                      )}
                      {user.role === 'recruiter' && (
                        <span>{user.company_name} ({user.designation})</span>
                      )}
                      {user.role === 'placement_officer' && (
                        <span>{user.department || 'Placement Cell'}</span>
                      )}
                      {user.role === 'admin' && (
                        <span className="text-purple-400 font-semibold">Superadmin Authority</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        isSuspended 
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      }`}>
                        {user.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleToggleStatus(user.id, user.status)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                            isSuspended
                              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                              : 'bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {isSuspended ? 'Reactivate User' : 'Suspend Account'}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
