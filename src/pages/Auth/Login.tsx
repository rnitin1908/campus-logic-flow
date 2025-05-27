
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthStatusAlert from '@/components/auth/AuthStatusAlert';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const { tenantSlug } = useTenant();
  const { tenantSlug: paramSlug } = useParams<{ tenantSlug: string }>();
  const navigate = useNavigate();
  
  // Use param slug if tenant context is not yet initialized
  const currentTenantSlug = tenantSlug || paramSlug;

  useEffect(() => {
    if (isAuthenticated) {
      // If authenticated, always redirect to tenant dashboard if possible
      if (currentTenantSlug) {
        console.log(`Redirecting to tenant dashboard: /${currentTenantSlug}/dashboard`);
        navigate(`/${currentTenantSlug}/dashboard`);
      } else {
        // If no tenant context, try to get from local storage as a fallback
        const storedTenantSlug = localStorage.getItem('tenantSlug');
        if (storedTenantSlug) {
          console.log(`Redirecting to stored tenant dashboard: /${storedTenantSlug}/dashboard`);
          navigate(`/${storedTenantSlug}/dashboard`);
        } else {
          // If no tenant context at all, redirect to a default tenant
          // This ensures users are always in a tenant context
          console.log('No tenant context found, redirecting to default tenant');
          navigate('/greenvalley/dashboard');
        }
      }
    }
  }, [isAuthenticated, navigate, currentTenantSlug]);
  
  // Debug output for tenant routing
  console.log('Login component loaded with:', {
    isAuthenticated,
    currentTenantSlug,
    pathname: window.location.pathname
  });

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <AuthHeader 
          title="Welcome Back" 
          subtitle="Enter your credentials to access your account" 
        />
        
        <AuthStatusAlert error={error} />
        
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-6">Sign In</h2>
            <LoginForm />
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-4">
            <div className="text-center text-sm">
              Don't have an account?{' '}
              {currentTenantSlug ? (
                <Link 
                  to={`/${currentTenantSlug}/register`}
                  className="text-primary hover:underline"
                >
                  Sign up
                </Link>
              ) : (
                <Link 
                  to="/auth/register"
                  className="text-primary hover:underline"
                >
                  Sign up
                </Link>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
