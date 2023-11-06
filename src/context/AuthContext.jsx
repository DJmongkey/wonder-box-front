import { createContext, useContext, useState } from 'react';
import ERRORS from '../errors/errorMessage';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(
    localStorage.getItem('accessToken') ? true : false,
  );

  async function login(accessToken) {
    localStorage.setItem('accessToken', accessToken);
    setUser(true);
  }

  async function logout() {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      localStorage.removeItem('accessToken');
      setUser(false);
    } catch (error) {
      console.error(error);
    }
  }

  async function refreshAccessToken() {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('accessToken', data.accessToken);
        setUser(true);
        return true;
      } else {
        setUser(false);
        return false;
      }
    } catch (error) {
      setUser(false);
      return false;
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
