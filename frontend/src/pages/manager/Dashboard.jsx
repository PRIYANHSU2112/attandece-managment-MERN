import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useGetTeamQuery, useGetUserProfileQuery } from '../../features/users/userApi';
import { 
  useGetTeamAttendanceQuery, 
  useValidateAttendanceMutation,
  useGetDailyReportQuery 
} from '../../features/attendance/attendanceApi';
import { 
  useGetPendingOvertimeQuery, 
  useGetAllOvertimeQuery,
  useUpdateOvertimeStatusMutation 
} from '../../features/overtime/overtimeApi';
import { 
  ClipboardList, Clock, LayoutDashboard, FileSpreadsheet, Menu, X, LogOut, Users as UsersIcon
} from 'lucide-react';

import moment from 'moment';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../../features/auth/authSlice';


// Sub-components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import OverviewTab from '../admin/components/OverviewTab';
import AttendanceTab from '../admin/components/AttendanceTab';
import ReportsTab from '../admin/components/ReportsTab';
import OvertimeTab from '../admin/components/OvertimeTab';
import ValidationModal from '../admin/components/ValidationModal';
import ProfileModal from '../admin/components/ProfileModal';
import { useNavigate } from 'react-router-dom';

const ManagerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [page, setPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [isValidationModalOpen, setValidationModalOpen] = useState(false);
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');


  const currentUser = useSelector(selectCurrentUser);
  
  // Queries
  const { data: adminProfile } = useGetUserProfileQuery();

  const { data: teamData } = useGetTeamQuery({ page: 1, limit: 100 }); 
  const { data: attendanceData, refetch: refetchAttendance } = useGetTeamAttendanceQuery({ date: selectedDate, page, limit: 10 });
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
          remarks: status === 'Valid' ? "Approved by Manager" : "Rejected by Manager" 
        } 
      }).unwrap();
      setValidationModalOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://attandece-managment-mern.onrender.com/api/attendance/export?teamOnly=true`, {
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

  const navItems = [
    { id: 'overview', label: 'Team Overview', icon: LayoutDashboard },
    { id: 'attendance', label: 'Team Attendance', icon: ClipboardList },
    { id: 'reports', label: 'Team Reports', icon: FileSpreadsheet },
    { id: 'overtime', label: 'Overtime Requests', icon: Clock },
  ];

  const handleOpenValidation = (record) => {
    setSelectedRecord(record);
    setValidationModalOpen(true);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-300 relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col shadow-2xl transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/20">
              <UsersIcon size={22} fill="white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-200">Manager Panel</span>
          </div>
          <button 
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { 
                setActiveTab(item.id); 
                setPage(1); 
                setSidebarOpen(false);
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
              {item.id === 'overtime' && pendingOtData?.total > 0 && (
                <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full ${activeTab === item.id ? 'bg-white text-emerald-600' : 'bg-rose-500 text-white ring-4 ring-rose-100 dark:ring-rose-900/30'}`}>
                  {pendingOtData?.total}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-100 dark:border-slate-800">
           <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors"
           >
              <LogOut size={20} />
              Sign Out
           </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        <Header 
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setProfileModalOpen={setProfileModalOpen}
          onMenuClick={() => setSidebarOpen(true)}
        />


        <main className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar bg-[#F8FAFC] dark:bg-slate-950">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'overview' && (
              <OverviewTab 
                userData={teamData} 
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
          </div>
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

export default ManagerDashboard;

