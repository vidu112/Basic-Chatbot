// src/AuthContext.jsx
import { createContext, useState, useEffect } from 'react';
import { api } from '../api';

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount: try to refresh access token
  useEffect(() => {
    
    api.post('/auth/refresh-token')
      .then(res => {
        console.log('🔄 Refreshed Access Token:', res.data.accessToken);
        setToken(res.data.accessToken);
      })
      .catch(err => {
        console.log('🔄 Refresh failed:', err);
        setToken(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const login = async (username, password) => {
    const res = await api.post('/auth/login', { username, password });
    console.log('🔑 Received Access Token:', res.data.accessToken);
    setToken(res.data.accessToken);
  };

  const signup = async (username, email, firstName, lastName, password) => {
    await api.post('/auth/signup', {
      username, email, firstName, lastName, password
    });
    // immediately log in after signup
    return login(username, password);
  };

  const logout = async () => {
    await api.post('/auth/logout').finally(() => setToken(null));
  };

  return (
    <AuthContext.Provider value={{ token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
