
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  UserPlus,
  School,
  Calendar,
  GraduationCap,
  Clock,
  BookOpen,
  CreditCard,
  Bus,
  Settings,
  ChevronRight,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { ROLES } from '@/contexts/AuthContext';

// Helper function to check if the user has any of the specified roles
const hasAnyRole = (userRole: string, roles: string[]) => {
  return roles.includes(userRole);
};

export function Sidebar() {
  const { user } = useAuth();

  const isAdmin = user?.role && [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN].includes(user.role);
  const isTeacher = user?.role === ROLES.TEACHER;
  const isParent = user?.role === ROLES.PARENT;

  const sidebarLinks = [
    {
      name: 'Dashboard',
      href: '/',
      icon: LayoutDashboard,
      allowedRoles: Object.values(ROLES),
    },
    {
      name: 'Students',
      href: '/students',
      icon: Users,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    },
    {
      name: 'Staff',
      href: '/staff',
      icon: Users,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    },
    {
      name: 'Admissions',
      icon: UserPlus,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PARENT],
      submenu: [
        {
          name: 'Parent Portal',
          href: '/admissions/parent',
          allowedRoles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.PARENT],
        },
        {
          name: 'Admin Portal',
          href: '/admissions/admin',
          allowedRoles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
        },
      ],
    },
    {
      name: 'Attendance',
      href: '/attendance',
      icon: Clock,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    },
    {
      name: 'Grades',
      href: '/grades',
      icon: GraduationCap,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
    },
    {
      name: 'Courses',
      href: '/courses',
      icon: BookOpen,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER],
    },
    {
      name: 'Timetable',
      href: '/timetable',
      icon: Calendar,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT, ROLES.PARENT],
    },
    {
      name: 'Library',
      href: '/library',
      icon: BookOpen,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.LIBRARIAN, ROLES.STUDENT, ROLES.TEACHER],
    },
    {
      name: 'Finance',
      href: '/finance',
      icon: CreditCard,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.ACCOUNTANT],
    },
    {
      name: 'Transport',
      href: '/transport',
      icon: Bus,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TRANSPORT_MANAGER],
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: Settings,
      allowedRoles: [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN],
    },
  ];

  // Filter sidebar links based on user role
  const filteredLinks = sidebarLinks.filter(
    (link) => user?.role && link.allowedRoles.includes(user.role)
  );

  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);

  const toggleExpand = (name: string) => {
    setExpandedItems((prev) =>
      prev.includes(name)
        ? prev.filter((item) => item !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="h-full flex flex-col bg-background border-r">
      <div className="p-6">
        <h1 className="text-xl font-semibold tracking-tight">SchoolManager</h1>
        <p className="text-sm text-muted-foreground mt-1">Education Management</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {filteredLinks.map((link) => {
          // Check if the link has a submenu
          const hasSubmenu = link.submenu && link.submenu.length > 0;
          
          // For submenu items, check if any submenu items are allowed for the user's role
          const filteredSubmenu = hasSubmenu 
            ? link.submenu?.filter((sublink) => user?.role && sublink.allowedRoles.includes(user.role))
            : [];
          
          // Check if we should show this top-level item (either it has no submenu OR it has at least one viewable submenu item)
          const shouldShowLink = !hasSubmenu || filteredSubmenu.length > 0;
          
          const isExpanded = expandedItems.includes(link.name);
          
          if (!shouldShowLink) return null;
          
          return (
            <div key={link.name} className="space-y-1">
              {/* Main link or submenu trigger */}
              {hasSubmenu ? (
                <button
                  onClick={() => toggleExpand(link.name)}
                  className={cn(
                    "flex items-center justify-between w-full px-3 py-2 rounded-md text-sm font-medium",
                    "hover:bg-accent hover:text-accent-foreground",
                    isExpanded ? "bg-accent/50" : ""
                  )}
                >
                  <div className="flex items-center">
                    {link.icon && <link.icon className="h-4 w-4 mr-2" />}
                    <span>{link.name}</span>
                  </div>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform",
                      isExpanded ? "rotate-90" : ""
                    )}
                  />
                </button>
              ) : (
                <NavLink
                  to={link.href || "#"}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-3 py-2 rounded-md text-sm font-medium",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent hover:text-accent-foreground"
                    )
                  }
                >
                  {link.icon && <link.icon className="h-4 w-4 mr-2" />}
                  <span>{link.name}</span>
                </NavLink>
              )}
              
              {/* Submenu items */}
              {hasSubmenu && isExpanded && (
                <div className="ml-6 space-y-1">
                  {filteredSubmenu.map((sublink) => (
                    <NavLink
                      key={sublink.name}
                      to={sublink.href || "#"}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center px-3 py-2 rounded-md text-sm",
                          isActive
                            ? "bg-accent/70 text-accent-foreground"
                            : "hover:bg-accent/50 hover:text-accent-foreground"
                        )
                      }
                    >
                      <span>{sublink.name}</span>
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
