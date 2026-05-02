import React, { useEffect, useState } from 'react';
import { X, Bell } from 'lucide-react';

const Toast = ({ title, body, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-right duration-500">
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-2xl rounded-2xl p-4 w-80 flex gap-4 ring-1 ring-black/5 transition-all">
        <div className="flex-shrink-0 w-10 h-10 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
          <Bell size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
            {title}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
            {body}
          </p>
        </div>
        <button 
          onClick={onClose}
          className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default Toast;
