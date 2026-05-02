import React from 'react';
import { History, Loader2 } from 'lucide-react';
import moment from 'moment';

const OTHistory = ({ myOT, isLoading }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Approved': return 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20';
      case 'Rejected': return 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-100 dark:border-rose-500/20';
      default: return 'bg-orange-50 dark:bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-100 dark:border-orange-500/20';
    }
  };

  return (
    <div className="lg:col-span-7 space-y-6">
      <div className="flex items-center justify-between px-2 transition-colors">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-secondary/10 dark:bg-brand-secondary/20 rounded-xl text-brand-secondary transition-colors">
            <History className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">My History</h2>
        </div>
        <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Last 10 Requests</span>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="glass-card p-6 rounded-3xl animate-pulse flex gap-4">
              <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-2xl transition-colors"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/3"></div>
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
              </div>
            </div>
          ))
        ) : myOT?.overtime?.length > 0 ? (
          myOT.overtime.map((req) => (
            <div key={req._id} className="glass-card p-6 rounded-3xl hover:translate-x-1 transition-all duration-300 group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex flex-col items-center justify-center border border-slate-100 dark:border-slate-700 shrink-0 transition-colors">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">{moment(req.attendance?.punchIn || req.createdAt).format('MMM')}</span>
                    <span className="text-xl font-black text-slate-700 dark:text-slate-300">{moment(req.attendance?.punchIn || req.createdAt).format('DD')}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-800 dark:text-slate-100 transition-colors">{req.requestedHours} Hours</span>
                      <span className="text-slate-300 dark:text-slate-700">•</span>
                      <span className="text-sm text-slate-500 dark:text-slate-500 font-medium">{moment(req.createdAt).fromNow()}</span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 transition-colors">{req.reason}</p>
                    {req.attendance && (
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 transition-colors">Linked to shift: {moment(req.attendance.punchIn).format('hh:mm A')}</p>
                    )}
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase border tracking-wider transition-colors ${getStatusBadge(req.status)}`}>
                  {req.status}
                </div>
              </div>
              {req.adminRemarks && (
                <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border-l-4 border-brand-primary text-xs text-slate-600 dark:text-slate-400 italic transition-colors">
                  "{req.adminRemarks}"
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="glass-card p-12 rounded-[2rem] text-center space-y-4 transition-colors">
            <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto transition-colors">
              <History className="w-10 h-10 text-slate-200 dark:text-slate-700" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-200">No requests yet</h3>
              <p className="text-slate-500 dark:text-slate-500 text-sm">Your overtime history will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OTHistory;
