import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TestUserCreator from './TestUserCreator';
import { AlertCircle } from 'lucide-react';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTestUsers, setShowTestUsers] = useState(false);
  
  
  const { login } = useAuth();
  const { tenantSlug,setIsValidTenant } = useTenant();
  const { tenantSlug: paramSlug } = useParams<{ tenantSlug: string }>();
  const navigate = useNavigate();
  
  // Use param slug if tenant context is not yet initialized
  const currentTenantSlug = tenantSlug || paramSlug;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      // Clear any stored tenant data before login when using general login path
      const isGeneralLoginPath = window.location.pathname === '/auth/login';
      if (isGeneralLoginPath) {
        // Only clear tenant data if we're on the general login path
        // This prevents issues when switching between tenants
        localStorage.removeItem('tenantSlug');
        localStorage.removeItem('tenantId');
      }
      
      console.log('Attempting login with:', email, 'for tenant path:', window.location.pathname);
      
      // Only pass tenant slug if we're on a tenant-specific login page
      // For general /auth/login, don't pass any tenant slug to allow proper user detection
      const loginTenantSlug = isGeneralLoginPath ? undefined : currentTenantSlug;
      const response: any = await login(email, password, loginTenantSlug);
      
      console.log('Login response:', response);
      
      // Determine where to redirect based on user role and tenant info
      if (response?.role === 'super_admin' && isGeneralLoginPath) {
        // Super admin on general login path goes to main dashboard
        console.log('Super admin login via general path, navigating to main dashboard');
        navigate('/dashboard');
      } else if (response?.tenantSlug) {
        // Regular users with tenant slug go to their tenant dashboard
        console.log('User has tenant slug, navigating to:', response.tenantSlug);
        setIsValidTenant(true);
        navigate(`/${response.tenantSlug}/dashboard`);
      } else {
        // Fallback - go to main dashboard if no tenant info available
        console.log('No tenant info available, using main dashboard');
        navigate('/dashboard');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestUserCreated = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
    // Keep the test users section open
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            <a 
              href="#" 
              className="text-xs text-primary hover:underline"
              onClick={(e) => e.preventDefault()}
            >
              Forgot Password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        {error && (
          <div className="bg-destructive/15 p-3 rounded-md flex items-start gap-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 mt-0.5" />
            <div>{error}</div>
          </div>
        )}
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Signing In...
            </span>
          ) : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t">
        {showTestUsers ? (
          <TestUserCreator onUsersCreated={handleTestUserCreated} />
        ) : (
          <Button 
            variant="outline"
            type="button"
            className="w-full text-amber-600 border-amber-300 hover:bg-amber-50 hover:text-amber-700"
            onClick={() => setShowTestUsers(true)}
          >
            Need Test Users?
          </Button>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
