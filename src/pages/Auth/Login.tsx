
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthStatusAlert from '@/components/auth/AuthStatusAlert';
import LoginForm from '@/components/auth/LoginForm';

const Login = () => {
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

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
              <a 
                href="/auth/register" 
                className="text-primary hover:underline"
              >
                Sign up
              </a>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
