import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiEdit, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import EmployeeModal from '../../components/shared/EmployeeModal';
import userService from '../../services/userService';

const RoleBadge = ({ role }) => {
  const className = `px-2 py-0.5 text-xs font-medium rounded-full ${
    role === 'Admin' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
  }`;
  return <span className={className}>{role}</span>;
};

export default function EmployeeManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    if (!lowercasedTerm) {
      return users;
    }
    return users.filter(user => 
      user.fullName.toLowerCase().includes(lowercasedTerm) ||
      user.email.toLowerCase().includes(lowercasedTerm)
    );
  }, [searchTerm, users]);

  const handleOpenAddModal = useCallback(() => {
    setSelectedUser(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (userId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      try {
        await userService.deleteUser(userId);
        setUsers(prev => prev.filter(u => u.userId !== userId));
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert(error.response?.data?.message || 'Failed to delete user. They may have existing bookings.');
      }
    }
  }, []);

  const handleModalSubmit = useCallback(async (formData) => {
    try {
      if (selectedUser) {
        await userService.updateUser(selectedUser.userId, formData);
      } else {
        await userService.createUser(formData);
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      console.error('Failed to save user:', error);
      alert(error.response?.data?.message || 'Failed to save user.');
    }
  }, [selectedUser, fetchUsers]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Employee Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0c72a1]"
            />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="flex items-center px-4 py-2 font-bold text-white bg-[#0c72a1] rounded-md hover:bg-opacity-90"
          >
            <FiPlus className="w-5 h-5 mr-2" />
            Add New Employee
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-6 text-center">Loading users...</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Full Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.userId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.phoneNumber}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button 
                        onClick={() => handleOpenEditModal(user)} 
                        className="text-blue-600 hover:text-blue-900" title="Edit">
                        <FiEdit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(user.userId)} 
                        className="text-red-600 hover:text-red-900" title="Delete">
                        <FiTrash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <EmployeeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedUser}
      />
    </div>
  );
}