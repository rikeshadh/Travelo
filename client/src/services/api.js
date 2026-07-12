import axios from 'axios';

// Set global base configuration
axios.defaults.baseURL = ''; // Vite proxy forwards to port 5000 in development
axios.defaults.headers.post['Content-Type'] = 'application/json';

// Retrieve token helper
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const propertyService = {
  getProperties: async (params) => {
    const res = await axios.get('/api/properties', { params });
    return res.data;
  },
  getPropertyDetails: async (id) => {
    const res = await axios.get(`/api/properties/${id}`);
    return res.data;
  },
  createReview: async (id, reviewData) => {
    const res = await axios.post(`/api/properties/${id}/reviews`, reviewData);
    return res.data;
  }
};

export const bookingService = {
  createBooking: async (bookingData) => {
    const res = await axios.post('/api/bookings', bookingData);
    return res.data;
  },
  getUserBookings: async () => {
    const res = await axios.get('/api/bookings/user');
    return res.data;
  },
  cancelBooking: async (id) => {
    const res = await axios.put(`/api/bookings/${id}/cancel`);
    return res.data;
  }
};

export const chatService = {
  getMessages: async (userId) => {
    const res = await axios.get('/api/chat/messages', { params: { userId } });
    return res.data;
  },
  sendMessage: async (messageData) => {
    const res = await axios.post('/api/chat/send', messageData);
    return res.data;
  },
  getConversations: async () => {
    const res = await axios.get('/api/chat/admin/conversations');
    return res.data;
  }
};

export const adminService = {
  getAnalytics: async () => {
    const res = await axios.get('/api/admin/analytics');
    return res.data;
  },
  getUsers: async () => {
    const res = await axios.get('/api/admin/users');
    return res.data;
  },
  updateUserRole: async (id, role) => {
    const res = await axios.put(`/api/admin/users/${id}/role`, { role });
    return res.data;
  },
  deleteUser: async (id) => {
    const res = await axios.delete(`/api/admin/users/${id}`);
    return res.data;
  },
  getBookings: async () => {
    const res = await axios.get('/api/admin/bookings');
    return res.data;
  },
  createProperty: async (propertyData) => {
    const res = await axios.post('/api/admin/properties', propertyData);
    return res.data;
  },
  updateProperty: async (id, propertyData) => {
    const res = await axios.put(`/api/admin/properties/${id}`, propertyData);
    return res.data;
  },
  deleteProperty: async (id) => {
    const res = await axios.delete(`/api/admin/properties/${id}`);
    return res.data;
  }
};
