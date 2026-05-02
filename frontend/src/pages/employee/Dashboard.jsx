import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { 
  LogOut, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { 
  usePunchInMutation, 
  usePunchOutMutation, 
  useGetMyAttendanceQuery, 
  useGetTodayAttendanceQuery 
} from '../../features/attendance/attendanceApi';
import { useGetUserProfileQuery } from '../../features/users/userApi';
import moment from 'moment';

// Sub-components
import PunchCard from './components/PunchCard';
import StatsGrid from './components/StatsGrid';
import ProfileBrief from './components/ProfileBrief';
import RecentActivity from './components/RecentActivity';
import ThemeToggle from '../../components/ThemeToggle';

const Dashboard = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // API Hooks
  const { data: userProfile } = useGetUserProfileQuery();
  const { data: todayAttendance, isLoading: isTodayLoading } = useGetTodayAttendanceQuery();
  const { data: attendanceHistory, isLoading: isHistoryLoading } = useGetMyAttendanceQuery({ limit: 5 });
  const [punchIn, { isLoading: isPunchingIn }] = usePunchInMutation();
  const [punchOut, { isLoading: isPunchingOut }] = usePunchOutMutation();

  const isPunchedIn = todayAttendance && todayAttendance.length > 0;
  const isPunchedOut = isPunchedIn && todayAttendance[0].punchOut;

  // Get current location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          });
        },
        (err) => {
          setError("Please enable location access to mark attendance.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const handlePunchIn = async () => {
    if (!webcamRef.current) return;
    if (!location) {
      setError("Waiting for location... Please ensure GPS is on.");
      return;
    }

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setError("Failed to capture selfie. Please try again.");
      return;
    }

    try {
      await punchIn({
        selfie: imageSrc,
        latitude: location.latitude,
        longitude: location.longitude
      }).unwrap();
      setError(null);
    } catch (err) {
      setError(err?.data?.message || "Punch-in failed. Check your distance from office.");
    }
  };

  const handlePunchOut = async () => {
    if (!location) {
      setError("Waiting for location...");
      return;
    }

    try {
      await punchOut({
        latitude: location.latitude,
        longitude: location.longitude
      }).unwrap();
      setError(null);
    } catch (err) {
      setError(err?.data?.message || "Punch-out failed.");
    }
  };

  const videoConstraints = {
    width: 720,
    height: 720,
    facingMode: "user"
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] dark:bg-slate-950 p-4 lg:p-8 transition-colors duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
              Employee Portal
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {moment().format('dddd, MMMM Do YYYY')}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium border shadow-sm transition-all duration-700 ${
              isPunchedIn && !isPunchedOut 
                ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 ring-4 ring-emerald-50 dark:ring-emerald-500/5' 
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isPunchedIn && !isPunchedOut ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              {isPunchedIn && !isPunchedOut ? 'Currently Punched In' : isPunchedOut ? 'Shift Completed' : 'Not Punched In'}
            </div>

            <ThemeToggle />

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
          </div>
        </header>

        {/* Error Alert */}
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-700 px-4 py-3 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
            <button onClick={() => setError(null)} className="ml-auto text-rose-400 hover:text-rose-600">×</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Action Section (LHS) */}
          <div className="lg:col-span-8 space-y-8">
            <PunchCard 
              isPunchedIn={isPunchedIn}
              isPunchedOut={isPunchedOut}
              isCameraOpen={isCameraOpen}
              setIsCameraOpen={setIsCameraOpen}
              webcamRef={webcamRef}
              videoConstraints={videoConstraints}
              location={location}
              todayAttendance={todayAttendance}
              handlePunchIn={handlePunchIn}
              handlePunchOut={handlePunchOut}
              isPunchingIn={isPunchingIn}
              isPunchingOut={isPunchingOut}
            />
            <StatsGrid />
          </div>

          {/* Sidebar Section (RHS) */}
          <div className="lg:col-span-4 space-y-8">
            <ProfileBrief profile={userProfile} />
            <RecentActivity 
              attendanceHistory={attendanceHistory}
              isLoading={isHistoryLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
