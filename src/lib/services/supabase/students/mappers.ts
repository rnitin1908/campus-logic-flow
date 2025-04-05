
import { Student, StudentFormData } from '@/types/student';

// Basic database student interface explicitly defined to avoid circular references
export interface DatabaseStudent {
  id: string;
  name: string;
  email: string;
  roll_number: string;
  department: string;
  status: string;
  date_of_birth?: string;
  gender?: string;
  contact_number?: string;
  address?: string;
  class?: string;
  section?: string;
  academic_year?: string;
  admission_date?: string;
  previous_school?: string;
  profile_id?: string;
  created_at?: string;
  updated_at?: string;
  enrollment_date?: string;
}

// Helper function to directly convert database student to application format
export function mapDatabaseToStudent(dbStudent: DatabaseStudent | null): Student | null {
  if (!dbStudent) return null;
  
  // Create a new object with direct properties to prevent circular references
  return {
    _id: dbStudent.id,
    id: dbStudent.id,
    name: dbStudent.name || '',
    email: dbStudent.email || '',
    rollNumber: dbStudent.roll_number || '',
    roll_number: dbStudent.roll_number,
    department: dbStudent.department || '',
    status: dbStudent.status || 'active',
    dateOfBirth: dbStudent.date_of_birth,
    date_of_birth: dbStudent.date_of_birth,
    gender: dbStudent.gender,
    contactNumber: dbStudent.contact_number,
    contact_number: dbStudent.contact_number,
    address: dbStudent.address || '',
    admissionDate: dbStudent.admission_date,
    admission_date: dbStudent.admission_date,
    previousSchool: dbStudent.previous_school,
    previous_school: dbStudent.previous_school,
    class: dbStudent.class,
    section: dbStudent.section,
    academicYear: dbStudent.academic_year,
    academic_year: dbStudent.academic_year,
    profile_id: dbStudent.profile_id,
    created_at: dbStudent.created_at,
    updated_at: dbStudent.updated_at,
    enrollment_date: dbStudent.enrollment_date
  };
}

// Convert Supabase data to DatabaseStudent interface
export function convertToDbStudent(student: any): DatabaseStudent {
  return {
    id: student.id,
    name: student.name,
    email: student.email,
    roll_number: student.roll_number,
    department: student.department,
    status: student.status,
    date_of_birth: student.date_of_birth,
    gender: student.gender,
    contact_number: student.contact_number,
    address: student.address,
    class: student.class,
    section: student.section,
    academic_year: student.academic_year,
    admission_date: student.admission_date,
    previous_school: student.previous_school,
    profile_id: student.profile_id,
    created_at: student.created_at,
    updated_at: student.updated_at,
    enrollment_date: student.enrollment_date
  };
}

// Convert StudentFormData to format suitable for Supabase
export function convertFormToSupabaseStudent(studentData: StudentFormData): any {
  return {
    name: studentData.name,
    email: studentData.email,
    roll_number: studentData.rollNumber || studentData.roll_number,
    department: studentData.department,
    date_of_birth: studentData.dateOfBirth || studentData.date_of_birth,
    gender: studentData.gender || null,
    contact_number: studentData.contactNumber || studentData.contact_number,
    address: studentData.address,
    status: studentData.status || 'active'
  };
}
