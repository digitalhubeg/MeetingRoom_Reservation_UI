// src/data/mockData.js

// Enums (using plain objects for simplicity)
export const UserRole = {
  Employee: 'Employee',
  Admin: 'Admin',
};

export const BookingStatus = {
  PendingApproval: 'PendingApproval',
  Confirmed: 'Confirmed',
  Canceled: 'Canceled',
  Denied: 'Denied',
};

// --- Mock Data ---

export const mockRooms = [
  { roomId: 1, name: 'Boardroom A', location: '1st Floor', capacity: 12, equipment: 'Projector, Whiteboard' },
  { roomId: 2, name: 'Focus Room (B)', location: '1st Floor', capacity: 4, equipment: 'TV, Whiteboard' },
  { roomId: 3, name: 'Conference Hall C', location: '2nd Floor', capacity: 30, equipment: 'Projector, Microphone' },
];

export const mockUsers = [
  { userId: 1, fullName: 'Alice Smith (Admin)', email: 'alice@company.com', role: UserRole.Admin, phoneNumber: '15551234567', passwordHash: 'hashed_password' },
  { userId: 2, fullName: 'Bob Johnson (Employee)', email: 'bob@company.com', role: UserRole.Employee, phoneNumber: '15551234567', passwordHash: 'hashed_password' },
];

export const mockBookings = [
  {
    bookingId: 101,
    title: 'Q4 Strategy Meeting',
    startTime: new Date('2025-11-17T09:00:00'),
    endTime: new Date('2025-11-17T11:00:00'),
    status: BookingStatus.Confirmed,
    attendeeEmails: 'bob@company.com,charlie@company.com',
    organizerUserId: 1, // Alice
    roomId: 1, // Boardroom A
  },
  {
    bookingId: 102,
    title: 'Weekly Sync',
    startTime: new Date('2025-11-17T14:00:00'),
    endTime: new Date('2025-11-17T15:00:00'),
    status: BookingStatus.PendingApproval,
    attendeeEmails: 'dave@company.com',
    organizerUserId: 2, // Bob
    roomId: 2, // Focus Room (B)
  },
  {
    bookingId: 103,
    title: 'Client Demo',
    startTime: new Date('2025-11-18T10:00:00'),
    endTime: new Date('2025-11-18T11:00:00'),
    status: BookingStatus.Confirmed,
    attendeeEmails: 'alice@company.com',
    organizerUserId: 2, // Bob
    roomId: 1, // Boardroom A
  },
];