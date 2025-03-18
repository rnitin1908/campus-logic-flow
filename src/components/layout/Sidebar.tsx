
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  ChevronLeft, ChevronRight, Users, BookOpen, 
  Calendar, ClipboardCheck, GraduationCap, 
  Clock, LayoutDashboard, Settings, LogOut 
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
  
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Users, label: 'Students', href: '/students' },
    { icon: Users, label: 'Staff', href: '/staff' },
    { icon: ClipboardCheck, label: 'Attendance', href: '/attendance' },
    { icon: GraduationCap, label: 'Grades', href: '/grades' },
    { icon: BookOpen, label: 'Courses', href: '/courses' },
    { icon: Clock, label: 'Timetable', href: '/timetable' },
  ];
  
  const bottomNavItems = [
    { icon: Settings, label: 'Settings', href: '/settings' },
    { icon: LogOut, label: 'Logout', href: '/auth/logout' },
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
    </div>
  );
}
