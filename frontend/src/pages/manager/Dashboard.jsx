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
  ClipboardList, Clock, LayoutDashboard, FileSpreadsheet
} from 'lucide-react';
import moment from 'moment';

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
  const [searchQuery, setSearchQuery] = useState('');

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
    <div className="flex h-screen bg-[#F8FAFC] dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-hidden font-sans transition-colors duration-300">
      
      <Sidebar 
        navItems={navItems}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setPage={setPage}
        refetchAttendance={refetchAttendance}
        pendingOtCount={pendingOtData?.total}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col relative overflow-hidden">
        
        <Header 
          activeTab={activeTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          adminProfile={adminProfile}
          setProfileModalOpen={setProfileModalOpen}
        />

        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
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
