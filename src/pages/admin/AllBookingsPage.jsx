// src/pages/admin/AllBookingsPage.jsx
import { useEffect, useState } from 'react';
import { FiEdit, FiX } from 'react-icons/fi';
import BookingModal from '../../components/shared/BookingModal';
import bookingService from '../../services/bookingService';
import { BookingStatus } from '../../utils/constants';

// Helper to format date/time
const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

// StatusBadge component
const StatusBadge = ({ status }) => {
  let className = 'px-2 py-0.5 text-xs font-medium rounded-full';
  
  if (status === BookingStatus.Confirmed) {
    className += ' bg-green-100 text-green-800';
  } else if (status === BookingStatus.PendingApproval) {
    className += ' bg-yellow-100 text-yellow-800';
  } else if (status === BookingStatus.Denied) {
    className += ' bg-red-100 text-red-800';
  } else if (status === BookingStatus.Canceled) {
    className += ' bg-gray-100 text-gray-800';
  }

  return <span className={className}>{status}</span>;
};

export default function AllBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchAllBookings = async () => {
    try {
      setLoading(true);
      const response = await bookingService.getAllBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Failed to fetch all bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const handleEdit = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  const handleDelete = async (bookingId) => {
    if (window.confirm('Are you sure you want to permanently delete this booking? This action cannot be undone.')) {
      try {
        await bookingService.deleteBooking(bookingId);
        fetchAllBookings(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete booking:', error);
        alert(error.response?.data || 'Failed to delete booking.');
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
      fetchAllBookings(); // Refresh the list
    } catch (error) {
      console.error('Failed to update booking:', error);
      alert(error.response?.data || 'Failed to update booking.');
    }
  };
  
  const handleCancel = async (booking) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        let idToCancel = null;
        let isRecurringBooking = false;

        // If RecurringBookingId is present and positive, it's a recurring series
        if (booking.RecurringBookingId && booking.RecurringBookingId > 0) {
          idToCancel = booking.RecurringBookingId;
          isRecurringBooking = true;
        } 
        // If not a recurring series, or RecurringBookingId is 0/-ve, then use BookingId
        else if (booking.BookingId) {
          idToCancel = booking.BookingId;
        }

        if (idToCancel === null || idToCancel === undefined) {
          console.error("Attempted to cancel a booking with no valid ID:", booking);
          alert("Error: Cannot cancel booking without a valid ID.");
          return;
        }

        if (isRecurringBooking) {
          await bookingService.cancelRecurringBooking(idToCancel);
        } else {
          await bookingService.cancelBooking(idToCancel);
        }
        
        // Refresh the list after canceling
        fetchAllBookings();
      } catch (error) {
        console.error('Failed to cancel booking:', error);
        alert(error.response?.data || 'Failed to cancel booking.');
      }
    }
  };

  const filteredBookings = bookings.filter(booking =>
    booking.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.roomName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    booking.organizerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">All Bookings</h1>
        <div className="w-1/3">
          <input
            type="text"
            placeholder="Search by title, room, or organizer"
            className="w-full px-4 py-2 border rounded-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-6 text-center">Loading bookings...</p>
          ) : filteredBookings.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Organizer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">End Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map(booking => {
                  const isPast = new Date(booking.endTime) < new Date();
                  return (
                    <tr key={booking.bookingId}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{booking.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.roomName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.organizerName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(booking.startTime)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDateTime(booking.endTime)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                        <button 
                          onClick={() => handleEdit(booking)} 
                          className={isPast ? "text-gray-400 cursor-not-allowed" : "text-blue-600 hover:text-blue-900"}
                          title={isPast ? "Cannot edit a past booking" : "Edit"}
                          disabled={isPast}
                        >
                          <FiEdit className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleCancel(booking)} 
                          className={isPast ? "text-gray-400 cursor-not-allowed" : "text-yellow-600 hover:text-yellow-900"}
                          title={isPast ? "Cannot cancel a past booking" : "Cancel"}
                          disabled={isPast}
                        >
                          <FiX className="w-5 h-5" />
                        </button>

                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="p-6 text-gray-500">No bookings found.</p>
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
