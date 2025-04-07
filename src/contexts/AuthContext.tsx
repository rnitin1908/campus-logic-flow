
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
    // Check if authentication services are configured
    const isSupabaseReady = supabaseService.isSupabaseConfigured();
    const isMongoDBReady = mongodbService.isMongoDBConfigured();
    
    if (!isSupabaseReady && !isMongoDBReady) {
      toast({
        title: "Configuration Error",
        description: "Neither Supabase nor MongoDB API is configured. Authentication will not work.",
        variant: "destructive",
      });
    } else if (!isSupabaseReady) {
      console.log("Supabase is not configured, falling back to MongoDB");
    } else {
      console.log("Setting up Supabase auth state listener");
      
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          console.log("Auth state changed:", event, !!session);
          
          if (event === 'SIGNED_IN' && session) {
            console.log("User signed in, session established");
            // We'll use the stored user data if available
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
              const userData = JSON.parse(storedUser);
              console.log("Using stored user data:", userData);
              setUser(userData);
              setIsAuthenticated(true);
            } else if (session.user?.email) {
              // If no stored data, defer fetching profile
              console.log("No stored user data, will fetch profile later");
              setTimeout(() => {
                supabaseService.login(session.user!.email!, '')
                  .catch(err => console.error("Error refreshing user data:", err));
              }, 0);
            }
          } else if (event === 'SIGNED_OUT') {
            console.log("User signed out, clearing session");
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('user');
          }
        }
      );

      // Check for existing session
      console.log("Checking for existing session");
      supabase.auth.getSession().then(({ data: { session } }) => {
        console.log("Session check result:", !!session);
        
        if (session) {
          // If we have a valid session but no user data, try to fetch profile
          const storedUser = localStorage.getItem('user');
          if (!storedUser && session.user?.email) {
            console.log("Valid session without stored user data, will fetch profile");
            // We need to fetch and set up user data asynchronously
            setTimeout(() => {
              // We use this trick to avoid blocking the UI with synchronous calls
              supabaseService.login(session.user!.email!, '').catch((err) => {
                console.error("Error refreshing user data:", err);
                // We ignore errors here as this is just an attempt to refresh local data
              });
            }, 0);
          } else if (storedUser) {
            console.log("Using stored user data with valid session");
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
          }
        }
        setIsLoading(false);
      });

      return () => {
        console.log("Cleaning up auth state subscription");
        subscription.unsubscribe();
      };
    }
    
    // If Supabase is not available, just check for stored user
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!user);
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log("Login attempt with email:", email);
      
      // First try Supabase if configured
      if (supabaseService.isSupabaseConfigured()) {
        try {
          console.log("Attempting Supabase authentication");
          const userData = await supabaseService.login(email, password);
          console.log("Supabase login successful, user data:", userData);
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userData));
          return;
        } catch (supabaseError) {
          console.error('Supabase login failed, trying MongoDB:', supabaseError);
          // If Supabase fails, try MongoDB
        }
      }
      
      // Fall back to MongoDB service
      console.log("Using MongoDB for authentication");
      const userData = await mongodbService.login(email, password);
      console.log("MongoDB login successful, user data:", userData);
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
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
      
      // First try Supabase if configured
      if (supabaseService.isSupabaseConfigured()) {
        try {
          console.log("Attempting Supabase registration");
          const result = await supabaseService.register(name, email, password, role, schoolId);
          console.log("Supabase registration successful:", result);
          // After successful registration, you might want to automatically log the user in
          await login(email, password);
          return;
        } catch (supabaseError) {
          console.error('Supabase registration failed, trying MongoDB:', supabaseError);
          // If Supabase fails, try MongoDB
        }
      }
      
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
