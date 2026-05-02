import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Search,
  ArrowLeft,
  Filter,
  LogOut
} from 'lucide-react';
import { useGetMyAttendanceQuery } from '../../features/attendance/attendanceApi';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';

// Sub-components
import HistoryTable from './components/HistoryTable';

const AttendanceHistory = () => {
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, isLoading } = useGetMyAttendanceQuery({ page, limit: 10 });

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Incomplete': return 'bg-orange-50 text-orange-700 border-orange-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(-1)}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Attendance History</h1>
              <p className="text-slate-500 text-sm">Detailed logs of your presence and working hours</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="hidden md:flex btn-secondary items-center gap-2">
              <Download className="w-4 h-4" />
              Export Data
            </button>
            <button 
              onClick={() => {
                dispatch(logout());
                navigate('/login');
              }}
              className="p-2.5 rounded-xl bg-white border border-slate-200 hover:bg-rose-50 hover:border-rose-100 hover:text-rose-600 transition-all shadow-sm group"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </header>

        {/* Filters & Search */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by date or status..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all shadow-sm text-sm"
            />
          </div>
          <div className="md:col-span-4 flex gap-3">
            <button className="flex-1 btn-secondary flex items-center justify-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="md:hidden p-3 rounded-2xl bg-white border border-slate-200">
              <Download className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="glass-card rounded-3xl overflow-hidden">
          <HistoryTable 
            data={data}
            isLoading={isLoading}
            getStatusStyle={getStatusStyle}
          />

          {/* Pagination */}
          <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500 font-medium">
              Showing <span className="text-slate-900 font-bold">{(page-1)*10 + 1}</span> to <span className="text-slate-900 font-bold">{Math.min(page*10, data?.total || 0)}</span> of <span className="text-slate-900 font-bold">{data?.total || 0}</span> records
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-50 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(data?.pages || 1, p + 1))}
                disabled={page === data?.pages}
                className="p-2 rounded-xl bg-white border border-slate-200 disabled:opacity-50 hover:bg-slate-50 transition-colors shadow-sm"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceHistory;
