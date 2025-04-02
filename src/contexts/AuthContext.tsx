
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabaseService, USER_ROLES, mongodbService } from '@/lib/services';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

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
  const { toast } = useToast();

  useEffect(() => {
    // Check if Supabase is configured on component mount
    if (!supabaseService.isSupabaseConfigured()) {
      toast({
        title: "Configuration Error",
        description: "Supabase is not configured. Some features may be unavailable.",
        variant: "destructive",
      });
    }

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          // We'll use login function to properly set user data
          // but we avoid setting loading state again
          const userEmail = session.user?.email;
          if (userEmail) {
            // We just update the state directly to avoid recursive calls
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              setUser(JSON.parse(storedUser));
              setIsAuthenticated(true);
            }
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        // If we have a valid session but no user data, try to fetch profile
        const storedUser = localStorage.getItem('user');
        if (!storedUser && session.user?.email) {
          // We need to fetch and set up user data asynchronously
          setTimeout(() => {
            // We use this trick to avoid blocking the UI with synchronous calls
            supabaseService.login(session.user.email, '').catch(() => {
              // We ignore errors here as this is just an attempt to refresh local data
              // If it fails, the user can always log in manually
            });
          }, 0);
        } else if (storedUser) {
          setUser(JSON.parse(storedUser));
          setIsAuthenticated(true);
        }
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      // First try Supabase if configured
      if (supabaseService.isSupabaseConfigured()) {
        const userData = await supabaseService.login(email, password);
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        return;
      }
      
      // Fall back to MongoDB service if Supabase is not available
      const userData = await mongodbService.login(email, password);
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
      
      // First try Supabase if configured
      if (supabaseService.isSupabaseConfigured()) {
        await supabaseService.register(name, email, password, role, schoolId);
        // After successful registration, you might want to automatically log the user in
        await login(email, password);
        return;
      }
      
      // Fall back to MongoDB service if Supabase is not available
      await mongodbService.register(name, email, password);
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
    if (supabaseService.isSupabaseConfigured()) {
      supabaseService.logout();
    } else {
      mongodbService.logout();
    }
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
