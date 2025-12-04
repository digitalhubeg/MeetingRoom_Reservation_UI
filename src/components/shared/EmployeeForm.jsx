// src/components/shared/EmployeeForm.jsx
import { useEffect, useState } from 'react';
import { UserRole } from '../../data/mockData';

export default function EmployeeForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phoneNumber: '', // <-- 1. Add to default state
    role: UserRole.Employee,
    password: '',
  });

  const isEditing = !!initialData;

  useEffect(() => {
    if (initialData) {
      setFormData({
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        phoneNumber: initialData.phoneNumber || '', // <-- 2. Load initial data
        role: initialData.role || UserRole.Employee,
        password: '', // Don't pre-fill password
      });
    } else {
      // Reset for "Add New"
      setFormData({
        fullName: '',
        email: '',
        phoneNumber: '', // <-- 3. Reset for new
        role: UserRole.Employee,
        password: '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          name="fullName"
          id="fullName"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <select
            name="role"
            id="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
          >
            <option value={UserRole.Employee}>Employee</option>
            <option value={UserRole.Admin}>Admin</option>
          </select>
        </div>
      </div>

      {/* --- 4. ADD THIS NEW INPUT FIELD --- */}
      <div>
        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
          Phone Number (e.g., 15551234567)
        </label>
        <input
          type="tel"
          name="phoneNumber"
          id="phoneNumber"
          value={formData.phoneNumber}
          onChange={handleChange}
          placeholder="15551234567"
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
        />
      </div>
      {/* --- END OF NEW FIELD --- */}

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Password {isEditing ? '(Leave blank to keep unchanged)' : ''}
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          required={!isEditing} // Required when creating, not when editing
          className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md"
        />
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
          Save Employee
        </button>
      </div>
    </form>
  );
}