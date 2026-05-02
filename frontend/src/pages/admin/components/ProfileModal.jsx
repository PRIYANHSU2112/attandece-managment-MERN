import React from 'react';
import { XCircle, User, Mail, Shield, Calendar, Phone } from 'lucide-react';
import moment from 'moment';

const ProfileModal = ({ profile, onClose }) => {
  if (!profile) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in duration-300 relative transition-colors">
        {/* Header Decor */}
        <div className="h-32 bg-indigo-600 relative">
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors z-20"
          >
            <XCircle size={28} />
          </button>
          <div className="absolute -bottom-12 left-8 p-1 bg-white dark:bg-slate-900 rounded-3xl shadow-xl transition-colors">
             <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center text-3xl font-black text-indigo-700 dark:text-indigo-400 transition-colors">
               {profile.name?.[0]}
             </div>
          </div>
        </div>

        <div className="pt-16 pb-10 px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 transition-colors">{profile.name}</h2>
            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest transition-colors">{profile.role}</p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 transition-colors">
                <Mail size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">Email Address</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 transition-colors">
                <Shield size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">Account Type</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">{profile.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 transition-colors">
                <Calendar size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">Joined On</p>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 transition-colors">{moment(profile.createdAt).format('MMMM DD, YYYY')}</p>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <button 
              onClick={onClose}
              className="w-full py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
