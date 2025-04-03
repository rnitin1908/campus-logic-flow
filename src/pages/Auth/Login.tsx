
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Lock, LogIn, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/components/ui/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { supabaseService } from '@/lib/services';
import { supabase } from '@/integrations/supabase/client';
import { createTestUsers } from '@/services/supabaseService';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [creatingTestUsers, setCreatingTestUsers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const isSupabaseConfigured = supabaseService.isSupabaseConfigured();

  const handleTestUserCreation = async () => {
    setCreatingTestUsers(true);
    setError(null);
    
    try {
      console.log("Starting test user creation process...");
      await createTestUsers();
      
      toast({
        title: "Test users created",
        description: "Test users have been created successfully. You can now log in with superadmin@campuscore.edu and Password123!",
      });
      
      // Pre-fill form with test credentials for convenience
      setEmail("superadmin@campuscore.edu");
      setPassword("Password123!");
      
    } catch (error: any) {
      console.error('Error creating test users:', error);
      setError(`Failed to create test users: ${error.message}`);
      
      toast({
        variant: "destructive",
        title: "Error creating test users",
        description: error.message || "An unknown error occurred",
      });
    } finally {
      setCreatingTestUsers(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Attempting login with:", email);
      await login(email, password);
      
      toast({
        title: "Login successful",
        description: "Welcome back to CampusCore.",
      });
      
      // Redirect to dashboard after successful login
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Get a more specific error message from the error object
      let errorMessage = "Invalid email or password. Please try again.";
      if (error.message) {
        errorMessage = error.message;
      }
      if (error.code === 'invalid_credentials') {
        errorMessage = "The email or password you entered is incorrect. Please try again.";
      }
      
      setError(errorMessage);
      
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
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <div className="animate-fade-in grid w-full max-w-md gap-8 rounded-xl bg-card p-8 shadow-lg">
        <div className="flex flex-col items-center justify-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <GraduationCap className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your CampusCore account
            </p>
          </div>
        </div>
        
        {!isSupabaseConfigured && (
          <Alert variant="destructive" className="border-amber-500 bg-amber-50 text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Supabase is not configured. Please set the environment variables VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
            </AlertDescription>
          </Alert>
        )}
        
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
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
              <Link to="/auth/reset-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
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
                <LogIn className="h-4 w-4" />
                Sign in
              </span>
            )}
          </Button>
        </form>
        
        <Button 
          variant="outline" 
          onClick={handleTestUserCreation} 
          disabled={creatingTestUsers || isLoading}
          className="w-full"
        >
          {creatingTestUsers ? (
            <span className="flex items-center gap-1">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Creating test users...
            </span>
          ) : (
            <span className="flex items-center gap-1">
              Create Test Users
            </span>
          )}
        </Button>
        
        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR CONTINUE WITH</span>
          <Separator className="flex-1" />
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <Button variant="outline" type="button" className="w-full">
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </Button>
        </div>
        
        <div className="text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <Link to="/auth/register" className="text-primary hover:underline">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
