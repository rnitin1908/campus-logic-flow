// Export all models organized by category

// Base schema and utilities
import { BaseDocument, createSchema, applyStandardIndexes } from './baseSchema';

// Authentication & Users
import User, { IUser, USER_ROLES } from './auth/User';
import Role, { IRole } from './auth/Role';
import Permission, { IPermission } from './auth/Permission';
import Session, { ISession } from './auth/Session';
import AuditLog, { IAuditLog } from './auth/AuditLog';

// Tenancy & Organization
import School, { ISchool } from './organization/School';
import Department, { IDepartment } from './organization/Department';
import Class, { IClass } from './organization/Class';

// Student Life Cycle
import Student, { IStudent, GenderType, StudentStatusType, BloodGroupType } from './students/Student';
import AdmissionRequest, { IAdmissionRequest, AdmissionStatusType } from './students/AdmissionRequest';

// SaaS Modules
import Tenant, { ITenant } from './saas/Tenant';

// Export by category
export const AuthModels = {
  User,
  Role,
  Permission,
  Session,
  AuditLog
};

export const OrganizationModels = {
  School,
  Department,
  Class
};

export const StudentModels = {
  Student,
  AdmissionRequest
};

export const SaasModels = {
  Tenant
};

// Export types
// Functions
export { createSchema, applyStandardIndexes };

// Constants
export { USER_ROLES };

// Type exports
export type { 
  // Base types
  BaseDocument,
  
  // Auth types
  IUser, 
  IRole,
  IPermission,
  ISession,
  IAuditLog,
  
  // Organization types
  ISchool,
  IDepartment,
  IClass,
  
  // Student types
  IStudent,
  IAdmissionRequest,
  GenderType,
  StudentStatusType,
  BloodGroupType,
  AdmissionStatusType,
  
  // SaaS types
  ITenant
};

// Export all models
export default {
  ...AuthModels,
  ...OrganizationModels,
  ...StudentModels,
  ...SaasModels
};
