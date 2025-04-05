
import { supabase } from '@/integrations/supabase/client';
import { Student, StudentFormData, convertToSupabaseStudent } from '@/types/student';
import { checkSupabaseAvailability } from './utils';
import { Database } from '@/integrations/supabase/types';

// Basic database student interface explicitly defined to avoid circular references
interface DatabaseStudent {
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
function mapDatabaseToStudent(dbStudent: DatabaseStudent | null): Student | null {
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

export const getStudents = async (schoolId?: string): Promise<Student[]> => {
  try {
    checkSupabaseAvailability();
    
    let query = supabase.from('students').select('*');
    
    // Filter by school if a school ID is provided
    if (schoolId) {
      query = query.eq('school_id', schoolId);
    }
    
    const { data, error } = await query;

    if (error) throw error;
    
    // Convert Supabase students to application format
    const students: Student[] = [];
    
    if (data) {
      for (const student of data) {
        // Map Supabase data to DatabaseStudent interface
        const dbStudent: DatabaseStudent = {
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
        
        const convertedStudent = mapDatabaseToStudent(dbStudent);
        if (convertedStudent) {
          students.push(convertedStudent);
        }
      }
    }
    
    return students;
  } catch (error) {
    console.error('Get students error:', error);
    throw error;
  }
};

export const getStudentById = async (id: string): Promise<Student | null> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    if (!data) return null;
    
    // Create DatabaseStudent object to avoid circular references
    const dbStudent: DatabaseStudent = {
      id: data.id,
      name: data.name,
      email: data.email,
      roll_number: data.roll_number,
      department: data.department,
      status: data.status,
      date_of_birth: data.date_of_birth,
      gender: data.gender,
      contact_number: data.contact_number,
      address: data.address,
      class: data.class,
      section: data.section,
      academic_year: data.academic_year,
      admission_date: data.admission_date,
      previous_school: data.previous_school,
      profile_id: data.profile_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      enrollment_date: data.enrollment_date
    };
    
    return mapDatabaseToStudent(dbStudent);
  } catch (error) {
    console.error('Get student error:', error);
    throw error;
  }
};

export const createStudent = async (studentData: StudentFormData): Promise<Student | null> => {
  try {
    // Convert StudentFormData to Supabase format
    const supabaseStudentData = convertToSupabaseStudent(studentData);
    
    const { data, error } = await supabase
      .from('students')
      .insert(supabaseStudentData)
      .select()
      .single();

    if (error) throw error;
    
    // Create DatabaseStudent object to avoid circular references
    const dbStudent: DatabaseStudent = {
      id: data.id,
      name: data.name,
      email: data.email,
      roll_number: data.roll_number,
      department: data.department,
      status: data.status,
      date_of_birth: data.date_of_birth,
      gender: data.gender,
      contact_number: data.contact_number,
      address: data.address,
      class: data.class,
      section: data.section,
      academic_year: data.academic_year,
      admission_date: data.admission_date,
      previous_school: data.previous_school,
      profile_id: data.profile_id,
      created_at: data.created_at,
      updated_at: data.updated_at,
      enrollment_date: data.enrollment_date
    };
    
    return mapDatabaseToStudent(dbStudent);
  } catch (error) {
    console.error('Create student error:', error);
    throw error;
  }
};

export const updateStudent = async (id: string, studentData: Partial<Student>): Promise<Student | null> => {
  try {
    // Convert partial Student to Supabase format
    const updateData: any = {};
    
    if (studentData.name) updateData.name = studentData.name;
    if (studentData.email) updateData.email = studentData.email;
    if (studentData.rollNumber) updateData.roll_number = studentData.rollNumber;
    if (studentData.department) updateData.department = studentData.department;
    if (studentData.status) updateData.status = studentData.status;
    if (studentData.dateOfBirth) updateData.date_of_birth = studentData.dateOfBirth;
    if (studentData.gender) updateData.gender = studentData.gender;
    if (studentData.contactNumber) updateData.contact_number = studentData.contactNumber;
    if (studentData.address) updateData.address = studentData.address;
    if (studentData.class) updateData.class = studentData.class;
    if (studentData.section) updateData.section = studentData.section;
    if (studentData.academicYear) updateData.academic_year = studentData.academicYear;
    if (studentData.admissionDate) updateData.admission_date = studentData.admissionDate;
    if (studentData.previousSchool) updateData.previous_school = studentData.previousSchool;
    
    const { data, error } = await supabase
      .from('students')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return mapDatabaseToStudent(data);
  } catch (error) {
    console.error('Update student error:', error);
    throw error;
  }
};

export const deleteStudent = async (id: string) => {
  try {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, message: 'Student deleted successfully' };
  } catch (error) {
    console.error('Delete student error:', error);
    throw error;
  }
};

// Import multiple students at once
export const importStudents = async (students: StudentFormData[]): Promise<{ success: boolean, count: number }> => {
  try {
    // Convert each student to Supabase format
    const supabaseStudents = students.map(student => convertToSupabaseStudent(student));
    
    const { error } = await supabase
      .from('students')
      .insert(supabaseStudents);

    if (error) throw error;
    return { success: true, count: students.length };
  } catch (error) {
    console.error('Import students error:', error);
    throw error;
  }
};
