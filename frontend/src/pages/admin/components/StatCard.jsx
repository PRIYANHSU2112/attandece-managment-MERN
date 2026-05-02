import React from 'react';

const StatCard = ({ label, value, icon: Icon, color, trend }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl dark:shadow-none transition-all group">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all group-hover:scale-110 ${
        color === 'indigo' ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' :
        color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
        color === 'amber' ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' :
        'bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'
      }`}>
        <Icon size={24} />
      </div>
      <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</p>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-3xl font-black text-slate-900 dark:text-white">{value}</span>
        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
          color === 'indigo' ? 'bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' :
          color === 'emerald' ? 'bg-emerald-50 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
          color === 'amber' ? 'bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' :
          'bg-rose-50 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400'
        }`}>
          {trend}
        </span>
      </div>
    </div>
  );
};

export default StatCard;
