
import { supabase } from '@/integrations/supabase/client';
import { Student } from '@/types/student';
import { convertToDbStudent, mapDatabaseToStudent } from './mappers';

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
    
    const dbStudent = convertToDbStudent(data);
    return mapDatabaseToStudent(dbStudent);
  } catch (error) {
    console.error('Update student error:', error);
    throw error;
  }
};
