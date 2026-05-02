import React from 'react';
import { LogOut, Users } from 'lucide-react';

const Sidebar = ({ navItems, activeTab, setActiveTab, setPage, refetchAttendance, pendingOtCount, onLogout }) => {
  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-20 shadow-xl shadow-slate-100 dark:shadow-none transition-colors duration-300">
      <div className="p-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20">
          <Users size={22} fill="white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-200">Manager Panel</span>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => { 
              setActiveTab(item.id); 
              setPage(1); 
              if (item.id === 'attendance') {
                refetchAttendance();
              }
            }}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
              activeTab === item.id 
              ? 'bg-emerald-600 text-white shadow-emerald-200 shadow-lg dark:shadow-emerald-900/40' 
              : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'} />
            {item.label}
            {item.id === 'overtime' && pendingOtCount > 0 && (
              <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${activeTab === item.id ? 'bg-white text-emerald-600' : 'bg-rose-500 text-white ring-4 ring-rose-100 dark:ring-rose-900/30'}`}>
                {pendingOtCount}
              </span>
            )}
          </button>
        ))}
      </nav>

      <div className="p-6 border-t border-slate-100 dark:border-slate-800">
         <button 
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
         >
            <LogOut size={20} />
            Sign Out
         </button>
      </div>
    </aside>
  );
};

export default Sidebar;
