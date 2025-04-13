import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login with:', email);
      await login(email, password);
      // Login success is handled by auth context redirecting to dashboard
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
