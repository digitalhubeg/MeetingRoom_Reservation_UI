// src/App.jsx
import { BrowserRouter, Route, Routes } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';

// Route Guards
import AdminRoute from './components/shared/AdminRoute';
import ProtectedRoute from './components/shared/ProtectedRoute';

// Pages
import AllBookingsPage from './pages/admin/AllBookingsPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import EmployeeManagementPage from './pages/admin/EmployeeManagementPage';
import ReportingDashboardPage from './pages/admin/ReportingDashboardPage';
import RoomManagementPage from './pages/admin/RoomManagementPage';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/employee/DashboardPage';
import MyBookingsPage from './pages/employee/MyBookingsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* PROTECTED ROUTES (all roles) */}
        {/* MainLayout renders children via Outlet */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="my-bookings" element={<MyBookingsPage />} />

          {/* ADMIN-ONLY ROUTES */}
          <Route path="admin" element={<AdminRoute />}>
            <Route index element={<AdminDashboard />} />
            <Route path="rooms" element={<RoomManagementPage />} />
            <Route path="employees" element={<EmployeeManagementPage />} />
            <Route path="reports" element={<ReportingDashboardPage />} />
            <Route path="all-bookings" element={<AllBookingsPage />} />
          </Route>
        </Route>

        {/* 404 NOT FOUND */}
        <Route path="*" element={
          <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold">404 - Page Not Found</h1>
          </div>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;