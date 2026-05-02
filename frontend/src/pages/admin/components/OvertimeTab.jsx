import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

const OvertimeTab = ({ otData, updateOTStatus }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 transition-colors">
        <h2 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Overtime Management</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Review and process additional hour requests.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {otData?.overtime.map((ot) => (
          <div key={ot._id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md dark:shadow-none transition duration-300 relative overflow-hidden group">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-black text-lg shadow-inner transition-colors">
                  {ot.user?.name[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-black text-slate-900 dark:text-slate-100 transition-colors">{ot.user?.name}</p>
                    {ot.status !== 'Pending' && (
                      <span className={`text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md transition-colors ${
                        ot.status === 'Approved' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400'
                      }`}>
                        {ot.status}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase transition-colors">ID: {ot._id.slice(-6).toUpperCase()}</p>
                </div>
              </div>

              <div className="flex-1 bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl px-5 py-3 border border-slate-100 dark:border-white/5 italic font-medium text-slate-600 dark:text-slate-400 text-sm transition-colors">
                "{ot.reason}"
              </div>

              <div className="flex items-center justify-between lg:justify-end gap-4 min-w-[300px]">
                <div className="bg-amber-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-amber-100 dark:shadow-amber-900/20 whitespace-nowrap transition-colors">
                  {ot.requestedHours} Hours
                </div>

                <div className="flex gap-2">
                  {ot.status === 'Pending' ? (
                    <>
                      <button
                        onClick={() => updateOTStatus({ id: ot._id, status: 'Approved' })}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white font-black px-5 py-3 rounded-xl transition active:scale-95 flex items-center gap-2 uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20"
                      >
                        <CheckCircle size={16} /> Approve
                      </button>
                      <button
                        onClick={() => updateOTStatus({ id: ot._id, status: 'Rejected' })}
                        className="bg-rose-500 hover:bg-rose-600 text-white font-black px-5 py-3 rounded-xl transition active:scale-95 flex items-center gap-2 uppercase text-[10px] tracking-widest shadow-lg shadow-rose-100 dark:shadow-rose-900/20"
                      >
                        <XCircle size={16} /> Reject
                      </button>
                    </>
                  ) : (
                    <div className={`px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 transition-colors ${
                      ot.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20'
                    }`}>
                      {ot.status === 'Approved' ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      {ot.status}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {otData?.overtime.length === 0 && (
        <div className="mt-20 text-center transition-colors">
          <div className="w-24 h-24 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300 dark:text-slate-700 transition-colors">
            <CheckCircle size={48} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200">Clear Skies!</h3>
          <p className="text-slate-400 dark:text-slate-500 font-medium">No pending overtime requests in the queue.</p>
        </div>
      )}
    </div>
  );
};

export default OvertimeTab;
