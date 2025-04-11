
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  // If user is logged in, redirect to dashboard
  // If not, redirect to login page
  return isAuthenticated ? (
    <Navigate to="/dashboard" />
  ) : (
    <Navigate to="/auth/login" />
  );
};

export default Index;
