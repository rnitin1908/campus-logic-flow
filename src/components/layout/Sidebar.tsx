import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useAuth, ROLES } from '@/contexts/AuthContext';
import { 
  ChevronLeft, ChevronRight, Users, BookOpen, 
  Calendar, ClipboardCheck, GraduationCap, Building,
  Clock, LayoutDashboard, Settings, LogOut, 
  BookOpenCheck, DollarSign, Bus, UserPlus, Library,
  Shield
} from 'lucide-react';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  href: string;
  isCollapsed: boolean;
  isActive: boolean;
}

const NavItem = ({ icon: Icon, label, href, isCollapsed, isActive }: NavItemProps) => {
  return (
    <Link to={href} className="w-full">
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 px-3 py-6",
          isActive ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
          isCollapsed && "justify-center px-0"
        )}
      >
        <Icon className={cn("h-5 w-5", isActive && "text-primary")} />
        {!isCollapsed && <span>{label}</span>}
      </Button>
    </Link>
  );
};

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasRole } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/auth/login');
  };

  // Define navigation items with role permissions
  const getNavItems = () => {
    // Dashboard is visible to everyone
    const items = [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    ];

    // Admin and teacher access
    if (hasRole([ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER])) {
      items.push({ icon: Users, label: 'Students', href: '/students' });
    }

    // Admin only access
    if (hasRole([ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN])) {
      items.push({ icon: Users, label: 'Staff', href: '/staff' });
    }

    // Super admin only
    if (hasRole([ROLES.SUPER_ADMIN])) {
      items.push({ icon: Building, label: 'Schools', href: '/schools' });
      items.push({ icon: Shield, label: 'Create Users', href: '/admin/create-users' });
    }

    // Admin and teacher access
    if (hasRole([ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER])) {
      items.push({ icon: ClipboardCheck, label: 'Attendance', href: '/attendance' });
      items.push({ icon: GraduationCap, label: 'Grades', href: '/grades' });
      items.push({ icon: BookOpen, label: 'Courses', href: '/courses' });
    }

    // Admin, teacher, student and parent access
    if (hasRole([ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT])) {
      items.push({ icon: Clock, label: 'Timetable', href: '/timetable' });
    }
    
    // Library access
    if (hasRole([ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.LIBRARIAN, ROLES.TEACHER, ROLES.STUDENT])) {
      items.push({ icon: Library, label: 'Library', href: '/library' });
    }

    // Finance access
    if (hasRole([ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.ACCOUNTANT])) {
      items.push({ icon: DollarSign, label: 'Finance', href: '/finance' });
    }

    // Transport access
    if (hasRole([ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TRANSPORT_MANAGER])) {
      items.push({ icon: Bus, label: 'Transport', href: '/transport' });
    }

    // Admissions access
    if (hasRole([ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.RECEPTIONIST])) {
      items.push({ icon: UserPlus, label: 'Admissions', href: '/admissions' });
    }

    return items;
  };
  
  const navItems = getNavItems();
  
  // ... keep existing code for bottomNavItems and return statement
  const bottomNavItems = [
    // Settings only for admins
    ...(hasRole([ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN]) 
      ? [{ icon: Settings, label: 'Settings', href: '/settings' }] 
      : []),
    { icon: LogOut, label: 'Logout', href: '#', onClick: handleLogout },
  ];

  return (
    <div
      className={cn(
        "flex flex-col border-r bg-card transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[70px]" : "w-[240px]"
      )}
    >
      <div className="flex h-16 items-center justify-between px-3 py-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-lg font-semibold">CampusCore</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>
      
      {!isCollapsed && user && (
        <div className="px-4 py-2">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-muted-foreground capitalize">{user.role.replace('_', ' ')}</p>
          {user.schoolName && (
            <p className="text-xs text-muted-foreground">{user.schoolName}</p>
          )}
        </div>
      )}
      
      <Separator />
      
      <div className="flex flex-1 flex-col gap-2 px-2 py-4">
        {navItems.map((item) => (
          <NavItem
            key={item.href}
            icon={item.icon}
            label={item.label}
            href={item.href}
            isCollapsed={isCollapsed}
            isActive={location.pathname === item.href}
          />
        ))}
      </div>
      
      <Separator />
      
      <div className="flex flex-col gap-2 px-2 py-4">
        {bottomNavItems.map((item) => (
          <div key={item.label} className="w-full">
            {item.onClick ? (
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 px-3 py-6",
                  isCollapsed && "justify-center px-0"
                )}
                onClick={item.onClick}
              >
                <item.icon className="h-5 w-5" />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            ) : (
              <NavItem
                icon={item.icon}
                label={item.label}
                href={item.href}
                isCollapsed={isCollapsed}
                isActive={location.pathname === item.href}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
