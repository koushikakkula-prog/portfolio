import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('gendoc_user');
    return saved ? JSON.parse(saved) : { id: 1, name: 'Alex Rivera', email: 'demo@gendoc.ai', role: 'Lead Architect' };
  });
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    if (res.status === 'success') {
      setUser(res.user);
      setIsAuthenticated(true);
      localStorage.setItem('gendoc_user', JSON.stringify(res.user));
      return true;
    }
    return false;
  };

  const register = async (name, email, password) => {
    const res = await api.register(name, email, password);
    if (res.status === 'success') {
      setUser(res.user);
      setIsAuthenticated(true);
      localStorage.setItem('gendoc_user', JSON.stringify(res.user));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('gendoc_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
