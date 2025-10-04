'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '@/lib/auth';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = AuthService.getToken();
    if (token) {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        AuthService.logout();
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    const response = await AuthService.login(credentials);
    AuthService.setToken(response.access_token);
    
    if (response.user) {
      localStorage.setItem('user', JSON.stringify(response.user));
      setUser(response.user);
    }
   
    
    return response;
  };

  const logout = () => {
    AuthService.logout();
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}