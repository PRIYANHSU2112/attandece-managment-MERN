import React from 'react';
import { Search, Calendar, FileSpreadsheet } from 'lucide-react';
import ThemeToggle from '../../../components/ThemeToggle';
import moment from 'moment';

const Header = ({ activeTab, searchQuery, setSearchQuery, selectedDate, setSelectedDate, adminProfile, setProfileModalOpen }) => {
  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/attendance/export?teamOnly=true`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Team_Attendance_Report_${moment().format('YYYY-MM-DD')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10 transition-colors duration-300">
      <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 rounded-2xl w-96 border border-slate-100 dark:border-slate-700 transition-all focus-within:ring-2 ring-emerald-100">
        <Search size={18} className="text-slate-400" />
        <input 
          type="text" 
          placeholder={`Search ${activeTab}...`} 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-sm outline-none w-full font-medium dark:text-slate-200" 
        />
      </div>

      <div className="flex items-center gap-6">
        <ThemeToggle />
        
        <div className="flex items-center rounded-xl border dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-600 dark:text-slate-400">
          <Calendar size={18} className="mr-2 text-slate-400" />
          <input 
            type="date" 
            value={selectedDate} 
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-xs font-bold outline-none dark:color-white"
          />
        </div>
        <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
        <div 
          className="flex items-center gap-3 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-2xl transition-all"
          onClick={() => setProfileModalOpen(true)}
        >
          <div className="text-right">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{adminProfile?.name || 'Manager'}</p>
            <p className="text-[10px] font-bold text-emerald-500 flex items-center justify-end">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>ONLINE
            </p>
          </div>
          <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-xl flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-black shadow-inner uppercase">
            {adminProfile?.name?.substring(0, 2) || 'MG'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
