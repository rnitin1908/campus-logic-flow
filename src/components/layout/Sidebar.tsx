
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BarChart3, 
  GraduationCap, 
  Users, 
  BookOpen,
  ClipboardCheck,
  Bell,
  Settings,
  Building,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { USER_ROLES } from '@/lib/services/supabase/utils';

// Helper function to check if user is super admin
const isSuperAdmin = (role?: string) => role === USER_ROLES.SUPER_ADMIN;

export default function Sidebar() {
  const { user } = useAuth();

  const links = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
      roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN, USER_ROLES.TEACHER],
    },
    {
      title: "Students",
      href: "/students",
      icon: <Users className="h-5 w-5" />,
      roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN, USER_ROLES.TEACHER],
    },
    {
      title: "Staff",
      href: "/staff",
      icon: <Users className="h-5 w-5" />,
      roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN],
    },
    {
      title: "Academics",
      href: "/academics",
      icon: <BookOpen className="h-5 w-5" />,
      roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT],
    },
    {
      title: "Attendance",
      href: "/attendance",
      icon: <ClipboardCheck className="h-5 w-5" />,
      roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN, USER_ROLES.TEACHER],
    },
    {
      title: "Admin",
      href: "/admin",
      icon: <Settings className="h-5 w-5" />,
      roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN],
    },
    {
      title: "Admissions",
      href: user?.role === USER_ROLES.PARENT ? "/admissions/parent" : "/admissions/admin",
      icon: <Building className="h-5 w-5" />,
      roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN, USER_ROLES.PARENT],
    },
  ];

  const filteredLinks = links.filter(
    link => !link.roles || link.roles.includes(user?.role || '')
  );

  return (
    <div className="flex h-full w-full flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <NavLink to="/" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-6 w-6" />
          <span className="text-lg">Campus Logic</span>
        </NavLink>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {filteredLinks.map((link, index) => (
            <NavLink
              key={index}
              to={link.href}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-muted-foreground hover:text-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "transparent"
                )
              }
            >
              {link.icon}
              <span>{link.title}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}
