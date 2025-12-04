// src/pages/admin/ReportingDashboardPage.jsx
import { useEffect, useMemo, useState } from 'react';
import { BookingStatus } from '../../data/mockData';
import bookingService from '../../services/bookingService';

// --- Helper Components ---
const formatDate = (date) => new Date(date).toLocaleDateString('en-US', { dateStyle: 'medium' });

const StatusBadge = ({ status }) => {
  let className = 'px-2 py-0.5 text-xs font-medium rounded-full';
  if (status === BookingStatus.Confirmed) className += ' bg-green-100 text-green-800';
  else if (status === BookingStatus.PendingApproval) className += ' bg-yellow-100 text-yellow-800';
  else if (status === BookingStatus.Denied) className += ' bg-red-100 text-red-800';
  else if (status === BookingStatus.Canceled) className += ' bg-gray-100 text-gray-800';
  else className += ' bg-gray-100 text-gray-800';
  return <span className={className}>{status}</span>;
};

const StatCard = ({ title, value }) => (
  <div className="p-4 bg-white rounded-lg shadow">
    <h3 className="text-sm font-medium text-gray-500">{title}</h3>
    <p className="mt-1 text-3xl font-semibold text-gray-900">{value}</p>
  </div>
);
// --- End Helper Components ---

export default function ReportingDashboardPage() {
  const [allBookings, setAllBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [filters, setFilters] = useState({
    status: 'all',
    startDate: '',
    endDate: '',
  });

  // --- Fetch data on page load ---
  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        setLoading(true);
        const response = await bookingService.getAllBookings();
        setAllBookings(response.data);
      } catch (error) {
        console.error('Failed to fetch all bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllBookings();
  }, []);

  // --- Client-side Filtering ---
  const filteredBookings = useMemo(() => {
    return allBookings.filter(booking => {
      // Status Filter
      if (filters.status !== 'all' && booking.status !== filters.status) {
        return false;
      }
      // Start Date Filter
      if (filters.startDate && new Date(booking.startTime) < new Date(filters.startDate)) {
        return false;
      }
      // End Date Filter
      if (filters.endDate && new Date(booking.startTime) > new Date(filters.endDate)) {
        return false;
      }
      return true;
    });
  }, [filters, allBookings]);
  
  // --- Calculate Stats ---
  const stats = useMemo(() => {
    return {
      total: filteredBookings.length,
      confirmed: filteredBookings.filter(b => b.status === BookingStatus.Confirmed).length,
      pending: filteredBookings.filter(b => b.status === BookingStatus.PendingApproval).length,
      denied: filteredBookings.filter(b => b.status === BookingStatus.Denied).length,
    };
  }, [filteredBookings]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Reporting & Analytics</h1>
      
      {/* --- Filter Section --- */}
      <div className="p-4 bg-white rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            >
              <option value="all">All</option>
              <option value={BookingStatus.Confirmed}>Confirmed</option>
              <option value={BookingStatus.PendingApproval}>Pending</option>
              <option value={BookingStatus.Denied}>Denied</option>
              <option value={BookingStatus.Canceled}>Canceled</option>
            </select>
          </div>
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              id="endDate"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>

      {/* --- Stats Cards Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <StatCard title="Total Bookings" value={stats.total} />
        <StatCard title="Confirmed" value={stats.confirmed} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Denied" value={stats.denied} />
      </div>

      {/* --- Master Log Table --- */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-xl font-semibold p-4">Master Log</h2>
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-6 text-center">Loading reports...</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map(b => (
                  <tr key={b.bookingId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{b.organizerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{b.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{b.roomName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(b.startTime)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={b.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}