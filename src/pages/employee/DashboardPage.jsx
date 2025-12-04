// src/pages/employee/DashboardPage.jsx
import format from 'date-fns/format';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import { useCallback, useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import BookingDetailsModal from '../../components/shared/BookingDetailsModal';
import BookingModal from '../../components/shared/BookingModal';
import { useAuth } from '../../contexts/AuthContext';
import bookingService from '../../services/bookingService';
import roomService from '../../services/roomService';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const CustomEvent = ({ event }) => {
  const { title, resource } = event;
  const description = resource.description || '';

  return (
    <div className="p-1 h-full flex flex-col justify-center text-white">
      <p className="font-bold text-xs truncate">{title}</p>
      {description && <p className="text-xs truncate">{description}</p>}
    </div>
  );
};

export default function DashboardPage() {
  const { user, isAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState('all');
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [canEdit, setCanEdit] = useState(false);
  const [currentView, setCurrentView] = useState('week');
  const [currentDate, setCurrentDate] = useState(new Date());

  const fetchBookings = useCallback(async (start, end) => {
    setLoading(true);
    try {
      const response = await bookingService.getDashboardBookings(start, end);
      const formattedEvents = response.data.map(booking => ({
        title: `${booking.title} (${booking.roomName})`,
        start: new Date(booking.startTime),
        end: new Date(booking.endTime),
        resource: booking,
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await roomService.getRooms();
        setRooms(response.data);
      } catch (error) {
        console.error("Failed to fetch rooms:", error);
      }
    };
    fetchRooms();
  }, []);

  useEffect(() => {
    const startDate = new Date(currentDate);
    const endDate = new Date(currentDate);
    startDate.setDate(startDate.getDate() - 14);
    endDate.setDate(endDate.getDate() + 14);
    fetchBookings(startDate, endDate);
  }, [currentDate, currentView, fetchBookings]);

  const handleSelectSlot = (slotInfo) => {
    if (new Date(slotInfo.start) < new Date()) {
      alert("Cannot book a meeting in the past.");
      return;
    }
    setSelectedEvent(null);
    const initialData = {
      start: new Date(slotInfo.start),
      end: new Date(slotInfo.end),
      roomId: selectedRoomId !== 'all' ? parseInt(selectedRoomId) : '',
    };
    setSelectedSlot(initialData);
    setIsCreateModalOpen(true);
  };

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
    const isOwner = user?.userId && event.resource.organizerUserId === user.userId;
    setCanEdit(isAdmin || isOwner);
    setIsDetailsModalOpen(true);
  };

  const handleNavigate = (newDate) => {
    setCurrentDate(newDate);
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
  };

  const slotPropGetter = useCallback(
    (date) => (new Date(date) < new Date() ? { className: 'bg-red-100 cursor-not-allowed' } : {}),
    []
  );

  const eventPropGetter = useCallback(
    (event) => {
      const isPast = new Date(event.end) < new Date();
      const isSelected = selectedEvent && selectedEvent.resource.bookingId === event.resource.bookingId;
      let className = 'rbc-event rounded-lg';
      if (isPast) {
        className += ' bg-gray-400 hover:bg-gray-500';
      } else {
        className += ' bg-blue-500 hover:bg-blue-600';
      }
      if (isSelected) {
        className += ' ring-2 ring-blue-900';
      }
      return { className };
    },
    [selectedEvent]
  );

  const handleCancelBooking = async () => {
    if (!selectedEvent) return;
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        await bookingService.cancelBooking(selectedEvent.resource.bookingId);
        setIsDetailsModalOpen(false);
        fetchBookings(currentDate, currentDate);
      } catch (error) {
        console.error('Failed to cancel booking:', error);
        alert(error.response?.data || 'Failed to cancel booking.');
      }
    }
  };

  const handleEditBooking = () => {
    if (!selectedEvent) return;
    const { resource } = selectedEvent;
    const initialData = {
      ...resource,
      start: new Date(resource.startTime),
      end: new Date(resource.endTime),
    };
    setSelectedSlot(initialData);
    setIsDetailsModalOpen(false);
    setIsCreateModalOpen(true);
  };

  const handleModalSubmit = async (formData) => {
    try {
      const { date, startTime, endTime, isRecurring, recurrence, ...rest } = formData;
      const submissionData = { ...rest, startTime: `${date}T${startTime}`, endTime: `${date}T${endTime}` };

      if (isRecurring) {
        const recurringData = {
          ...submissionData,
          recurrence: { RecurrenceType: recurrence.type, SeriesEndDate: recurrence.endDate },
        };
        await bookingService.createRecurringBooking(recurringData);
      } else if (selectedEvent) {
        await bookingService.updateBooking(selectedEvent.resource.bookingId, submissionData);
      } else {
        await bookingService.createBooking(submissionData);
      }

      setIsCreateModalOpen(false);
      fetchBookings(currentDate, currentDate);
    } catch (error) {
      console.error('Failed to process booking:', error);
      alert(error.response?.data?.message || 'Failed to submit booking request.');
    }
  };

  const filteredEvents = selectedRoomId === 'all'
    ? events
    : events.filter(event => event.resource.roomId === parseInt(selectedRoomId));

  const RoomFilterButton = ({ roomId, name }) => (
    <button
      onClick={() => setSelectedRoomId(roomId)}
      className={`px-4 py-2 text-sm font-medium rounded-md mr-2 whitespace-nowrap ${selectedRoomId === roomId ? 'bg-[#0c72a1] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
        }`}
    >
      {name}
    </button>
  );

  return (
    <div className="h-full">
      <h1 className="text-3xl font-bold mb-4">Meeting Room Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-medium mb-2">Filter by Room</h2>
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4">
          <RoomFilterButton roomId="all" name="All Rooms" />
          {rooms.map(room => (
            <RoomFilterButton key={room.roomId} roomId={String(room.roomId)} name={room.name} />
          ))}
        </div>
      </div>

      <div className="p-4 bg-white rounded-lg shadow-md h-[800px]">
        {loading && <p>Loading events...</p>}
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          view={currentView}
          date={currentDate}
          onView={handleViewChange}
          onNavigate={handleNavigate}
          views={['month', 'week', 'day']}
          style={{ height: '100%' }}
          selectable={true}
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          slotPropGetter={slotPropGetter}
          eventPropGetter={eventPropGetter}
          components={{ event: CustomEvent }}
        />
      </div>

      <BookingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        initialData={selectedEvent ? selectedEvent.resource : selectedSlot}
        onSubmit={handleModalSubmit}
      />

      <BookingDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        event={selectedEvent}
        onEdit={handleEditBooking}
        onCancel={handleCancelBooking}
        canEdit={canEdit}
        isPast={selectedEvent && new Date(selectedEvent.end) < new Date()}
      />
    </div>
  );
}