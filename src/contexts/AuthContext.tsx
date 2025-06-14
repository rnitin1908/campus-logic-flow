
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabaseService, USER_ROLES, mongodbService } from '@/lib/services';
import { useToast } from '@/components/ui/use-toast';
import { User } from '@/types';
// Import supabase client for backward compatibility during migration
import { supabase } from '@/integrations/supabase/client';

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, tenantSlug?: string) => Promise<User>;
  register: (name: string, email: string, password: string, role?: string, schoolId?: string | null) => Promise<void>;
  logout: () => void;
  hasRole: (roles: string[]) => boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({} as User),
  register: async () => { },
  logout: () => { },
  hasRole: () => false,
  setUser: () => { },
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if authentication services are configured
    const isMongoDBReady = mongodbService.isMongoDBConfigured();

    if (!isMongoDBReady) {
      toast({
        title: "Configuration Error",
        description: "MongoDB API is not configured. Authentication will not work.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    // Prioritize MongoDB during migration
    if (isMongoDBReady) {
      console.log("Using MongoDB for authentication");
      // Check for stored user data
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          console.log("Using stored user data with MongoDB:", userData);
          setUser(userData);
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error parsing stored user data:", error);
        }
      }
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }, [toast]);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const login = async (email: string, password: string, tenantSlug?: string): Promise<User> => {
    setIsLoading(true);
    try {
      // Fall back to MongoDB service
      console.log(`Using MongoDB for authentication with tenant slug: ${tenantSlug || 'none'}`);
      const response = await mongodbService.login(email, password, tenantSlug);
      console.log("MongoDB login successful, response:", response);

      // Extract user data from MongoDB response and format it to match User type
      const userData: User = {
        id: response.user?.id || (response.user as any)?._id || '',
        name: response.user?.name || email.split('@')[0],
        email: response.user?.email || email,
        role: response.user?.role || USER_ROLES.STUDENT,
        schoolId: response.user?.school_id || null,
        schoolName: (response.user as any)?.school_name || null,
        token: response.token || '',
        tenantSlug: response.user?.tenant_slug || tenantSlug
      };

      console.log("Formatted user data for state with tenant:", userData);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Login failed:', error);
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

      // Fall back to MongoDB service
      console.log("Using MongoDB for registration");
      const result = await mongodbService.register(name, email, password, role);
      console.log("MongoDB registration successful:", result);
      // After successful registration, you might want to automatically log the user in
      await login(email, password);
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    mongodbService.logout();
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
