import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const API_URL =
  Constants?.expoConfig?.extra?.apiUrl ||
  Constants?.manifest?.extra?.apiUrl ||
  'http://10.0.2.2:8000/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }

    if (!error.response) {
      error.message =
        'Network error: cannot reach API. Check API URL, server is running, and phone/PC are on same Wi‑Fi.';
    }
    return Promise.reject(error);
  }
);

export default api;
