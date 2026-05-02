import React from 'react';
import { Clock, Calendar, MessageSquare, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import moment from 'moment';

const OTForm = ({ 
  currentAttendance, 
  isTodayLoading, 
  requestedHours, 
  setRequestedHours, 
  reason, 
  setReason, 
  handleSubmit, 
  isSubmitting, 
  message 
}) => {
  return (
    <div className="glass-card rounded-[2rem] p-8 space-y-6 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-2">
        <div className="p-3 bg-brand-primary/10 dark:bg-brand-primary/20 rounded-2xl text-brand-primary dark:text-brand-primary transition-colors">
          <Clock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 transition-colors">New Request</h2>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2 transition-colors ${
          message.type === 'success' ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' : 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-100 dark:border-rose-500/20'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 transition-colors">Work Date (Automatic)</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <div className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-slate-200 transition-colors">
              {currentAttendance ? moment(currentAttendance.punchIn).format('MMMM DD, YYYY') : 'No shift found for today'}
            </div>
          </div>
          {!currentAttendance && !isTodayLoading && (
            <p className="text-[10px] text-rose-500 dark:text-rose-400 font-bold ml-1 flex items-center gap-1 transition-colors">
              <AlertCircle className="w-3 h-3" />
              You must punch in today before requesting overtime.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 transition-colors">Extra Hours Requested</label>
          <div className="relative">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input 
              type="number" 
              step="0.5"
              placeholder="e.g. 2.5"
              value={requestedHours}
              onChange={(e) => setRequestedHours(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm font-medium dark:text-slate-200"
              required
              disabled={!currentAttendance}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1 transition-colors">Reason / Description</label>
          <div className="relative">
            <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <textarea 
              placeholder="Explain the necessity of overtime..."
              rows="4"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all text-sm font-medium resize-none dark:text-slate-200"
              required
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full btn-primary flex items-center justify-center gap-3 py-4 mt-4"
        >
          {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
              <Send className="w-5 h-5" />
              <span>Submit Request</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default OTForm;
