// src/components/shared/EmployeeModal.jsx
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiX } from 'react-icons/fi';
import EmployeeForm from './EmployeeForm';

export default function EmployeeModal({ isOpen, onClose, onSubmit, initialData }) {
  const isEditing = !!initialData;

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-4">
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
                <div className="flex items-start justify-between">
                  <Dialog.Title as="h3" className="text-xl font-semibold text-gray-900">
                    {isEditing ? 'Edit Employee' : 'Add New Employee'}
                  </Dialog.Title>
                  <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <FiX className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="mt-6">
                  <EmployeeForm 
                    initialData={initialData}
                    onSubmit={onSubmit}
                    onCancel={onClose}
                  />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}