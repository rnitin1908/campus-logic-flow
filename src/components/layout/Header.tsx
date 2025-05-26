
import { Button } from '@/components/ui/button';
import { LogOut, User } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const { tenantSlug, clearTenant } = useTenant();
  
  const handleLogout = () => {
    // Store tenant slug temporarily if needed for redirection
    const currentTenantSlug = tenantSlug;
    
    // Perform the logout action
    logout();
    
    // Clear tenant data if we're in a tenant context
    if (currentTenantSlug) {
      clearTenant();
    }
    
    // Always redirect to /auth/login after logout
    // This prevents the not-found issue when tenant context is cleared
    navigate('/auth/login');
  };

  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-6">
        <div className="flex-1">
          {user && (
            <div>
              {user.schoolName && (
                <p className="font-medium text-primary">{user.schoolName}</p>
              )}
              <p className="text-sm text-muted-foreground">
                Logged in as <span className="font-medium">{user.name}</span> ({user.role.replace('_', ' ')})
              </p>
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-4">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleLogout} 
            className="hidden md:flex"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout {tenantSlug ? `(${tenantSlug})` : ''}
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
