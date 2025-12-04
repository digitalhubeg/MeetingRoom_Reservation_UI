import { useEffect, useState } from 'react';

// We can define the enums here for the form
const RecurrenceType = {
  Daily: 'Daily',
  Weekly: 'Weekly',
  Monthly: 'Monthly',
};

const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const hours = d.getHours().toString().padStart(2, '0');
  const minutes = d.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};
// Helper function to format Date object into YYYY-MM-DD (e.g., 2025-11-23)
const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const day = d.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};


export default function BookingForm({ initialData, onSubmit, onCancel, rooms }) {
  const isEditing = initialData && initialData.bookingId;

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    roomId: initialData?.roomId || '',
    attendeeEmails: initialData?.attendeeEmails || '',
    // Use helpers to set initial state based on incoming data
    date: formatDate(initialData?.start),
    startTime: formatTime(initialData?.start),
    endTime: formatTime(initialData?.end),
  });

  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState({
    type: RecurrenceType.Weekly,
    endDate: '',
  });

  // Load initialData into the form state when it changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        roomId: initialData.roomId || '',
        attendeeEmails: initialData.attendeeEmails || '',
        date: formatDate(initialData.start),
        startTime: formatTime(initialData.start),
        endTime: formatTime(initialData.end),
      });
      setIsRecurring(false); // Reset recurrence on new slot
    }
  }, [initialData?.bookingId, initialData?.start]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRecurrenceChange = (e) => {
    const { name, value } = e.target;
    setRecurrence(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.endTime <= formData.startTime) {
      alert('End time must be after start time.');
      return;
    }

    const submissionData = {
      ...formData,
      isRecurring,
      recurrence: isRecurring ? recurrence : null,
    };

    onSubmit(submissionData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Meeting Title / Reason
        </label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
        />
      </div>

      <div>
        <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">
          Room
        </label>
        <select
          name="roomId"
          id="roomId"
          value={formData.roomId}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
        >
          <option value="" disabled>Select a room</option>
          {rooms.map(room => (
            <option key={room.roomId} value={room.roomId}>
              {room.name} ({room.location})
            </option>
          ))}
        </select>
      </div>

      {/* --- TIME/DATE INPUTS: WILL NOW BE PRE-FILLED --- */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            name="date"
            id="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
          />
        </div>
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700">Start Time</label>
          <input
            type="time"
            name="startTime"
            id="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
          />
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700">End Time</label>
          <input
            type="time"
            name="endTime"
            id="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
          />
        </div>
      </div>
      {/* --- END TIME/DATE INPUTS --- */}
      
      <div>
        <label htmlFor="attendeeEmails" className="block text-sm font-medium text-gray-700">
          Attendees (comma-separated emails)
        </label>
        <input
          type="text"
          name="attendeeEmails"
          id="attendeeEmails"
          value={formData.attendeeEmails}
          onChange={handleChange}
          placeholder="user1@company.com, user2@company.com"
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
        />
      </div>

      {/* RECURRENCE UI SECTION */}
      <div className="pt-4 border-t border-gray-200">
        {/* ... (Recurrence Checkbox and inputs logic) ... */}
        <div className="flex items-center">
          <input
            id="isRecurring"
            name="isRecurring"
            type="checkbox"
            checked={isRecurring}
            onChange={(e) => setIsRecurring(e.target.checked)}
            className="w-4 h-4 text-[#0c72a1] border-gray-300 rounded focus:ring-[#0c72a1]"
          />
          <label htmlFor="isRecurring" className="ml-2 block text-sm font-medium text-gray-900">
            Make this a recurring booking
          </label>
        </div>

        {isRecurring && (
          <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded-md border">
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700">Repeats</label>
              <select
                name="type"
                id="type"
                value={recurrence.type}
                onChange={handleRecurrenceChange}
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
              >
                <option value={RecurrenceType.Daily}>Daily</option>
                <option value={RecurrenceType.Weekly}>Weekly</option>
                <option value={RecurrenceType.Monthly}>Monthly</option>
              </select>
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
              <input
                type="date"
                name="endDate"
                id="endDate"
                value={recurrence.endDate}
                onChange={handleRecurrenceChange}
                required
                className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
              />
            </div>
          </div>
        )}
      </div>
      
      <div className="pt-4 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 font-bold text-white bg-[#0c72a1] rounded-md hover:bg-opacity-90"
        >
          Submit Request
        </button>
      </div>
    </form>
  );
}