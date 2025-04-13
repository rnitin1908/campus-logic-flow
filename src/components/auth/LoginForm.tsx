
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import TestUserCreator from '@/components/auth/TestUserCreator';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTestUsers, setShowTestUsers] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleTestUserInput = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      console.log("Attempting login with:", email);
      await login(email, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back to CampusCore.",
      });
      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Get a more specific error message from the error object
      let errorMessage = "Invalid email or password. Please try again.";
      
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast({
        variant: "destructive",
        title: "Login failed",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="pl-10"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <a href="/auth/reset-password" className="text-xs text-primary hover:underline">
              Forgot password?
            </a>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              className="pl-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="remember-me" 
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
          />
          <Label htmlFor="remember-me" className="text-sm">Remember me for 30 days</Label>
        </div>
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <span className="flex items-center gap-1">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Signing in...
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <LogIn className="h-4 w-4 mr-2" />
              Sign in
            </span>
          )}
        </Button>
      </form>

      <div className="mt-6 pt-5 border-t">
        <Button 
          type="button" 
          variant="outline" 
          className="w-full"
          onClick={() => setShowTestUsers(!showTestUsers)}
        >
          <Users className="h-4 w-4 mr-2" />
          {showTestUsers ? 'Hide Test Users' : 'Need Test Users?'}
        </Button>

        {showTestUsers && (
          <div className="mt-4">
            <TestUserCreator onUsersCreated={handleTestUserInput} />
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginForm;
