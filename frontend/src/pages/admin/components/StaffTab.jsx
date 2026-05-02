import React, { useState } from 'react';
import { UserPlus, MoreVertical, Mail, ChevronLeft, ChevronRight } from 'lucide-react';
import ManageUserModal from './ManageUserModal';

const StaffTab = ({ userData, page, setPage }) => {
  const [selectedUserId, setSelectedUserId] = useState(null);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 flex items-end justify-between transition-colors">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Staff Directory</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium italic">Manage roles and view member profiles.</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 dark:shadow-indigo-900/20 hover:bg-indigo-700 transition hover:-translate-y-1">
          <UserPlus size={18} /> Add New Member
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userData?.users.map((user) => (
          <div key={user._id} className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 p-8 shadow-sm hover:shadow-2xl dark:hover:shadow-none transition-all duration-300 group relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-3xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl font-black shadow-inner transition-colors group-hover:scale-110">
                  {user.name[0]}
                </div>
                <button className="p-2 text-slate-400 dark:text-slate-600 hover:text-slate-900 dark:hover:text-slate-200 transition">
                  <MoreVertical size={20} />
                </button>
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-slate-100 mb-1 transition-colors">{user.name}</h3>
              <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 mb-6 font-bold text-xs transition-colors">
                <Mail size={14} />
                {user.email}
              </div>
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-white/5 transition-colors">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Current Role</p>
                  <p className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase">{user.role}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-100 dark:border-white/5 transition-colors">
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Supervisor</p>
                  <p className="text-xs font-black text-slate-600 dark:text-slate-400 uppercase truncate">
                    {user.managerId ? 'Assigned' : 'Unassigned'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUserId(user._id)}
                className="w-full py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-600 dark:hover:bg-indigo-500 transition shadow-lg"
              >
                Manage Member
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-indigo-50/50 dark:bg-indigo-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        ))}
      </div>

      <div className="mt-10 p-8 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 flex items-center justify-between transition-colors">
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest transition-colors">Showing Page {page}</p>
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {selectedUserId && (
        <ManageUserModal 
          userId={selectedUserId} 
          onClose={() => setSelectedUserId(null)} 
        />
      )}
    </div>
  );
};

export default StaffTab;
