import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiAlertCircle, FiCalendar, FiClock, FiInfo, FiMail, FiMapPin, FiMessageSquare, FiUsers, FiX } from 'react-icons/fi';
import { BookingStatus } from '../../data/mockData'; // Keep this for the enum

// Helper function to format dates
const formatDateTime = (date) => {
  return new Date(date).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
};

export default function BookingDetailsModal({ isOpen, onClose, event, onEdit, onCancel, canEdit, isPast }) {

  if (!event) return null;

  const booking = event.resource;
  const isRequestable = new Date(booking.startTime) > new Date();

  // Create the shared text for the message
  const subject = `Request for room: ${booking.roomName} on ${formatDateTime(booking.startTime)}`;
  const body = `Hi ${booking.organizerName?.split(' ')[0] || ''},\n\nI'd like to request the time slot you have booked. Would you be available to reschedule?\n\nDetails:\nRoom: ${booking.roomName}\nTime: ${formatDateTime(booking.startTime)}\n\nThanks!`;

  const handleEmailRequest = () => {
    if (!booking.organizerEmail) return alert('Organizer email not available.');
    window.location.href = `mailto:${booking.organizerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };
  
  const handleWhatsAppRequest = () => {
    if (!booking.organizerPhoneNumber) return alert('Organizer phone number not available.');
    window.open(`https://wa.me/${booking.organizerPhoneNumber}?text=${encodeURIComponent(body)}`, '_blank');
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        {/* Backdrop */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4">
            {/* Modal Panel */}
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-lg p-6 bg-white rounded-lg shadow-xl">
                
                {/* Header */}
                <div className="flex items-start justify-between">
                  <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                    {booking.title}
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>

                {/* Status Badge */}
                {booking.status === BookingStatus.PendingApproval && (
                  <div className="inline-flex items-center px-3 py-1 mt-2 text-sm font-medium text-yellow-800 bg-yellow-100 rounded-full">
                    <FiAlertCircle className="w-4 h-4 mr-1.5" />
                    Pending Approval
                  </div>
                )}
                {booking.status === BookingStatus.Confirmed && (
                  <div className="inline-flex items-center px-3 py-1 mt-2 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                    Confirmed
                  </div>
                )}

                {/* Details Section */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center text-gray-700">
                    <FiCalendar className="w-5 h-5 mr-3 text-blue-500" />
                    <span>{formatDateTime(booking.startTime)}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FiClock className="w-5 h-5 mr-3 text-blue-500" />
                    <span>{formatDateTime(booking.endTime)}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <FiMapPin className="w-5 h-5 mr-3 text-blue-500" />
                    <span>{booking.roomName}</span>
                  </div>
                  <div className="flex items-start text-gray-700">
                    <FiUsers className="w-5 h-5 mr-3 text-blue-500" />
                    <span>Organizer: {booking.organizerName}</span>
                  </div>
                  <div className="flex items-start text-gray-700">
                    <FiUsers className="w-5 h-5 mr-3 text-blue-500" />
                    <span>{booking.attendeeEmails || 'No attendees listed'}</span>
                  </div>
                </div>

                {/* Buttons section */}
                <div className="pt-6 mt-6 border-t">
                  {canEdit ? (
                    isPast ? (
                      // If YOU are the owner and it IS a past booking:
                      <div className="flex items-center p-3 text-sm text-gray-600 bg-gray-100 rounded-md w-full justify-center">
                        <FiInfo className="w-5 h-5 mr-2" />
                        This meeting has ended.
                      </div>
                    ) : (
                      // If YOU are the owner and it's not a past booking:
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={onCancel}
                          className="px-4 py-2 text-sm font-medium text-red-700 bg-white border border-red-300 rounded-md hover:bg-red-50"
                        >
                          Cancel Booking
                        </button>
                        <button
                          type="button"
                          onClick={onEdit}
                          className="px-4 py-2 text-sm font-medium text-white bg-[#0c72a1] rounded-md hover:bg-opacity-90"
                        >
                          Edit
                        </button>
                      </div>
                    )
                  ) : (
                    // If you are NOT the owner:
                    <div>
                      <h4 className="text-sm font-medium text-gray-600 mb-3">Request Slot from Organizer:</h4>
                      {!isRequestable ? (
                        <div className="flex items-center p-3 text-sm text-gray-600 bg-gray-100 rounded-md">
                            <FiInfo className="w-5 h-5 mr-2" />
                            This time slot cannot be requested as it is in the past or already in progress.
                        </div>
                      ) : (
                        <div className="flex justify-end space-x-3">
                          {booking.organizerEmail && (
                            <button
                              type="button"
                              onClick={handleEmailRequest}
                              className="flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium text-white bg-[#0c72a1] rounded-md hover:bg-opacity-90"
                            >
                              <FiMail className="w-4 h-4 mr-2" />
                              Contact via Email
                            </button>
                          )}
                          {booking.organizerPhoneNumber && (
                            <button
                              type="button"
                              onClick={handleWhatsAppRequest}
                              className="flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600"
                            >
                              <FiMessageSquare className="w-4 h-4 mr-2" />
                              Contact via WhatsApp
                            </button>
                          )}
                          {!booking.organizerEmail && !booking.organizerPhoneNumber && (
                            <div className="flex items-center p-3 text-sm text-gray-600 bg-gray-100 rounded-md w-full">
                              <FiInfo className="w-5 h-5 mr-2" />
                              Organizer contact information not available.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}