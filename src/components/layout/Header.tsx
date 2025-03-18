
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export function Header() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-6">
        <div className="flex-1">
          {user && (
            <p className="text-sm text-muted-foreground">
              Logged in as <span className="font-medium">{user.name}</span> ({user.role})
            </p>
          )}
        </div>
        <div className="flex items-center justify-end gap-4">
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
