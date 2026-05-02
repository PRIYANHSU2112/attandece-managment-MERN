import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { 
  useRequestOvertimeMutation, 
  useGetMyOvertimeQuery 
} from '../../features/overtime/overtimeApi';
import { useNavigate } from 'react-router-dom';
import { 
  useGetTodayAttendanceQuery 
} from '../../features/attendance/attendanceApi';

// Sub-components
import OTForm from './components/OTForm';
import OTHistory from './components/OTHistory';

const OTRequest = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [attendanceId, setAttendanceId] = useState('');
  const [requestedHours, setRequestedHours] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const { data: todayAttendance, isLoading: isTodayLoading } = useGetTodayAttendanceQuery();
  const { data: myOT, isLoading: isHistoryLoading } = useGetMyOvertimeQuery({ limit: 10 });
  const [requestOT, { isLoading: isSubmitting }] = useRequestOvertimeMutation();

  const currentAttendance = todayAttendance && todayAttendance.length > 0 ? todayAttendance[0] : null;

  useEffect(() => {
    if (currentAttendance) {
      setAttendanceId(currentAttendance._id);
    }
  }, [currentAttendance]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!attendanceId || !requestedHours || !reason) {
      setMessage({ type: 'error', text: 'Please fill all fields' });
      return;
    }

    try {
      await requestOT({ 
        attendanceId, 
        requestedHours: Number(requestedHours), 
        reason 
      }).unwrap();
      setMessage({ type: 'success', text: 'Overtime request submitted successfully!' });
      setRequestedHours('');
      setReason('');
      setAttendanceId('');
      setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    } catch (err) {
      setMessage({ type: 'error', text: err?.data?.message || 'Failed to submit request.' });
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-slate-950 p-4 lg:p-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-colors">Overtime Management</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm transition-colors">Request and track your extra working hours</p>
            </div>
          </div>

          <button 
            onClick={() => {
              dispatch(logout());
              navigate('/login');
            }}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-500/10 hover:border-rose-100 dark:hover:border-rose-500/20 hover:text-rose-600 dark:hover:text-rose-400 transition-all shadow-sm group"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Request Form (LHS) */}
          <div className="lg:col-span-5">
            <OTForm 
              currentAttendance={currentAttendance}
              isTodayLoading={isTodayLoading}
              requestedHours={requestedHours}
              setRequestedHours={setRequestedHours}
              reason={reason}
              setReason={setReason}
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              message={message}
            />
          </div>

          {/* History List (RHS) */}
          <OTHistory 
            myOT={myOT}
            isLoading={isHistoryLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default OTRequest;
