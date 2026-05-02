import React from 'react';
import moment from 'moment';
import { ClipboardList } from 'lucide-react';
import StatCard from './StatCard';
import { Users, UserCheck, Timer, AlertCircle } from 'lucide-react';

const OverviewTab = ({ userData, attendanceData, otData, onTabChange }) => {
  const stats = [
    { label: 'Total Members', value: userData?.total || 0, icon: Users, color: 'indigo', trend: '+12% growth' },
    { label: 'Active Presence', value: attendanceData?.total || 0, icon: UserCheck, color: 'emerald', trend: 'Peak hour' },
    { label: 'OT Requests', value: otData?.total || 0, icon: Timer, color: 'amber', trend: 'Awaiting action' },
    { label: 'Violations', value: 3, icon: AlertCircle, trend: 'Needs review', color: 'rose' }
  ];

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight transition-colors">Executive Dashboard</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium transition-colors">Real-time health status of your organization.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm p-8 transition-colors">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 transition-colors">
              <ClipboardList className="text-indigo-600 dark:text-indigo-400" /> Latest Activity
            </h3>
            <button onClick={() => onTabChange('attendance')} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline">
              See full log
            </button>
          </div>
          <div className="space-y-4">
            {attendanceData?.attendance.slice(0, 5).map((record) => (
              <div key={record._id} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition border border-transparent hover:border-slate-100 dark:hover:border-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold transition-colors">
                    {record.user?.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors">{record.user?.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-500 transition-colors">{moment(record.punchIn).fromNow()}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors">{record.status}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-black transition-colors">{record.workingHours.toFixed(1)} hrs</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;
