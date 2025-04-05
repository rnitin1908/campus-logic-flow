
// Define types compatible with both MongoDB and Supabase schemas
export interface Student {
  _id: string; // MongoDB ID
  id?: string; // Supabase ID
  name: string;
  email: string;
  rollNumber: string; // MongoDB style
  roll_number?: string; // Supabase style
  department: string;
  status: string;
  dateOfBirth?: string;
  date_of_birth?: string; // Supabase style
  gender?: string;
  contactNumber?: string;
  contact_number?: string; // Supabase style
  address?: string;
  parentInfo?: {
    name: string;
    email: string;
    phone: string;
    relation: string;
  };
  emergencyContacts?: {
    name: string;
    phone: string;
    relation: string;
  }[];
  healthInfo?: {
    bloodGroup?: string;
    allergies?: string[];
    medicalConditions?: string[];
  };
  admissionDate?: string;
  admission_date?: string; // Supabase style
  previousSchool?: string;
  previous_school?: string; // Supabase style
  documents?: {
    type: string;
    name: string;
    url: string;
    uploadDate: string;
  }[];
  class?: string;
  section?: string;
  academicYear?: string;
  academic_year?: string; // Supabase style
  profile_id?: string; // Supabase only
  created_at?: string; // Supabase only
  updated_at?: string; // Supabase only
  enrollment_date?: string; // Supabase only
}

export interface StudentFormData {
  name: string;
  email: string;
  rollNumber: string;
  roll_number?: string; // Add Supabase style field
  department: string;
  dateOfBirth?: string;
  date_of_birth?: string; // Supabase style
  gender?: string;
  contactNumber?: string;
  contact_number?: string; // Supabase style
  address?: string;
  status: string;
}

// Type definitions for Supabase-specific gender and status enums
export type GenderType = 'male' | 'female' | 'other';
export type StatusType = 'active' | 'inactive' | 'on leave' | 'terminated' | 'graduated' | 'suspended' | 'pending';

// Helper function to convert MongoDB style to Supabase style
export function convertToSupabaseStudent(student: StudentFormData): any {
  return {
    name: student.name,
    email: student.email,
    roll_number: student.rollNumber || student.roll_number,
    department: student.department,
    date_of_birth: student.dateOfBirth || student.date_of_birth,
    gender: student.gender as GenderType || null,
    contact_number: student.contactNumber || student.contact_number,
    address: student.address,
    status: student.status as StatusType || 'active'
  };
}

// Fixed helper function to convert Supabase data to MongoDB Student format - simplified to avoid circular references
export function convertToMongoDBStudent(dbStudent: any): Student | null {
  if (!dbStudent) return null;
  
  return {
    _id: dbStudent.id || '',
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
