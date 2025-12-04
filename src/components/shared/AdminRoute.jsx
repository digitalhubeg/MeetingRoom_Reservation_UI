// src/components/shared/AdminRoute.jsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../data/mockData'; // Import our enum

export default function AdminRoute() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Not logged in at all
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (user.role !== UserRole.Admin) {
    // Logged in, but NOT an admin
    // Send them to their dashboard instead
    return <Navigate to="/dashboard" replace />;
  }

  // Logged in AND is an admin
  return (
    <>
      <Outlet />
    </>
  );}