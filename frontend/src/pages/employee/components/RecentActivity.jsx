import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight, Loader2 } from 'lucide-react';
import moment from 'moment';

const RecentActivity = ({ attendanceHistory, isLoading }) => {
  return (
    <div className="glass-card rounded-[2rem] overflow-hidden">
      <div className="p-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between transition-colors">
        <h3 className="font-bold text-slate-800 dark:text-slate-100">Recent Activity</h3>
        <Link to="/employee/history" className="text-brand-primary text-xs font-bold hover:underline">View All</Link>
      </div>
      <div className="divide-y divide-slate-50 dark:divide-white/5">
        {isLoading ? (
          <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-slate-300 dark:text-slate-700" /></div>
        ) : attendanceHistory?.attendance?.length > 0 ? (
          attendanceHistory.attendance.map((record, i) => (
            <div key={i} className="p-4 hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    record.status === 'Completed' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-orange-50 dark:bg-orange-500/10 text-orange-600 dark:text-orange-400'
                  }`}>
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors">
                      {moment(record.punchIn).format('MMM DD, YYYY')}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium transition-colors">
                      {record.workingHours ? `${record.workingHours.toFixed(1)} hours worked` : 'Shift in progress'}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-slate-500 dark:group-hover:text-slate-400 transition-colors" />
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-slate-400 dark:text-slate-500 text-sm transition-colors">No recent activity found.</div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;
