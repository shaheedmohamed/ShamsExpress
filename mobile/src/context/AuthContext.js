import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';
import { registerForPushNotificationsAsync } from '../services/notificationService';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredAuth();
  }, []);

  async function loadStoredAuth() {
    setLoading(true);
    
    try {
      const [storedUser, storedToken, lastGuestUser, lastGuestToken] = await Promise.all([
        AsyncStorage.getItem('user'),
        AsyncStorage.getItem('token'),
        AsyncStorage.getItem('last_guest_user'),
        AsyncStorage.getItem('last_guest_token'),
      ]);

      if (storedUser && storedToken) {
        console.log('Loading stored user');
        setUser(JSON.parse(storedUser));
      } else if (lastGuestUser && lastGuestToken) {
        // Re-login with last guest account (no API call needed)
        console.log('Loading saved guest account');
        const guestUser = JSON.parse(lastGuestUser);
        setUser(guestUser);
        await AsyncStorage.setItem('user', lastGuestUser);
        await AsyncStorage.setItem('token', lastGuestToken);
      } else {
        // Only create new guest if no saved one exists
        console.log('No saved account, creating new guest');
        await continueAsGuest();
      }
      
      const minLoadTime = 1500;
      const startTime = Date.now();
      const elapsedTime = Date.now() - startTime;
      
      if (elapsedTime < minLoadTime) {
        const remainingTime = minLoadTime - elapsedTime;
        await new Promise(resolve => setTimeout(resolve, remainingTime));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error loading auth:', error);
      setLoading(false);
    }
  }

  async function continueAsGuest() {
    try {
      // Check if there's a saved guest account first
      const [lastGuestUser, lastGuestToken] = await Promise.all([
        AsyncStorage.getItem('last_guest_user'),
        AsyncStorage.getItem('last_guest_token'),
      ]);
      
      if (lastGuestUser && lastGuestToken) {
        // Use existing guest account
        console.log('Using existing guest account');
        const guestUser = JSON.parse(lastGuestUser);
        await AsyncStorage.setItem('user', lastGuestUser);
        await AsyncStorage.setItem('token', lastGuestToken);
        setUser(guestUser);
        return { success: true };
      }
      
      // Create new guest account only if no saved one exists
      console.log('Creating new guest account');
      const response = await api.post('/guest');
      const { user, token } = response.data;

      await AsyncStorage.setItem('user', JSON.stringify(user));
      await AsyncStorage.setItem('token', token);
      // Save as last guest account immediately
      await AsyncStorage.setItem('last_guest_user', JSON.stringify(user));
      await AsyncStorage.setItem('last_guest_token', token);
      setUser(user);
      
      return { success: true };
    } catch (error) {
      console.error('Guest account creation error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to create guest account',
      };
    }
  }

  async function signIn(email, password) {
    try {
      // Save current guest account before login
      if (user?.is_guest) {
        await AsyncStorage.setItem('last_guest_user', JSON.stringify(user));
        const currentToken = await AsyncStorage.getItem('token');
        if (currentToken) {
          await AsyncStorage.setItem('last_guest_token', currentToken);
        }
      }
      
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

  async function signUp(name, email, password, phone) {
    try {
      // Save current guest account before registration
      if (user?.is_guest) {
        await AsyncStorage.setItem('last_guest_user', JSON.stringify(user));
        const currentToken = await AsyncStorage.getItem('token');
        if (currentToken) {
          await AsyncStorage.setItem('last_guest_token', currentToken);
        }
      }
      
      const response = await api.post('/register', {
        name: (name || '').trim(),
        email: (email || '').trim(),
        password: (password || '').trim(),
        phone: (phone || '').trim(),
        password_confirmation: (password || '').trim(),
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
    const currentUser = user;
    
    // Prevent guest users from logging out
    if (currentUser?.is_guest) {
      console.log('Guest users cannot logout');
      return;
    }
    
    try {
      await api.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear current user data
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
    
    // Try to re-login with last guest account
    const [lastGuestUser, lastGuestToken] = await Promise.all([
      AsyncStorage.getItem('last_guest_user'),
      AsyncStorage.getItem('last_guest_token'),
    ]);
    
    if (lastGuestUser && lastGuestToken) {
      // Re-login with last guest account
      const guestUser = JSON.parse(lastGuestUser);
      console.log('Restoring guest account:', guestUser.id, guestUser.email);
      
      await AsyncStorage.setItem('user', lastGuestUser);
      await AsyncStorage.setItem('token', lastGuestToken);
      setUser(guestUser);
      
      console.log('Guest account restored successfully with token');
    } else {
      console.log('No saved guest account found, creating new one');
      // Create new guest account
      await continueAsGuest();
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
