// src/components/layout/Header.jsx
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Helper to get a clean page title from the URL
const getPageTitle = (pathname) => {
  switch (pathname) {
    case '/dashboard':
      return 'Dashboard';
    case '/my-bookings':
      return 'My Bookings';
    case '/admin':
      return 'Approval Queue';
    case '/admin/rooms':
      return 'Room Management';
    case '/admin/employees':
      return 'User Management';
    case '/admin/reports':
      return 'Reports & Analytics';
    default:
      return 'Welcome';
  }
};

// Helper to get user initials
const getInitials = (name) => {
  return name.split(' ')
    .map(n => n[0])
    .slice(0, 2)
    .join('');
};

export default function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="flex items-center justify-between h-16 px-6 py-4 bg-white border-b">
      {/* Page Title */}
      <h1 className="text-xl font-semibold text-gray-800">{pageTitle}</h1>

      {/* User Info */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500 text-white font-bold">
          {getInitials(user.fullName)}
        </div>
        <span className="text-sm font-medium text-gray-700">{user.fullName}</span>
      </div>
    </header>
  );
}