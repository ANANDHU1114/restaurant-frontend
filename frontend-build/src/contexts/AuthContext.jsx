import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API, setAuthToken } from '../api'

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // ensure the central API instance has the token and use it for profile fetch
      setAuthToken(token)
      API.get('/auth/me')
        .then(res => setUser(res.data))
        .catch(() => {
          localStorage.removeItem('token');
          setAuthToken(null)
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    const res = await API.post('/auth/login', { username, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    setAuthToken(token)
    setUser(user);
    navigate('/');
  };

  const register = async (name, username, email, password) => {
    const res = await API.post('/auth/register', { name, username, email, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    setAuthToken(token)
    setUser(user);
    navigate('/');
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null)
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    login,
    register,
    logout,
    isAdmin: user?.role === 'admin'
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}