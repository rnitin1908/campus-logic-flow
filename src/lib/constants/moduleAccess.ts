// src/lib/constants/moduleAccess.ts
import { USER_ROLES, UserRole } from './roles';

export interface ModuleAccess {
  name: string;
  path: string;
  roles: UserRole[];
  icon?: string;
  subModules?: ModuleAccess[];
}

export const MODULE_ACCESS: Record<string, ModuleAccess> = {
  DASHBOARD: {
    name: 'Dashboard',
    path: '/dashboard',
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
    ]
  },
  USER_MANAGEMENT: {
    name: 'User & Role Management',
    path: '/users',
    roles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.SCHOOL_ADMIN,
      USER_ROLES.RECEPTIONIST
    ]
  },
  SCHOOL_SETUP: {
    name: 'School/College Setup',
    path: '/schools',
    roles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.SCHOOL_ADMIN,
      USER_ROLES.RECEPTIONIST
    ]
  },
  CLASS_SUBJECT: {
    name: 'Class & Subject Management',
    path: '/academics/classes',
    roles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.SCHOOL_ADMIN,
      USER_ROLES.TEACHER,
      USER_ROLES.RECEPTIONIST
    ]
  },
  STUDENT_MANAGEMENT: {
    name: 'Student Management',
    path: '/students',
    roles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.SCHOOL_ADMIN,
      USER_ROLES.TEACHER,
      USER_ROLES.PARENT,
      USER_ROLES.RECEPTIONIST
    ]
  },
  TEACHER_MANAGEMENT: {
    name: 'Teacher Management',
    path: '/teachers',
    roles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.SCHOOL_ADMIN,
      USER_ROLES.RECEPTIONIST
    ]
  },
  ATTENDANCE: {
    name: 'Attendance',
    path: '/attendance',
    roles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.SCHOOL_ADMIN,
      USER_ROLES.TEACHER,
      USER_ROLES.STUDENT,
      USER_ROLES.PARENT,
      USER_ROLES.RECEPTIONIST
    ]
  },
  EXAM_GRADES: {
    name: 'Exam & Grades',
    path: '/academics/exams',
    roles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.SCHOOL_ADMIN,
      USER_ROLES.TEACHER,
      USER_ROLES.STUDENT,
      USER_ROLES.PARENT
    ]
  },
  FEES_MANAGEMENT: {
    name: 'Fees Management',
    path: '/finance/fees',
    roles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.SCHOOL_ADMIN,
      USER_ROLES.STUDENT,
      USER_ROLES.PARENT,
      USER_ROLES.ACCOUNTANT,
      USER_ROLES.RECEPTIONIST
    ]
  },
  LIBRARY_MANAGEMENT: {
    name: 'Library Management',
    path: '/library',
    roles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.SCHOOL_ADMIN,
      USER_ROLES.TEACHER,
      USER_ROLES.STUDENT,
      USER_ROLES.LIBRARIAN,
      USER_ROLES.RECEPTIONIST
    ]
  },
  INVENTORY_ASSET: {
    name: 'Inventory / Asset Tracking',
    path: '/inventory',
    roles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.SCHOOL_ADMIN,
      USER_ROLES.ACCOUNTANT,
      USER_ROLES.LIBRARIAN,
      USER_ROLES.RECEPTIONIST,
      USER_ROLES.TRANSPORT_MANAGER
    ]
  },
  TIMETABLE_CALENDAR: {
    name: 'Timetable & Calendar',
    path: '/timetable',
    roles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.SCHOOL_ADMIN,
      USER_ROLES.TEACHER,
      USER_ROLES.STUDENT,
      USER_ROLES.PARENT,
      USER_ROLES.RECEPTIONIST
    ]
  },
  ONLINE_CLASSES: {
    name: 'Online Classes / Assignments',
    path: '/academics/online-classes',
    roles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.SCHOOL_ADMIN,
      USER_ROLES.TEACHER,
      USER_ROLES.STUDENT,
      USER_ROLES.PARENT
    ]
  },
  TRANSPORT: {
    name: 'Transport Management',
    path: '/transport',
    roles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.SCHOOL_ADMIN,
      USER_ROLES.STUDENT,
      USER_ROLES.PARENT,
      USER_ROLES.RECEPTIONIST,
      USER_ROLES.TRANSPORT_MANAGER
    ]
  },
  HOSTEL: {
    name: 'Hostel & Accommodation',
    path: '/hostel',
    roles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.SCHOOL_ADMIN,
      USER_ROLES.STUDENT,
      USER_ROLES.PARENT,
      USER_ROLES.RECEPTIONIST,
      USER_ROLES.TRANSPORT_MANAGER
    ]
  },
  COMMUNICATION: {
    name: 'Communication',
    path: '/communication',
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
    ]
  },
  MEDICAL: {
    name: 'Medical & Emergency Records',
    path: '/medical',
    roles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.SCHOOL_ADMIN,
      USER_ROLES.TEACHER,
      USER_ROLES.STUDENT,
      USER_ROLES.PARENT,
      USER_ROLES.RECEPTIONIST
    ]
  },
  REPORTS: {
    name: 'Report Cards & Certificates',
    path: '/academics/reports',
    roles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.SCHOOL_ADMIN,
      USER_ROLES.TEACHER,
      USER_ROLES.STUDENT,
      USER_ROLES.PARENT,
      USER_ROLES.RECEPTIONIST
    ]
  },
  EVENTS: {
    name: 'Events & Parent-Teacher Meetings',
    path: '/events',
    roles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.SCHOOL_ADMIN,
      USER_ROLES.TEACHER,
      USER_ROLES.STUDENT,
      USER_ROLES.PARENT,
      USER_ROLES.RECEPTIONIST
    ]
  },
  SAAS_BILLING: {
    name: 'SaaS Billing / Plan Upgrade',
    path: '/billing',
    roles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.SCHOOL_ADMIN
    ]
  },
  ANALYTICS: {
    name: 'Analytics & AI Reports',
    path: '/analytics',
    roles: [
      USER_ROLES.SUPER_ADMIN,
      USER_ROLES.SCHOOL_ADMIN,
      USER_ROLES.TEACHER,
      USER_ROLES.STUDENT,
      USER_ROLES.PARENT,
      USER_ROLES.ACCOUNTANT
    ]
  }
};

// Function to check if a user has access to a specific module
export function hasModuleAccess(moduleName: keyof typeof MODULE_ACCESS, userRole?: UserRole): boolean {
  if (!userRole) return false;
  const module = MODULE_ACCESS[moduleName];
  return module.roles.includes(userRole);
}

// Function to get all modules a user has access to
export function getUserAccessibleModules(userRole?: UserRole): ModuleAccess[] {
  if (!userRole) return [];
  return Object.values(MODULE_ACCESS).filter(module => module.roles.includes(userRole));
}
