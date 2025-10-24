import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Interface for AuthContext
interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  role: string | null;
  setRole: React.Dispatch<React.SetStateAction<string | null>>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  setIsAuthenticated: () => {},
  role: null,
  setRole: () => {},
  logout: () => {},
});

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);

  const logout = () => {
    Cookies.remove('access_token');
    Cookies.remove('role');
    setIsAuthenticated(false);
    setRole(null);
  };

  useEffect(() => {
    const token = Cookies.get('access_token');
    if (token) {
      setIsAuthenticated(true);
      setRole(Cookies.get('role') || null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, role, setRole, logout }}>
      {children}
    </AuthContext.Provider>
  );
};