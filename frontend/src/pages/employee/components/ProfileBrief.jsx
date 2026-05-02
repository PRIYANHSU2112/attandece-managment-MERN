import React from 'react';
import { User } from 'lucide-react';

const ProfileBrief = ({ profile }) => {
  return (
    <div className="glass-card p-6 rounded-[2rem] border-t-4 border-indigo-500 transition-colors duration-700">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-secondary p-0.5 shadow-lg">
          <div className="w-full h-full rounded-[14px] bg-slate-50 dark:bg-slate-900 flex items-center justify-center transition-colors">
            <User className="w-8 h-8 text-slate-400 dark:text-white/90" />
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg text-slate-800 dark:text-white">{profile?.name || 'Employee View'}</h3>
          <p className="text-slate-400 dark:text-slate-500 text-[10px] tracking-wide uppercase font-bold">
            ID: {profile?._id ? profile._id.slice(-6).toUpperCase() : '---'}
          </p>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-slate-100 dark:border-white/10 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-slate-400 dark:text-slate-500 font-medium">Role</span>
          <span className="font-bold text-brand-primary">{profile?.role || '---'}</span>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400 dark:text-slate-500 font-medium">Reporting To</span>
            <span className="font-bold text-emerald-400">{profile?.managerId?.name || 'Not Assigned'}</span>
          </div>
          {profile?.managerId?._id && (
            <p className="text-[10px] text-slate-500 dark:text-slate-600 font-bold text-right uppercase tracking-wider">
              MID: {profile.managerId._id.slice(-6).toUpperCase()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileBrief;
