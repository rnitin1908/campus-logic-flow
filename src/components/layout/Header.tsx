
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import mongodbService from '@/services/mongodbService';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    mongodbService.logout();
    navigate('/auth/login');
  };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center justify-end flex-1 gap-4">
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
