import React from 'react';
import moment from 'moment';
import { Filter, FileSpreadsheet, MapPin, CheckCircle, Clock, Eye, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';

const AttendanceTab = ({ attendanceData, selectedDate, page, setPage, onOpenValidation, onExport }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden transition-colors">
        <div className="p-4 lg:p-8 border-b border-slate-100 dark:border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-white to-slate-50/30 dark:from-slate-900 dark:to-slate-900/50">
          <div>
            <h2 className="text-xl lg:text-2xl font-black text-slate-900 dark:text-slate-100">Attendance Monitoring</h2>
            <p className="text-xs lg:text-sm text-slate-500 dark:text-slate-400 font-medium">Detailed tracking for {moment(selectedDate).format('LL')}</p>
          </div>
          <div className="flex gap-2 lg:gap-3">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 lg:px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-[10px] lg:text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm transition">
              <Filter size={14} /> Filter
            </button>
            <button 
              onClick={onExport}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 lg:px-4 py-2 bg-indigo-600 text-white rounded-xl text-[10px] lg:text-xs font-bold shadow-lg shadow-indigo-100 dark:shadow-indigo-900/20 hover:bg-indigo-700 transition"
            >
              <FileSpreadsheet size={14} /> Export XLS
            </button>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-slate-50 dark:divide-white/5">
          {attendanceData?.attendance.map((record) => (
            <div key={record._id} className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-black text-sm">
                    {record.user?.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-800 dark:text-slate-200">{record.user?.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{record.user?.role}</p>
                  </div>
                </div>
                <button
                  onClick={() => onOpenValidation(record)}
                  className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 flex items-center justify-center shadow-sm"
                >
                  <Eye size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p>
                  <p className={`text-sm font-black ${record.workingHours >= 8 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {record.workingHours.toFixed(2)}h
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</p>
                  <div className="flex items-center gap-1.5">
                    {record.validationStatus === 'Valid' ? (
                      <span className="text-[9px] font-black uppercase text-emerald-600">Valid</span>
                    ) : record.validationStatus === 'Invalid' ? (
                      <span className="text-[9px] font-black uppercase text-rose-600">Invalid</span>
                    ) : (
                      <span className="text-[9px] font-black uppercase text-amber-600">Pending</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-bold px-1">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 uppercase">In:</span>
                  <span className="text-emerald-600">{moment(record.punchIn).format('hh:mm A')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 uppercase">Out:</span>
                  <span className="text-rose-600">{record.punchOut ? moment(record.punchOut).format('hh:mm A') : 'ONGOING'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar">
          <div className="min-w-full">
            <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 transition-colors">
              <tr>
                <th className="px-8 py-5">Employee Details</th>
                <th className="px-8 py-5">Shift Duration</th>
                <th className="px-8 py-5">Punch Times</th>
                <th className="px-8 py-5">Verification</th>
                <th className="px-8 py-5 text-right">Selfie</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-white/5">
              {attendanceData?.attendance.map((record) => (
                <tr key={record._id} className="group hover:bg-indigo-50/30 dark:hover:bg-indigo-500/5 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-400 flex items-center justify-center font-black text-sm shadow-sm transition-colors">
                        {record.user?.name[0]}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800 dark:text-slate-200 transition-colors">{record.user?.name}</p>
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter transition-colors">{record.user?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-col">
                      <span className={`text-sm font-black ${record.workingHours >= 8 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'} transition-colors`}>
                        {record.workingHours.toFixed(2)}h
                      </span>
                      <div className="w-20 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full mt-1.5 overflow-hidden transition-colors">
                        <div
                          className={`h-full rounded-full transition-all ${record.workingHours >= 8 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                          style={{ width: `${Math.min(100, (record.workingHours / 8) * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3 text-[11px] font-bold">
                      <span className="text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-lg border border-emerald-100 dark:border-emerald-500/20 transition-colors">
                        {moment(record.punchIn).format('hh:mm A')}
                      </span>
                      <span className="text-slate-300 dark:text-slate-600">→</span>
                      <span className="text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-100 dark:border-rose-500/20 transition-colors">
                        {record.punchOut ? moment(record.punchOut).format('hh:mm A') : 'ONGOING'}
                      </span>
                    </div>
                  </td>

                  <td className="px-8 py-6">
                    {record.validationStatus === 'Valid' ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-500/20 transition-colors">
                        <CheckCircle size={12} /> Valid
                      </span>
                    ) : record.validationStatus === 'Invalid' ? (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 px-3 py-1 rounded-full border border-rose-100 dark:border-rose-500/20 transition-colors">
                        <XCircle size={12} /> Invalid
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-1 rounded-full border border-amber-100 dark:border-amber-500/20 transition-colors">
                        <Clock size={12} /> {record.validationStatus || 'Pending'}
                      </span>
                    )}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => onOpenValidation(record)}
                      className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-400 dark:text-slate-500 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all hover:scale-110 shadow-sm"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>

        <div className="p-4 lg:p-8 bg-slate-50/50 dark:bg-slate-800/50 flex items-center justify-between transition-colors">
          <p className="text-[10px] lg:text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Page {page}</p>
          <div className="flex gap-1 lg:gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-sm"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AttendanceTab;
