import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/constants/roles';
import { hasModuleAccess } from '@/lib/constants/moduleAccess';

interface RoleGuardProps {
  moduleName: string;
  children: React.ReactNode;
  fallbackPath?: string;
}

/**
 * A component that guards routes based on user role and module access permissions
 * Redirects to fallbackPath (default: /dashboard) if the user doesn't have access
 */
export default function RoleGuard({ 
  moduleName,
  children, 
  fallbackPath = '/dashboard' 
}: RoleGuardProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // While auth is loading, show nothing or a loading spinner
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  // If user is not logged in, redirect to login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check if the user has permission to access this module
  const hasAccess = hasModuleAccess(moduleName as any, user.role as UserRole);

  if (!hasAccess) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}
