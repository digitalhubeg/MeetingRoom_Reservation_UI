// src/services/roomService.js
import apiClient from './apiClient';

const getRooms = () => {
  return apiClient.get('/rooms');
};

const createRoom = (roomData) => {
  return apiClient.post('/rooms', roomData);
};

const updateRoom = (id, roomData) => {
  return apiClient.put(`/rooms/${id}`, roomData);
};

const deleteRoom = (id) => {
  return apiClient.delete(`/rooms/${id}`);
};

const roomService = {
  getRooms,
  createRoom,
  updateRoom,
  deleteRoom,
};

export default roomService;

