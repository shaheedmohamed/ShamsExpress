import api from '../config/api';

export const driverService = {
  getDashboard: async () => {
    const response = await api.get('/driver/dashboard');
    return response.data;
  },

  getAvailableOrders: async () => {
    const response = await api.get('/driver/available-orders');
    return response.data;
  },

  getMyOrders: async () => {
    const response = await api.get('/driver/my-orders');
    return response.data;
  },

  acceptOrder: async (orderId) => {
    const response = await api.post(`/driver/orders/${orderId}/accept`);
    return response.data;
  },

  updateOrderStatus: async (orderId, status, notes = '') => {
    const response = await api.put(`/driver/orders/${orderId}/status`, {
      status,
      notes,
    });
    return response.data;
  },
};
