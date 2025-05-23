import mongodbService from './mongodbService';
import { login, register, logout, createTestUsers, validateUserRole } from './auth';
import { connectToDatabase, checkMongoDBAvailability } from './connection';
import { USER_ROLES } from './models/User';

// Re-export everything for easier importing
export {
  mongodbService,
  login,
  register,
  logout,
  createTestUsers,
  validateUserRole,
  connectToDatabase,
  checkMongoDBAvailability,
  USER_ROLES
};

// Export the default service
export default mongodbService;
