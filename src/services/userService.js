// src/services/userService.js
import apiClient from './apiClient';

const getUsers = () => {
  return apiClient.get('/users');
};

const createUser = (userData) => {
  return apiClient.post('/users', userData);
};

const updateUser = (id, userData) => {
  return apiClient.put(`/users/${id}`, userData);
};

const deleteUser = (id) => {
  return apiClient.delete(`/users/${id}`);
};

const forgotPassword = (email) => {
  return apiClient.post('/auth/forgot-password', email);
};

const resetPassword = (data) => {
  return apiClient.post('/auth/reset-password', data);
};

const userService = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
};

export default userService;