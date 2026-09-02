import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('restart_kit_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('restart_kit_token') || null);
  const [loading, setLoading] = useState(true);

  // Sync token & verify auth on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('restart_kit_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Auth verification fallback:', err);
          // Only log out if specifically 401 Unauthorized (invalid or expired JWT signature)
          // On 404 or serverless container cold-starts, preserve local session state from localStorage!
          if (err.response && err.response.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.success) {
      const { token: newToken, user: userData } = res.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('restart_kit_token', newToken);
      localStorage.setItem('restart_kit_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.data.message || 'Login failed');
  };

  const register = async (formData) => {
    const res = await api.post('/auth/register', formData);
    if (res.data.success) {
      const { token: newToken, user: userData } = res.data;
      setToken(newToken);
      setUser(userData);
      localStorage.setItem('restart_kit_token', newToken);
      localStorage.setItem('restart_kit_user', JSON.stringify(userData));
      return userData;
    }
    throw new Error(res.data.message || 'Registration failed');
  };

  const updateProfile = async (profileData) => {
    const res = await api.put('/profile', profileData);
    if (res.data.success) {
      const updatedProfile = res.data.profile;
      setUser(prev => {
        const newUser = { ...prev, profile: updatedProfile };
        localStorage.setItem('restart_kit_user', JSON.stringify(newUser));
        return newUser;
      });
      return updatedProfile;
    }
    throw new Error(res.data.message || 'Failed to update profile');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('restart_kit_token');
    localStorage.removeItem('restart_kit_user');
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        login,
        register,
        updateProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
