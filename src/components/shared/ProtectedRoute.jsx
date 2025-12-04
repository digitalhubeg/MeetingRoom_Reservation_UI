// src/components/shared/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect them to the / login page, but save the location they were
    // trying to go to so we can send them there after they login.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}