import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  CheckCheck, 
  Calendar, 
  FileCheck, 
  Award, 
  Sparkles, 
  Info, 
  ExternalLink 
} from 'lucide-react';
import { NotificationItem } from '../../types';
import { DataStore } from '../../lib/storage';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onNavigate: (view: string) => void;
  onRefresh: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onNavigate,
  onRefresh
}) => {
  const [filter, setFilter] = useState<'all' | 'interview' | 'offer' | 'application' | 'drive'>('all');

  if (!isOpen) return null;

  const filtered = filter === 'all' 
    ? notifications 
    : notifications.filter(n => n.type === filter);

  const handleMarkAllRead = () => {
    notifications.forEach(n => {
      DataStore.markNotificationRead(n.id);
    });
    onRefresh();
  };

  const handleItemClick = (n: NotificationItem) => {
    DataStore.markNotificationRead(n.id);
    onRefresh();
    if (n.type === 'interview') onNavigate('student-dashboard');
    else if (n.type === 'offer') onNavigate('student-offers');
    else if (n.type === 'application') onNavigate('student-applications');
    else if (n.type === 'drive') onNavigate('student-drives');
    onClose();
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'interview': return <Calendar className="w-4 h-4 text-amber-400" />;
      case 'offer': return <Award className="w-4 h-4 text-emerald-400" />;
      case 'application': return <FileCheck className="w-4 h-4 text-indigo-400" />;
      case 'drive': return <Sparkles className="w-4 h-4 text-purple-400" />;
      default: return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-sm animate-in fade-in">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Notifications</h3>
                <p className="text-[11px] text-slate-400">Campus alerts & recruitment updates</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-medium transition"
                title="Mark all as read"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark read</span>
              </button>
              <button 
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="px-4 py-2 border-b border-slate-800 flex items-center gap-1.5 text-xs overflow-x-auto">
            {(['all', 'interview', 'offer', 'application', 'drive'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-2.5 py-1 rounded-lg capitalize font-medium transition ${
                  filter === tab 
                    ? 'bg-purple-600 text-white font-semibold' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto opacity-30" />
                <p className="text-xs">No notifications in this view.</p>
              </div>
            ) : (
              filtered.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex gap-3 ${
                    !item.read 
                      ? 'bg-purple-950/20 border-purple-500/30 hover:border-purple-500/50' 
                      : 'bg-slate-800/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center">
                      {getIcon(item.type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs font-semibold text-white truncate">{item.title}</h4>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{item.message}</p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span>{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}</span>
                      <span className="text-purple-400 flex items-center gap-0.5">
                        View details <ExternalLink className="w-2.5 h-2.5" />
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
