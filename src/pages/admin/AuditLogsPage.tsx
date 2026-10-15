import React, { useState } from 'react';
import { 
  Clock, 
  Search, 
  Download, 
  ShieldCheck, 
  User, 
  Database,
  Filter 
} from 'lucide-react';
import { AuditLog } from '../../types';
import { DataStore } from '../../lib/storage';
import { exportToCSV } from '../../lib/csvExport';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>(DataStore.getAuditLogs());
  const [search, setSearch] = useState('');
  const [selectedEntity, setSelectedEntity] = useState('all');

  const filtered = logs.filter(l => {
    if (selectedEntity !== 'all' && l.entity_type !== selectedEntity) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return l.action.toLowerCase().includes(q) || l.actor_email.toLowerCase().includes(q);
    }
    return true;
  });

  const handleExportCSV = () => {
    const rows = filtered.map(l => ({
      'Log ID': l.id,
      'Timestamp': l.created_at,
      'Actor': l.actor_email,
      'Action': l.action,
      'Entity Type': l.entity_type,
      'Entity ID': l.entity_id,
      'Details': JSON.stringify(l.details || {})
    }));
    exportToCSV(`HireReady_Security_Audit_Trail_${new Date().getFullYear()}`, rows);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-800 gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <Clock className="w-6 h-6 text-purple-400" />
            <span>Immutable Security Audit & Activity Trail</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time compliance ledger recording administrative overrides, job moderation, and applicant transitions.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg shadow-purple-600/30 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Audit Trail (CSV)</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-900 p-3 rounded-2xl border border-slate-800 text-xs">
        <div className="relative sm:col-span-2">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search action or actor email..."
            className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-xs"
          />
        </div>

        <div>
          <select
            value={selectedEntity}
            onChange={e => setSelectedEntity(e.target.value)}
            className="w-full py-2 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-purple-500 text-xs"
          >
            <option value="all">All Entities</option>
            <option value="COMPANY">Company</option>
            <option value="JOB">Job Vacancy</option>
            <option value="APPLICATION">Application</option>
            <option value="USER">User Account</option>
            <option value="OFFER">Job Offer</option>
            <option value="DRIVE">Placement Drive</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-800 uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Target Entity</th>
                <th className="py-3 px-4">Context Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.map(log => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {new Date(log.created_at).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono font-bold text-[10px] border border-purple-500/30">
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="text-white font-medium">{log.actor_email}</span>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold border border-slate-700">
                      {log.entity_type}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-400 text-[11px] font-mono">
                    {JSON.stringify(log.details || {})}
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
