import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabaseService, USER_ROLES, mongodbService } from '@/lib/services';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  schoolId: string | null;
  schoolName: string | null;
  token: string;
}

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string, schoolId?: string | null) => Promise<void>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  hasRole: () => false,
  setUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const userData = await supabaseService.login(email, password);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Login failed', error);
      setIsAuthenticated(false);
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: string = USER_ROLES.STUDENT, schoolId: string | null = null) => {
    try {
      setIsLoading(true);
      await supabaseService.register(name, email, password, role, schoolId);
      // After successful registration, you might want to automatically log the user in
      await login(email, password);
    } catch (error) {
      console.error('Registration failed', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    supabaseService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const hasRole = (allowedRoles: string[]): boolean => {
    if (!user) return false;
    return allowedRoles.includes(user.role);
  };

  const value: AuthContextProps = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    hasRole,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const ROLES = USER_ROLES;
