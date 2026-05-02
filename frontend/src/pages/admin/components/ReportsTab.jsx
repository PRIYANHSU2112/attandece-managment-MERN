import React from 'react';
import moment from 'moment';
import { CheckCircle, AlertCircle, Timer, FileSpreadsheet } from 'lucide-react';

const ReportsTab = ({ reportData, selectedDate }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 text-center transition-colors">
        <h2 className="text-4xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Daily Performance Analytics</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Consolidated report for {moment(selectedDate).format('MMMM DD, YYYY')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm text-center transition-colors">
          <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mx-auto mb-4 font-black transition-colors">
            <CheckCircle size={28} />
          </div>
          <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">Successful Shifts</p>
          <h3 className="text-4xl font-black text-slate-900 dark:text-slate-100 mt-1 transition-colors">{reportData?.filter(r => r.workingHours >= 8).length || 0}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm text-center transition-colors">
          <div className="w-14 h-14 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-3xl flex items-center justify-center mx-auto mb-4 font-black transition-colors">
            <AlertCircle size={28} />
          </div>
          <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">Incomplete Shifts</p>
          <h3 className="text-4xl font-black text-slate-900 dark:text-slate-100 mt-1 transition-colors">{reportData?.filter(r => r.workingHours < 8).length || 0}</h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm text-center transition-colors">
          <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mx-auto mb-4 font-black transition-colors">
            <Timer size={28} />
          </div>
          <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest transition-colors">Total OT Hours</p>
          <h3 className="text-4xl font-black text-slate-900 dark:text-slate-100 mt-1 transition-colors">
            {reportData?.reduce((acc, r) => acc + (r.workingHours > 8 ? r.workingHours - 8 : 0), 0).toFixed(1) || 0}h
          </h3>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-200 dark:border-slate-800 shadow-sm p-10 transition-colors">
        <div className="flex items-center justify-between mb-10">
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200 transition-colors">Operational Breakdown</h3>
        </div>
        <div className="space-y-6">
          {reportData?.map((record) => (
            <div key={record._id} className="flex items-center justify-between p-6 rounded-[24px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 hover:shadow-lg dark:hover:bg-slate-800 transition duration-300">
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-lg text-slate-800 dark:text-slate-200 shadow-sm transition-colors">{record.user?.name[0]}</div>
                <div>
                  <p className="text-lg font-black text-slate-900 dark:text-slate-100 transition-colors">{record.user?.name}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 tracking-tighter transition-colors">{record.user?.role}</span>
                    <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase bg-white dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 tracking-tighter transition-colors">{moment(record.punchIn).format('DD MMM')}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-10">
                <div className="text-right">
                  <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 transition-colors">Time Logs</p>
                  <p className="text-sm font-black text-slate-800 dark:text-slate-200 transition-colors">
                    {moment(record.punchIn).format('hh:mm A')} - {record.punchOut ? moment(record.punchOut).format('hh:mm A') : 'N/A'}
                  </p>
                </div>
                <div className="w-[1px] h-10 bg-slate-200 dark:bg-slate-800"></div>
                <div className="text-right">
                  <p className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 transition-colors">Net Work</p>
                  <p className={`text-sm font-black ${record.workingHours >= 8 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'} transition-colors`}>
                    {record.workingHours.toFixed(2)} Hrs
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportsTab;
