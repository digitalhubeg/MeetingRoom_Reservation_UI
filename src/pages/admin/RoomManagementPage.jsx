import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiEdit, FiPlus, FiSearch, FiTrash2 } from 'react-icons/fi';
import RoomModal from '../../components/shared/RoomModal';
import roomService from '../../services/roomService';

export default function RoomManagementPage() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchRooms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await roomService.getRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  const filteredRooms = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    if (!lowercasedTerm) {
      return rooms;
    }
    return rooms.filter(room =>
      room.name.toLowerCase().includes(lowercasedTerm) ||
      (room.location && room.location.toLowerCase().includes(lowercasedTerm))
    );
  }, [searchTerm, rooms]);

  const handleOpenAddModal = useCallback(() => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  }, []);

  const handleOpenEditModal = useCallback((room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  }, []);

  const handleDelete = useCallback(async (roomId) => {
    if (window.confirm('Are you sure you want to delete this room?')) {
      try {
        await roomService.deleteRoom(roomId);
        setRooms(prev => prev.filter(r => r.roomId !== roomId));
      } catch (error) {
        console.error('Failed to delete room:', error);
        alert(error.response?.data?.message || 'Failed to delete room. It may have existing bookings.');
      }
    }
  }, []);

  const handleModalSubmit = useCallback(async (formData) => {
    try {
      if (selectedRoom) {
        await roomService.updateRoom(selectedRoom.roomId, formData);
      } else {
        await roomService.createRoom(formData);
      }
      setIsModalOpen(false);
      fetchRooms();
    } catch (error) {
      console.error('Failed to save room:', error);
      alert(error.response?.data?.message || 'Failed to save room.');
    }
  }, [selectedRoom, fetchRooms]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Room Management</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or location..."
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
            Add New Room
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="p-6 text-center">Loading rooms...</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Equipment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRooms.map(room => (
                  <tr key={room.roomId}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{room.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.capacity}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.equipment}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button 
                        onClick={() => handleOpenEditModal(room)} 
                        className="text-blue-600 hover:text-blue-900" title="Edit">
                        <FiEdit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(room.roomId)} 
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

      <RoomModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={selectedRoom}
      />
    </div>
  );
}