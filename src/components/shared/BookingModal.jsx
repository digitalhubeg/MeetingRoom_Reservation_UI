// src/components/shared/BookingModal.jsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { FiX } from 'react-icons/fi';
import roomService from '../../services/roomService';
import BookingForm from './BookingForm';

export default function BookingModal({ isOpen, onClose, initialData, onSubmit }) {
  const isEditing = initialData && initialData.bookingId;
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      roomService.getRooms()
        .then(response => {
          setRooms(response.data);
          setLoading(false);
        })
        .catch(error => {
          console.error("Failed to fetch rooms:", error);
          alert('Failed to fetch rooms. Please make sure you are logged in and that the backend is running.');
          setLoading(false);
        });
    }
  }, [isOpen]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        
        {/* Modal Backdrop */}
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
              <Dialog.Panel className="relative w-full max-w-2xl p-6 bg-white rounded-lg shadow-xl">
                <div className="flex items-start justify-between">
                  <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                    {isEditing ? 'Edit Booking' : 'Request New Booking'}
                  </Dialog.Title>
                  <button
                    type="button"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="mt-6">
                  {loading ? (
                    <p>Loading rooms...</p>
                  ) : (
                    <BookingForm 
                      initialData={initialData}
                      rooms={rooms}
                      onSubmit={onSubmit}
                      onCancel={onClose}
                    />
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