import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Clock, Send } from 'lucide-react';

const StatsGrid = () => {
  const stats = [
    { label: 'Weekly Hours', value: '38.5h', icon: TrendingUp, color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10' },
    { label: 'Average In', value: '09:15 AM', icon: Clock, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
    { label: 'Overtime', value: 'OT Request', icon: Send, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-500/10', link: '/employee/ot-request' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        stat.link ? (
          <Link key={i} to={stat.link} className="glass-card p-6 rounded-3xl hover:translate-y-[-4px] transition-all duration-300 group">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4 transition-colors`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1 transition-colors">{stat.value}</p>
          </Link>
        ) : (
          <div key={i} className="glass-card p-6 rounded-3xl hover:translate-y-[-4px] transition-all duration-300">
            <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center mb-4 transition-colors`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium transition-colors">{stat.label}</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1 transition-colors">{stat.value}</p>
          </div>
        )
      ))}
    </div>
  );
};

export default StatsGrid;
