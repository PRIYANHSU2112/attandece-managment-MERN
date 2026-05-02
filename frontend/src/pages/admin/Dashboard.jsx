import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useGetUsersQuery, useGetUserProfileQuery } from '../../features/users/userApi';
import { 
  useGetAllAttendanceQuery, 
  useValidateAttendanceMutation,
  useGetDailyReportQuery 
} from '../../features/attendance/attendanceApi';
import { 
  useGetPendingOvertimeQuery, 
  useGetAllOvertimeQuery,
  useUpdateOvertimeStatusMutation 
} from '../../features/overtime/overtimeApi';
import { 
  ClipboardList, Clock, Shield, Calendar, Search,
  LayoutDashboard, LogOut, Bell, FileSpreadsheet, Users, Settings
} from 'lucide-react';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';


// Sub-components
import OverviewTab from './components/OverviewTab';
import AttendanceTab from './components/AttendanceTab';
import StaffTab from './components/StaffTab';
import ReportsTab from './components/ReportsTab';
import OvertimeTab from './components/OvertimeTab';
import ValidationModal from './components/ValidationModal';
import ProfileModal from './components/ProfileModal';
import { Link } from 'react-router-dom';
import ThemeToggle from '../../components/ThemeToggle';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('overview');
  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isValidationModalOpen, setValidationModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const currentUser = useSelector(selectCurrentUser);
  
  // Queries
  const { data: userData } = useGetUsersQuery({ page, limit: 10 });
  const { data: adminProfile } = useGetUserProfileQuery();

  const { data: attendanceData, refetch: refetchAttendance } = useGetAllAttendanceQuery({ date: selectedDate, page, limit: 10 });
  const { data: pendingOtData } = useGetPendingOvertimeQuery({ page, limit: 10, search: searchQuery });
  const { data: allOtData } = useGetAllOvertimeQuery({ page, limit: 10, search: searchQuery, status: 'All' });
  const { data: reportData } = useGetDailyReportQuery(selectedDate);

  // Mutations
  const [validateAttendance] = useValidateAttendanceMutation();
  const [updateOTStatus] = useUpdateOvertimeStatusMutation();

  const handleValidate = async (status) => {
    try {
      await validateAttendance({ 
        id: selectedRecord._id, 
        data: { 
          validationStatus: status, 
          remarks: status === 'Valid' ? "Looks good" : "Flagged by Admin" 
        } 
      }).unwrap();
      setValidationModalOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://attandece-managment-mern.onrender.com/api/attendance/export`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Full_Attendance_Report_${moment().format('YYYY-MM-DD')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Export failed:', err);
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'attendance', label: 'Attendance', icon: ClipboardList },
    { id: 'users', label: 'Staff Directory', icon: Users },
    { id: 'reports', label: 'Daily Reports', icon: FileSpreadsheet },
    { id: 'overtime', label: 'Overtime', icon: Clock },
  ];

  const handleOpenValidation = (record) => {
    setSelectedRecord(record);
    setValidationModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-300">
      
      {/* Sidebar */}
      <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col z-20 shadow-xl shadow-slate-100 dark:shadow-none transition-colors duration-300">
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20">
            <Shield size={22} fill="white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-200">Admin Panel</span>
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
                ? 'bg-indigo-600 text-white shadow-indigo-200 shadow-lg dark:shadow-indigo-900/40' 
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'} />
              {item.label}
              {item.id === 'overtime' && pendingOtData?.total > 0 && (
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${activeTab === item.id ? 'bg-white text-indigo-600' : 'bg-rose-500 text-white ring-4 ring-rose-100 dark:ring-rose-900/30'}`}>
                  {pendingOtData.total}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800 space-y-2">
           <Link 
            to="/admin/settings"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
           >
              <Settings size={20} className="text-slate-400" />
              Company Settings
           </Link>
           <button 
            onClick={() => dispatch(logout())}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
           >
              <LogOut size={20} />
              Sign Out
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Header Bar */}
        <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10 transition-colors duration-300">
          <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800 px-4 py-2.5 rounded-2xl w-96 border border-slate-100 dark:border-slate-700 transition-all focus-within:ring-2 ring-indigo-100">
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
                className="bg-transparent text-xs font-bold outline-none dark:text-slate-200"
              />
            </div>
            <div className="h-10 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
            <div 
              className="flex items-center gap-3 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-2 rounded-2xl transition-all"
              onClick={() => setProfileModalOpen(true)}
            >
              <div className="text-right">
                <p className="text-sm font-bold text-slate-800 dark:text-slate-200">{currentUser?.name || 'Super Admin'}</p>
                <p className="text-[10px] font-bold text-emerald-500 flex items-center justify-end"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>ONLINE</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-black shadow-inner uppercase">
                {currentUser?.name?.substring(0, 2) || 'AD'}
              </div>

            </div>
          </div>
        </header>

        {/* Dynamic Main Body */}
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {activeTab === 'overview' && (
            <OverviewTab 
              userData={userData} 
              attendanceData={attendanceData} 
              otData={pendingOtData} 
              onTabChange={setActiveTab} 
            />
          )}
          {activeTab === 'attendance' && (
            <AttendanceTab 
              attendanceData={attendanceData} 
              selectedDate={selectedDate} 
              page={page} 
              setPage={setPage} 
              onOpenValidation={handleOpenValidation} 
              onExport={handleExport}
            />
          )}
          {activeTab === 'users' && (
            <StaffTab 
              userData={userData} 
              page={page} 
              setPage={setPage} 
            />
          )}
          {activeTab === 'reports' && (
            <ReportsTab 
              reportData={reportData} 
              selectedDate={selectedDate} 
            />
          )}
          {activeTab === 'overtime' && (
            <OvertimeTab 
              otData={allOtData} 
              updateOTStatus={updateOTStatus} 
            />
          )}
        </main>
      </div>

      {isValidationModalOpen && (
        <ValidationModal 
          selectedRecord={selectedRecord} 
          onClose={() => setValidationModalOpen(false)} 
          onValidate={handleValidate} 
        />
      )}
      {isProfileModalOpen && (
        <ProfileModal 
          profile={adminProfile} 
          onClose={() => setProfileModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default AdminDashboard;

