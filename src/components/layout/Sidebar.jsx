// src/components/layout/Sidebar.jsx
import {
  FiBarChart2,
  FiBookOpen,
  FiCalendar,
  FiClipboard,
  FiHome,
  FiLogOut, FiSettings, FiUsers
} from 'react-icons/fi'; // Importing icons
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import digitalHubLogo from '../../assets/digitalHubLogo2.png'; // Import the logo

export default function Sidebar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to login page after logout
  };

  // Define a reusable NavLink style
  const linkClass = ({ isActive }) =>
    `flex items-center px-4 py-3 text-white rounded-lg hover:bg-sky-700 transition-colors duration-200 ${
      isActive ? 'bg-sky-700' : ''
    }`;

  return (
    <div className="flex flex-col w-64 h-screen px-4 py-8 bg-[#0c72a1] border-r">
      <div className="flex justify-center mb-6">
        <img src={digitalHubLogo} alt="Digital Hub Logo" className="w-32" />
      </div>
      <h2 className="text-3xl font-semibold text-center text-white">
        Room<span className="text-white">Reserve</span>
      </h2>

      <div className="flex flex-col items-center mt-6 -mx-2">
        {/* We'd add a user avatar here later */}
        <h4 className="mx-2 mt-2 font-medium text-white">
          {user.fullName}
        </h4>
        <p className="mx-2 mt-1 text-sm font-medium text-gray-200">
          {user.email}
        </p>
      </div>

      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav>
          {/* Employee Links */}
          <NavLink to="/dashboard" className={linkClass}>
            <FiHome className="w-5 h-5" />
            <span className="mx-4 font-medium">Dashboard</span>
          </NavLink>

          <NavLink to="/my-bookings" className={linkClass}>
            <FiCalendar className="w-5 h-5" />
            <span className="mx-4 font-medium">My Bookings</span>
          </NavLink>

          {/* Admin-Only Links */}
          {isAdmin && (
            <>
              <hr className="my-4 border-gray-400" />
              
              <NavLink to="/admin" className={linkClass} end>
                <FiClipboard className="w-5 h-5" />
                <span className="mx-4 font-medium">Approval Queue</span>
              </NavLink>

              <NavLink to="/admin/rooms" className={linkClass}>
                <FiSettings className="w-5 h-5" />
                <span className="mx-4 font-medium">Room Management</span>
              </NavLink>

              <NavLink to="/admin/employees" className={linkClass}>
                <FiUsers className="w-5 h-5" />
                <span className="mx-4 font-medium">User Management</span>
              </NavLink>

              <NavLink to="/admin/reports" className={linkClass}>
                <FiBarChart2 className="w-5 h-5" />
                <span className="mx-4 font-medium">Reports</span>
              </NavLink>

              <NavLink to="/admin/all-bookings" className={linkClass}>
                <FiBookOpen className="w-5 h-5" />
                <span className="mx-4 font-medium">All Bookings</span>
              </NavLink>
            </>
          )}
        </nav>

        {/* Logout Button */}
        <div>
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <FiLogOut className="w-5 h-5" />
            <span className="mx-4 font-medium">Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
}