// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from 'react';
import { FiCheck, FiX } from 'react-icons/fi';
import bookingService from '../../services/bookingService';

export default function AdminDashboard() {
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovalQueue = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getPendingBookings();
      setPendingItems(response.data);
    } catch (error)
      {
      console.error('Failed to fetch approval queue:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovalQueue();
  }, []);

  const handleApprove = async (item) => {
    const isRecurring = item.type === 'Recurring';
    const message = isRecurring
      ? 'Are you sure you want to approve this recurring booking series? This will create all valid bookings in the series.'
      : 'Are you sure you want to approve this booking?';

    if (window.confirm(message)) {
      try {
        if (isRecurring) {
          await bookingService.approveRecurringBooking(item.id);
        } else {
          await bookingService.approveBooking(item.id);
        }
        fetchApprovalQueue(); // Refresh the list
      } catch (error) {
        console.error(`Failed to approve ${item.type} booking:`, error);
        alert(error.response?.data?.message || `Failed to approve ${item.type}.`);
      }
    }
  };

  const handleDeny = async (item) => {
    const isRecurring = item.type === 'Recurring';
    const reason = window.prompt(`Please provide a reason for denying this ${item.type} booking:`);

    if (reason) {
      if (window.confirm('Are you sure you want to deny this booking?')) {
        try {
          if (isRecurring) {
            await bookingService.denyRecurringBooking(item.id, reason);
          } else {
            await bookingService.denyBooking(item.id, reason);
          }
          fetchApprovalQueue(); // Refresh the list
        } catch (error) {
          console.error(`Failed to deny ${item.type} booking:`, error);
          alert(error.response?.data?.message || `Failed to deny ${item.type}.`);
        }
      }
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Booking Approval Queue</h1>
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-6 text-center">Loading pending bookings...</p>
          ) : pendingItems.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingItems.map(item => {
                  const key = `${item.Type}-${item.Id}`;
                  const isPast = new Date(item.StartDate) < new Date();
                  return (
                  <tr key={key}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${item.type === 'Recurring' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                        {item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {item.organizerName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.roomName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.details}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button 
                        onClick={() => handleApprove(item)} 
                        className={`p-2 text-white rounded-full ${isPast ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                        title={isPast ? "Cannot approve a past booking" : "Approve"}
                        disabled={isPast}
                      >
                        <FiCheck className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDeny(item)} 
                        className={`p-2 text-white rounded-full ${isPast ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                        title={isPast ? "Cannot deny a past booking" : "Deny"}
                        disabled={isPast}
                      >
                        <FiX className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-gray-500">No pending bookings.</p>
          )}
        </div>
      </div>
    </div>
  );
}