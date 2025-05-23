
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasModuleAccess } from '@/lib/constants/moduleAccess';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  moduleName?: string;
  redirectTo?: string;
}

const RoleBasedRoute = ({
  children,
  allowedRoles,
  moduleName,
  redirectTo = '/auth/login',
}: RoleBasedRouteProps) => {
  const { user, isAuthenticated, isLoading, hasRole } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Store the current path for redirection after login
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // First check module-based access if provided
  if (moduleName && user?.role) {
    const hasAccess = hasModuleAccess(moduleName as any, user.role as any);
    if (!hasAccess) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // Then check explicit role list if provided
  if (allowedRoles && !hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
