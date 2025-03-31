
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface RoleBasedRouteProps {
  children: ReactNode;
  allowedRoles: string[];
  redirectTo?: string;
}

const RoleBasedRoute = ({
  children,
  allowedRoles,
  redirectTo = '/auth/login',
}: RoleBasedRouteProps) => {
  const { user, isAuthenticated, isLoading, hasRole } = useAuth();

  if (isLoading) {
    // You could render a loading spinner here
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} />;
  }

  if (!hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" />;
  }

  return <>{children}</>;
};

export default RoleBasedRoute;
