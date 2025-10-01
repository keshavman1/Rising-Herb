import React, { createContext, useContext, useEffect, useState } from 'react';
import api, { setAuthToken } from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function parseJwt(token){
  if(!token) return null;
  try {
    const b = token.split('.')[1];
    return JSON.parse(atob(b));
  } catch(e){ return null; }
}

export function AuthProvider({ children }){
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [user, setUser] = useState(parseJwt(localStorage.getItem('token')));

  useEffect(() => {
    if(token){
      localStorage.setItem('token', token);
      setAuthToken(token);
      setUser(parseJwt(token));
    } else {
      localStorage.removeItem('token');
      setAuthToken(null);
      setUser(null);
    }
  }, [token]);

  const signup = async (payload) => {
    const res = await api.post('/auth/signup', payload);
    setToken(res.data.token);
    return res;
  };

  const login = async (payload) => {
    const res = await api.post('/auth/login', payload);
    setToken(res.data.token);
    return res;
  };

  const logout = () => setToken(null);

  return <AuthContext.Provider value={{ token, user, signup, login, logout }}>{children}</AuthContext.Provider>;
}
