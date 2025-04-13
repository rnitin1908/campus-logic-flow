
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
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
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
