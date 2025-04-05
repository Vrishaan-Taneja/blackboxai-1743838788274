import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for existing token on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Auth check failed:', err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const { token, user } = await apiLogin(email, password);
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      navigate('/');
      return { success: true };
    } catch (err) {
      console.error('Login failed:', err);
      return { success: false, message: err.message || 'Login failed' };
    }
  };

  const register = async (username, email, password) => {
    try {
      const { token, user } = await apiRegister(username, email, password);
      localStorage.setItem('token', token);
      setUser(user);
      setIsAuthenticated(true);
      navigate('/');
      return { success: true };
    } catch (err) {
      console.error('Registration failed:', err);
      return { success: false, message: err.message || 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
    navigate('/auth');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        register,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);