import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AdminRoute() {
  const { userInfo } = useSelector((state) => state.auth);

  // If logged in AND is admin, show the admin pages (Outlet)
  // Otherwise, redirect to Login
  return userInfo && userInfo.isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
}