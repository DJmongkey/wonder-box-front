import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthContextProvider({ children }) {
  const [user, setUser] = useState(
    localStorage.getItem('accessToken') ? true : false,
  );

  const login = async () => {
    setUser(true);
  };

  const logout = async () => {
    setUser(false);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
