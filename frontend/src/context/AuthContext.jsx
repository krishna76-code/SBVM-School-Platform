import React, { createContext, useState, useEffect, useContext } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const { data } = await API.get('/auth/me');
        setUser(data.user);
      } else {
        // Try refresh token
        const { data } = await API.post('/auth/refresh-token');
        localStorage.setItem('accessToken', data.accessToken);
        setUser(data.user);
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('accessToken');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();

    // Listen to API interceptor logout triggers
    const handleLogoutTrigger = () => {
      setUser(null);
    };

    window.addEventListener('auth-logout', handleLogoutTrigger);
    return () => window.removeEventListener('auth-logout', handleLogoutTrigger);
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', data.accessToken);
      setUser({
        _id: data._id,
        email: data.email,
        role: data.role,
        profile: data.profile
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed. Please check credentials.'
      };
    } finally {
      setLoading(false);
    }
  };

  const registerGuest = async (payload) => {
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register-applicant', payload);
      localStorage.setItem('accessToken', data.accessToken);
      setUser({
        _id: data._id,
        email: data.email,
        role: data.role,
        profile: data.profile
      });
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Registration failed.'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error.message);
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, registerGuest, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
