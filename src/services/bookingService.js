// src/services/bookingService.js
import apiClient from './apiClient';

// GET /api/bookings/dashboard?start=...&end=...
const getDashboardBookings = (start, end) => {
  return apiClient.get('/bookings/dashboard', {
    params: { start, end }
  });
};

// GET /api/bookings/my
const getMyBookings = () => {
  return apiClient.get('/bookings/my');
};

// GET /api/admin/approval-queue
const getPendingBookings = () => {
  return apiClient.get('/admin/approval-queue');
};

// POST /api/bookings
const createBooking = (bookingData) => {
  return apiClient.post('/bookings', bookingData);
};

// POST /api/bookings/recurring
const createRecurringBooking = (bookingData) => {
  return apiClient.post('/bookings/recurring', bookingData);
};

// POST /api/admin/bookings/{id}/approve
const approveBooking = (id) => {
  return apiClient.post(`/admin/bookings/${id}/approve`);
};

// POST /api/admin/bookings/{id}/deny
const denyBooking = (id, reason) => {
  return apiClient.post(`/admin/bookings/${id}/deny`, { AdminDenialReason: reason });
};

// POST /api/recurring-bookings/{id}/approve
const approveRecurringBooking = (id) => {
  return apiClient.post(`/recurring-bookings/${id}/approve`);
};

// POST /api/recurring-bookings/{id}/deny
const denyRecurringBooking = (id, reason) => {
  return apiClient.post(`/recurring-bookings/${id}/deny`, { AdminDenialReason: reason });
}

const updateBooking = (id, bookingData) => {
  return apiClient.put(`/bookings/${id}`, bookingData);
};

const cancelBooking = (id) => {
  return apiClient.delete(`/bookings/${id}`);
};

const cancelRecurringBooking = (id) => {
  return apiClient.delete(`/recurring-bookings/${id}`);
};


const getAllBookings = () => {
  return apiClient.get('/bookings/all');
}


const bookingService = {
  getDashboardBookings,
  getMyBookings,
  getPendingBookings,
  createBooking,
  createRecurringBooking,
  approveBooking,
  denyBooking,
  approveRecurringBooking,
  denyRecurringBooking,
  updateBooking,
  cancelBooking,
  cancelRecurringBooking,
  getAllBookings,
};

export default bookingService;