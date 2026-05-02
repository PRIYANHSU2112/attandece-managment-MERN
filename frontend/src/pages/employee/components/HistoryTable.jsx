import React from 'react';
import { Calendar, Clock, CheckCircle2, XCircle, HelpCircle } from 'lucide-react';
import moment from 'moment';

const HistoryTable = ({ data, isLoading, getStatusStyle }) => {
  const getValidationIcon = (status) => {
    switch (status) {
      case 'Approved': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'Rejected': return <XCircle className="w-4 h-4 text-rose-500" />;
      default: return <HelpCircle className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Punch In</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Punch Out</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Hours</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Validation</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              Array(5).fill(0).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan="6" className="px-6 py-6"><div className="h-4 bg-slate-100 rounded w-full"></div></td>
                </tr>
              ))
            ) : data?.attendance?.map((record) => (
              <tr key={record._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                      <Calendar className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-slate-700">{moment(record.punchIn).format('MMM DD, YYYY')}</span>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="w-4 h-4 text-brand-primary" />
                    {moment(record.punchIn).format('hh:mm A')}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-slate-600">
                    {record.punchOut ? (
                      <>
                        <Clock className="w-4 h-4 text-brand-accent" />
                        {moment(record.punchOut).format('hh:mm A')}
                      </>
                    ) : (
                      <span className="text-slate-400 italic text-sm">Active</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className="font-medium text-slate-700">
                    {record.workingHours ? `${record.workingHours.toFixed(2)}h` : '--'}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(record.status)}`}>
                    {record.status}
                  </span>
                </td>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    {getValidationIcon(record.validationStatus)}
                    {record.validationStatus || 'Pending'}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;
