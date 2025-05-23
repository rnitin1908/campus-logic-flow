
import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '@/lib/services/api';

interface User {
  id: string;
  _id: string;
  name: string;
  email: string;
  role: string;
  schoolName: string;
  schoolId: string;
  tenantId: string;
  profileImage: string | null;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await apiClient.get('/auth/profile');
          if (response.data) {
            const transformedUser = transformUser(response.data);
            setUser(transformedUser);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('token');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('token', token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const transformedUser = transformUser(userData);
      setUser(transformedUser);
      setIsAuthenticated(true);
      
      // Navigate programmatically using window.location
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: any) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/register', userData);
      const { token, user: registeredUser } = response.data;

      localStorage.setItem('token', token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const transformedUser = transformUser(registeredUser);
      setUser(transformedUser);
      setIsAuthenticated(true);
      
      // Navigate programmatically using window.location
      window.location.href = '/dashboard';
    } catch (error: any) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    apiClient.defaults.headers.common['Authorization'] = '';
    setUser(null);
    setIsAuthenticated(false);
    
    // Navigate programmatically using window.location
    window.location.href = '/auth/login';
  };

  const hasRole = (roles: string[]): boolean => {
    return !!user && roles.includes(user.role);
  };

  const transformUser = (userData: any): User => {
    return {
      id: userData.id || userData._id || '',
      _id: userData._id || userData.id || '',
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'student',
      schoolName: userData.school_name || userData.schoolName || '',
      schoolId: userData.school_id || userData.schoolId || '',
      tenantId: userData.tenant_id || userData.tenantId || '',
      profileImage: userData.profile_image || userData.profileImage || null,
      lastLogin: userData.last_login || new Date().toISOString()
    };
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    hasRole,
    setUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
