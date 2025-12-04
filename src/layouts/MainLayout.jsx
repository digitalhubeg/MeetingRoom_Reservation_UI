// src/layouts/MainLayout.jsx
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';

export default function MainLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar (Fixed) */}
      <Sidebar />

      {/* Main Content Area (Scrollable) */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Page Content (Scrollable) */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-100">
          {/* Outlet renders the active child route */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}