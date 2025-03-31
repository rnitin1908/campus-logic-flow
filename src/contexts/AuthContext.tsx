
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import supabaseService, { USER_ROLES } from '@/services/supabaseService';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  schoolId?: string | null;
  schoolName?: string | null;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string, schoolId?: string | null) => Promise<void>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on initial load
    const storedUser = supabaseService.getCurrentUser();
    
    if (storedUser) {
      setUser(storedUser);
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const userData = await supabaseService.login(email, password);
      setUser(userData);
    } catch (error) {
      console.error('Login error in context:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: string = USER_ROLES.STUDENT, schoolId: string | null = null) => {
    try {
      await supabaseService.register(name, email, password, role, schoolId);
    } catch (error) {
      console.error('Register error in context:', error);
      throw error;
    }
  };

  const logout = () => {
    supabaseService.logout();
    setUser(null);
  };

  const hasRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    hasRole
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Helper hook for role-based access control
export const useAuthorization = () => {
  const { hasRole } = useAuth();
  
  const checkAccess = (allowedRoles: string[]) => {
    return hasRole(allowedRoles);
  };

  return { checkAccess };
};

// Exported role constants for easier access
export const ROLES = USER_ROLES;
