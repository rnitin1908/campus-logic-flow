
// Re-export all Supabase services for backward compatibility
export * from './auth';
export * from './students';
export * from './schools';
export * from './staff';
export * from './utils';
export * from './admissions';

// Export all services as a combined service for convenience
import * as authService from './auth';
import * as studentService from './students';
import * as schoolService from './schools';
import * as staffService from './staff';
import * as utils from './utils';
import * as admissionService from './admissions';

export const USER_ROLES = utils.USER_ROLES;

// Combined service object that includes all services
export const supabaseService = {
  ...authService,
  ...studentService,
  ...schoolService,
  ...staffService,
  ...utils,
  ...admissionService
};

export default supabaseService;
