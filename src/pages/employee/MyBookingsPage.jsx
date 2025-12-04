// src/pages/employee/MyBookingsPage.jsx
import { useEffect, useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { BookingStatus } from '../../data/mockData'; // We still need the enums
import bookingService from '../../services/bookingService'; // <-- 1. Import service
import BookingModal from '../../components/shared/BookingModal';

// Helper to format date/time
const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

// StatusBadge component (no change)
const StatusBadge = ({ status }) => {
  let className = 'px-2 py-0.5 text-xs font-medium rounded-full';
  
  if (status === BookingStatus.Confirmed) {
    className += ' bg-green-100 text-green-800';
  } else if (status === BookingStatus.PendingApproval) {
    className += ' bg-yellow-100 text-yellow-800';
  } else if (status === BookingStatus.Denied) {
    className += ' bg-red-100 text-red-800';
  } else {
    className += ' bg-gray-100 text-gray-800';
  }

  return <span className={className}>{status}</span>;
};


export default function MyBookingsPage() {
  const [myBookings, setMyBookings] = useState([]); // <-- 2. Start with empty array
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // --- 3. Function to fetch data ---
  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getMyBookings();
      setMyBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch my bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- 4. Fetch data on page load ---
  useEffect(() => {
    fetchMyBookings();
  }, []);

  // --- 5. Update Action Handlers ---
  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleCancel = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(bookingId);
        // Refresh the list after canceling
        fetchMyBookings();
      } catch (error) {
        console.error('Failed to cancel booking:', error);
        alert(error.response?.data || 'Failed to cancel booking.');
      }
    }
  };

  const handleUpdateBooking = async (formData) => {
    if (!selectedBooking) return;

    const { date, startTime, endTime, ...rest } = formData;
    const submissionData = {
      ...rest,
      startTime: `${date}T${startTime}`,
      endTime: `${date}T${endTime}`,
    };

    try {
      await bookingService.updateBooking(selectedBooking.bookingId, submissionData);
      setIsModalOpen(false);
      fetchMyBookings(); // Refresh the list
    } catch (error) {
      console.error('Failed to update booking:', error);
      alert(error.response?.data || 'Failed to update booking.');
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Bookings</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-6 text-center">Loading bookings...</p>
          ) : myBookings.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {myBookings.map(booking => {
                  const isPastBooking = new Date(booking.endTime) < new Date();
                  return (
                    <tr key={booking.bookingId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{booking.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.roomName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(booking.startTime)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(booking.endTime)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        <button 
                          onClick={() => handleEdit(booking)} 
                          className={isPastBooking ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-900"}
                          title={isPastBooking ? "Cannot edit a past booking" : "Edit"}
                          disabled={isPastBooking}
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleCancel(booking.bookingId)} 
                          className={isPastBooking ? "text-gray-400 cursor-not-allowed" : "text-red-600 hover:text-red-900"}
                          title={isPastBooking ? "Cannot cancel a past booking" : "Cancel"}
                          disabled={isPastBooking}
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-gray-500">You have no bookings.</p>
          )}
        </div>
      </div>
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedBooking}
        onSubmit={handleUpdateBooking}
      />
    </div>
  );
}