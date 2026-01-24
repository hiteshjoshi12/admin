import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function PrivateRoute() {
  const { userInfo } = useSelector((state) => state.auth);

  // If user is logged in, show the page (Outlet). If not, redirect to login.
  return userInfo ? <Outlet /> : <Navigate to="/login" replace />;
}