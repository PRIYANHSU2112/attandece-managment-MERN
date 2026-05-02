import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../features/auth/authSlice';
import Auth from '../pages/Auth';
import EmployeeDashboard from '../pages/employee/Dashboard';
import AttendanceHistory from '../pages/employee/AttendanceHistory';
import PunchPage from '../pages/employee/PunchPage';
import OTRequest from '../pages/employee/OTRequest';
import ManagerDashboard from '../pages/manager/Dashboard';
import OTApprovals from '../pages/manager/OTApprovals';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminSettings from '../pages/admin/Settings';
import Validation from '../pages/admin/Validation';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  const user = useSelector(selectCurrentUser);

  return (
    <Routes>
      <Route path="/login" element={!user ? <Auth /> : <Navigate to="/" />} />
      <Route path="/register" element={<Navigate to="/login" />} />

      {/* Default redirect based on role */}
      <Route
        path="/"
        element={
          user ? (
            user.role === 'Admin' ? (
              <Navigate to="/admin" />
            ) : user.role === 'Manager' ? (
              <Navigate to="/manager" />
            ) : (
              <Navigate to="/employee" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />

      {/* Employee Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Employee']} />}>
        <Route path="/employee" element={<EmployeeDashboard />} />
        <Route path="/employee/history" element={<AttendanceHistory />} />
        <Route path="/employee/punch" element={<PunchPage />} />
        <Route path="/employee/ot-request" element={<OTRequest />} />
      </Route>

      {/* Manager Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Manager']} />}>
        <Route path="/manager" element={<ManagerDashboard />} />
        <Route path="/manager/ot-approvals" element={<OTApprovals />} />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/validation" element={<Validation />} />
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
