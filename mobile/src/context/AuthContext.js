import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';
import { registerForPushNotificationsAsync } from '../services/notificationService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  async function loadStorageData() {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('token');

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
      } else if (storedUser && !storedToken) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.is_guest) {
          setUser(parsedUser);
        }
      }
    } catch (error) {
      console.error('Error loading storage data:', error);
    } finally {
      setLoading(false);
    }
  }

  async function continueAsGuest() {
    const guestUser = {
      id: 'guest',
      name: 'Guest',
      email: null,
      phone: null,
      role: 'guest',
      is_guest: true,
    };

    await AsyncStorage.setItem('user', JSON.stringify(guestUser));
    await AsyncStorage.removeItem('token');
    setUser(guestUser);
  }

  async function signIn(email, password) {
    try {
      const response = await api.post('/login', {
        email: (email || '').trim(),
        password: (password || '').trim(),
      });
      const { user, token } = response.data;

      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('token', token);

      setUser(user);
      
      registerForPushNotificationsAsync().catch(err => 
        console.error('Push notification registration failed:', err)
      );
      
      return { success: true };
    } catch (error) {
      const validationErrors = error.response?.data?.errors;
      const firstValidationMessage = validationErrors
        ? Object.values(validationErrors)?.flat()?.[0]
        : null;

      return {
        success: false,
        message:
          firstValidationMessage ||
          error.response?.data?.message ||
          error.message ||
          'Login failed',
      };
    }
  }

  async function signUp(name, email, password, password_confirmation, phone) {
    try {
      const response = await api.post('/register', {
        name: (name || '').trim(),
        email: (email || '').trim(),
        password: (password || '').trim(),
        password_confirmation: (password_confirmation || '').trim(),
        phone: (phone || '').trim(),
      });
      const { user, token } = response.data;

      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('token', token);

      setUser(user);
      
      registerForPushNotificationsAsync().catch(err => 
        console.error('Push notification registration failed:', err)
      );
      
      return { success: true };
    } catch (error) {
      const validationErrors = error.response?.data?.errors;
      const firstValidationMessage = validationErrors
        ? Object.values(validationErrors)?.flat()?.[0]
        : null;

      return {
        success: false,
        message:
          firstValidationMessage ||
          error.response?.data?.message ||
          error.message ||
          'Registration failed',
      };
    }
  }

  async function signOut() {
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      setUser(null);
    }
  }

  async function updateProfile(data) {
    try {
      const response = await api.put('/profile', data);
      const updatedUser = response.data;

      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);

      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Update failed',
      };
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signUp,
        signOut,
        continueAsGuest,
        updateProfile,
        isAuthenticated: !!user,
        isGuest: !!user?.is_guest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
