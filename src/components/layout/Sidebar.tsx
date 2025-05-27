
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
  BookText,
  Bus,
  Phone,
  DollarSign,
  School,
  UserCog,
  CalendarCheck,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { USER_ROLES, UserRole } from '@/lib/constants/roles';
import { getUserAccessibleModules } from '@/lib/constants/moduleAccess';

// Helper function to check if user is super admin
const isSuperAdmin = (role?: string) => role === USER_ROLES.SUPER_ADMIN;

export default function Sidebar() {
  const { user } = useAuth();
  
  // Get school code from URL if applicable (for multi-tenant path-based routing)
  const pathname = window.location.pathname;
  const schoolCodeMatch = pathname.match(/\/schools\/([^\/]+)/);
  const schoolCode = schoolCodeMatch ? schoolCodeMatch[1] : null;
  const isSchoolSpecificRoute = !!schoolCode;
  
  // Dynamically generate navigation items based on user role and accessible modules
  const accessibleModules = getUserAccessibleModules(user?.role as UserRole);
  
  // Map icon names to Lucid icons components
  const getIconForModule = (moduleName: string) => {
    // Default mapping of module names to icon components
    const iconMap: Record<string, JSX.Element> = {
      'Dashboard': <BarChart3 className="h-5 w-5" />,
      'Student Management': <Users className="h-5 w-5" />,
      'Teacher Management': <Users className="h-5 w-5" />,
      'Class & Subject Management': <BookOpen className="h-5 w-5" />,
      'Attendance': <ClipboardCheck className="h-5 w-5" />,
      'Library Management': <BookText className="h-5 w-5" />,
      'Transport Management': <Bus className="h-5 w-5" />,
      'Fees Management': <DollarSign className="h-5 w-5" />,
      'Analytics & AI Reports': <BarChart3 className="h-5 w-5" />,
      'School/College Setup': <School className="h-5 w-5" />,
      'User & Role Management': <UserCog className="h-5 w-5" />,
      'Timetable & Calendar': <CalendarCheck className="h-5 w-5" />,
      'Communication': <Bell className="h-5 w-5" />,
      'SaaS Billing / Plan Upgrade': <DollarSign className="h-5 w-5" />,
      'Settings': <Settings className="h-5 w-5" />
    };
    
    return iconMap[moduleName] || <Settings className="h-5 w-5" />;
  };
  
  // Function to get the correct href based on module path and tenant routing
  const getModuleHref = (path: string) => {
    // Extract base path without leading slash
    const basePath = path.startsWith('/') ? path.substring(1) : path;
    
    // Special case: Super admin can use global routes directly
    if (user?.role === USER_ROLES.SUPER_ADMIN) {
      // Super admin always gets non-tenant routes
      return path;
    }

    // For school-specific routes in the /schools/{code} format
    if (isSchoolSpecificRoute && schoolCode) {
      return `/schools/${schoolCode}/${basePath}`;
    }
    
    // For tenant-based routing, check for tenant slug in user data or localStorage
    const tenantSlug = user?.tenantSlug || localStorage.getItem('tenantSlug');
    if (tenantSlug) {
      // If we have tenant context, redirect to tenant-specific route
      return `/${tenantSlug}/${basePath}`;
    }
    
    // Fallback to regular route if no tenant context
    return path;
  };
  
  // Legacy static links for backward compatibility
  const links = [
    // Common dashboard for all users
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
      roles: [
        USER_ROLES.SUPER_ADMIN, 
        USER_ROLES.SCHOOL_ADMIN, 
        USER_ROLES.TEACHER, 
        USER_ROLES.STUDENT, 
        USER_ROLES.PARENT, 
        USER_ROLES.ACCOUNTANT, 
        USER_ROLES.LIBRARIAN, 
        USER_ROLES.RECEPTIONIST, 
        USER_ROLES.TRANSPORT_MANAGER
      ],
    },
    // School Management - Super Admin only
    {
      title: "Schools",
      href: "/schools",
      icon: <School className="h-5 w-5" />,
      roles: [USER_ROLES.SUPER_ADMIN],
    },
    // School Configuration
    {
      title: "School Configuration",
      href: isSchoolSpecificRoute && schoolCode ? `/schools/${schoolCode}/configuration` : "/configuration",
      icon: <Settings className="h-5 w-5" />,
      roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN],
    },
    // Register New School/Tenant - Super Admin only
    {
      title: "Register School",
      href: "/register-school",
      icon: <Building className="h-5 w-5" />,
      roles: [USER_ROLES.SUPER_ADMIN],
    },
    // User/Admin Management
    {
      title: "Admins",
      href: "/admins",
      icon: <UserCog className="h-5 w-5" />,
      roles: [USER_ROLES.SUPER_ADMIN],
    },
    // Students Management
    {
      title: "Students",
      href: "/students",
      icon: <Users className="h-5 w-5" />,
      roles: [
        USER_ROLES.SUPER_ADMIN, 
        USER_ROLES.SCHOOL_ADMIN, 
        USER_ROLES.TEACHER, 
        USER_ROLES.RECEPTIONIST
      ],
    },
    // My Profile for students
    {
      title: "My Profile",
      href: "/my-profile",
      icon: <Users className="h-5 w-5" />,
      roles: [USER_ROLES.STUDENT],
    },
    // Child's Profile for parents
    {
      title: "Child's Profile",
      href: "/child-profile",
      icon: <Users className="h-5 w-5" />,
      roles: [USER_ROLES.PARENT],
    },
    // Staff Management
    {
      title: "Staff",
      href: "/staff",
      icon: <Users className="h-5 w-5" />,
      roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN],
    },
    // Academics
    {
      title: "Academics",
      href: "/academics",
      icon: <BookOpen className="h-5 w-5" />,
      roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT, USER_ROLES.PARENT],
    },
    // Class Assignment
    {
      title: "Class Assignments",
      href: "/assignments",
      icon: <FileText className="h-5 w-5" />,
      roles: [USER_ROLES.TEACHER, USER_ROLES.STUDENT, USER_ROLES.PARENT],
    },
    // Attendance
    {
      title: "Attendance",
      href: "/attendance",
      icon: <ClipboardCheck className="h-5 w-5" />,
      roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN, USER_ROLES.TEACHER],
    },
    // Attendance for students
    {
      title: "My Attendance",
      href: "/my-attendance",
      icon: <CalendarCheck className="h-5 w-5" />,
      roles: [USER_ROLES.STUDENT],
    },
    // Attendance for parents
    {
      title: "Child's Attendance",
      href: "/child-attendance",
      icon: <CalendarCheck className="h-5 w-5" />,
      roles: [USER_ROLES.PARENT],
    },
    // Finance & Fees
    {
      title: "Finance",
      href: "/finance",
      icon: <DollarSign className="h-5 w-5" />,
      roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN, USER_ROLES.ACCOUNTANT],
    },
    // Fee Payment for parents
    {
      title: "Pay Fees",
      href: "/fees",
      icon: <DollarSign className="h-5 w-5" />,
      roles: [USER_ROLES.PARENT],
    },
    // Library Management
    {
      title: "Library",
      href: "/library",
      icon: <BookText className="h-5 w-5" />,
      roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN, USER_ROLES.LIBRARIAN, USER_ROLES.STUDENT, USER_ROLES.TEACHER],
    },
    // Transportation
    {
      title: "Transport",
      href: "/transport",
      icon: <Bus className="h-5 w-5" />,
      roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN, USER_ROLES.TRANSPORT_MANAGER],
    },
    // Admissions/Inquiries
    {
      title: "Admissions",
      href: user?.role === USER_ROLES.PARENT ? "/admissions/parent" : "/admissions/admin",
      icon: <Building className="h-5 w-5" />,
      roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN, USER_ROLES.RECEPTIONIST, USER_ROLES.PARENT],
    },
    // Inquiries for receptionist
    {
      title: "Inquiries",
      href: "/inquiries",
      icon: <Phone className="h-5 w-5" />,
      roles: [USER_ROLES.RECEPTIONIST],
    },
    // Admin Settings
    {
      title: "Settings",
      href: "/settings",
      icon: <Settings className="h-5 w-5" />,
      roles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN],
    },
  ];

  // Combine the static links with dynamically generated ones from module access
  const dynamicLinks = accessibleModules.map(module => ({
    title: module.name,
    href: getModuleHref(module.path),
    icon: getIconForModule(module.name),
    roles: module.roles,
  }));
  
  // Filter links to only show those the user has access to
  const filteredLinks = [...links, ...dynamicLinks].filter(
    link => !link.roles || (user?.role && link.roles.includes(user.role as UserRole))
  );
  
  // Remove duplicates by title
  const uniqueLinks = filteredLinks.reduce((acc, current) => {
    const x = acc.find(item => item.title === current.title);
    if (!x) {
      return acc.concat([current]);
    } else {
      return acc;
    }
  }, [] as typeof links);

  return (
    <div className="flex h-full flex-col border-r bg-card">
      <div className="flex h-14 items-center border-b px-4">
        <NavLink to="/" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-6 w-6" />
          <span className="text-lg">Campus Logic</span>
        </NavLink>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm">
          {uniqueLinks.map((link, index) => (
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
