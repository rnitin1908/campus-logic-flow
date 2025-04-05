
// This file re-exports all student service functions for backward compatibility
// Import and use services from the students folder directly for new code

export {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  importStudents
} from './students/index';
