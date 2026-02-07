import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { AuthContext } from './authContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

function getInitialAuth() {
  const savedToken = localStorage.getItem('token');
  const savedUser = localStorage.getItem('user');
  if (savedToken && savedUser) {
    try {
      const decoded = jwtDecode(savedToken);
      if (decoded.exp * 1000 > Date.now()) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
        return { token: savedToken, user: JSON.parse(savedUser) };
      }
    } catch {
      // invalid token
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  return { token: null, user: null };
}

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(getInitialAuth);

  useEffect(() => {
    if (auth.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${auth.token}`;
    }
  }, [auth.token]);

  const login = async (email, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { email, password });
    const { accessToken, user: userData } = response.data;
    setAuth({ token: accessToken, user: userData });
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    return userData;
  };

  const register = async (email, password, firstName, lastName) => {
    const response = await axios.post(`${API_URL}/auth/register`, {
      email,
      password,
      firstName,
      lastName,
    });
    const { accessToken, user: userData } = response.data;
    setAuth({ token: accessToken, user: userData });
    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    return userData;
  };

  const logout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user: auth.user, token: auth.token, login, register, logout, loading: false }}>
      {children}
    </AuthContext.Provider>
  );
}
