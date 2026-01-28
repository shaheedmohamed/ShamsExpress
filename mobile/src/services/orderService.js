import api from '../config/api';

export const orderService = {
  async getOrders() {
    const response = await api.get('/orders');
    return response.data;
  },

  async getOrder(id) {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  async createOrder(orderData) {
    const response = await api.post('/orders', orderData);
    return response.data;
  },

  async updateOrderStatus(id, status, notes) {
    const response = await api.put(`/orders/${id}/status`, { status, notes });
    return response.data;
  },

  async cancelOrder(id) {
    const response = await api.post(`/orders/${id}/cancel`);
    return response.data;
  },

  async getStatistics() {
    const response = await api.get('/statistics');
    return response.data;
  },
};
