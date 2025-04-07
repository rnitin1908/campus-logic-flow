
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { useEffect } from 'react';
import LoginForm from '@/components/auth/LoginForm';
import TestUserCreator from '@/components/auth/TestUserCreator';
import AuthStatusAlert from '@/components/auth/AuthStatusAlert';
import SocialLoginButtons from '@/components/auth/SocialLoginButtons';
import AuthHeader from '@/components/auth/AuthHeader';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Pre-fill the email field in development mode for convenience
    if (process.env.NODE_ENV === 'development') {
      setEmail('superadmin@campuscore.edu');
      setPassword('Password123!');
    }
  }, []);

  const handleTestUserCreationSuccess = (email: string, password: string) => {
    setEmail(email);
    setPassword(password);
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <div className="animate-fade-in grid w-full max-w-md gap-6 rounded-xl bg-card p-8 shadow-lg">
        <AuthHeader 
          title="Welcome back"
          subtitle="Sign in to your CampusCore account"
        />
        
        <AuthStatusAlert error={error} />
        
        <TestUserCreator onUsersCreated={handleTestUserCreationSuccess} />
        
        <LoginForm />
        
        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">OR CONTINUE WITH</span>
          <Separator className="flex-1" />
        </div>
        
        <SocialLoginButtons />
        
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
