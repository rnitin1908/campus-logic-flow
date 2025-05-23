import { connectToDatabase, checkMongoDBAvailability } from './connection';
import { Student, School, Profile, User, AdmissionRequest, USER_ROLES } from './models';
import { login, register, logout, createTestUsers } from './auth';
import { IStudent } from './models/Student';
import { ISchool } from './models/School';
import { StudentFormData, convertToMongoDBStudent } from '@/types/student';

// Connect to MongoDB at application start
connectToDatabase().catch(error => console.error('Failed to connect to MongoDB:', error));

// Helper function to directly convert database student to application format
function mapDatabaseToStudent(dbStudent: IStudent | null): any {
  if (!dbStudent) return null;
  
  return {
    _id: dbStudent._id,
    id: dbStudent._id,
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

export const mongodbService = {
  // Auth methods
  login,
  register,
  logout,
  createTestUsers,
  
  // Student methods
  async getStudents(schoolId?: string): Promise<any[]> {
    try {
      checkMongoDBAvailability();
      
      let query = schoolId ? { school_id: schoolId } : {};
      const students = await Student.find(query);
      
      return students.map(student => mapDatabaseToStudent(student));
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  },
  
  async getStudentById(id: string): Promise<any | null> {
    try {
      checkMongoDBAvailability();
      
      const student = await Student.findById(id);
      return mapDatabaseToStudent(student);
    } catch (error) {
      console.error(`Error fetching student with ID ${id}:`, error);
      throw error;
    }
  },
  
  async createStudent(studentData: StudentFormData): Promise<any | null> {
    try {
      checkMongoDBAvailability();
      
      // Convert to MongoDB format
      const mongoStudent = convertToMongoDBStudent(studentData);
      
      // Create the student record
      const student = await Student.create(mongoStudent);
      
      return mapDatabaseToStudent(student);
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  },
  
  async updateStudent(id: string, studentData: Partial<any>): Promise<any | null> {
    try {
      checkMongoDBAvailability();
      
      // Convert to MongoDB format if necessary
      const mongoStudent = studentData.hasOwnProperty('rollNumber') ? 
        convertToMongoDBStudent(studentData as StudentFormData) : 
        studentData;
      
      // Update the student record
      const updatedStudent = await Student.findByIdAndUpdate(
        id,
        { $set: mongoStudent },
        { new: true }
      );
      
      return mapDatabaseToStudent(updatedStudent);
    } catch (error) {
      console.error(`Error updating student with ID ${id}:`, error);
      throw error;
    }
  },
  
  async deleteStudent(id: string): Promise<void> {
    try {
      checkMongoDBAvailability();
      
      await Student.findByIdAndDelete(id);
    } catch (error) {
      console.error(`Error deleting student with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Import multiple students at once
  async importStudents(students: StudentFormData[]): Promise<{ success: boolean, count: number }> {
    try {
      checkMongoDBAvailability();
      
      const mongoStudents = students.map(student => convertToMongoDBStudent(student));
      const result = await Student.insertMany(mongoStudents);
      
      return { success: true, count: result.length };
    } catch (error) {
      console.error('Error importing students:', error);
      throw error;
    }
  },
  
  // School methods
  async getSchools() {
    try {
      checkMongoDBAvailability();
      
      return await School.find();
    } catch (error) {
      console.error('Error fetching schools:', error);
      throw error;
    }
  },
  
  async getSchoolById(id: string) {
    try {
      checkMongoDBAvailability();
      
      return await School.findById(id);
    } catch (error) {
      console.error(`Error fetching school with ID ${id}:`, error);
      throw error;
    }
  },
  
  async createSchool(schoolData: any) {
    try {
      checkMongoDBAvailability();
      
      return await School.create(schoolData);
    } catch (error) {
      console.error('Error creating school:', error);
      throw error;
    }
  },
  
  async updateSchool(id: string, schoolData: any) {
    try {
      checkMongoDBAvailability();
      
      return await School.findByIdAndUpdate(
        id,
        { $set: schoolData },
        { new: true }
      );
    } catch (error) {
      console.error(`Error updating school with ID ${id}:`, error);
      throw error;
    }
  },
  
  async deleteSchool(id: string) {
    try {
      checkMongoDBAvailability();
      
      await School.findByIdAndDelete(id);
    } catch (error) {
      console.error(`Error deleting school with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Staff methods (teachers, admin staff, etc.)
  async getStaff() {
    try {
      checkMongoDBAvailability();
      
      // Find all users with staff roles
      const staffRoles = [
        USER_ROLES.TEACHER, 
        USER_ROLES.SCHOOL_ADMIN,
        USER_ROLES.ACCOUNTANT,
        USER_ROLES.LIBRARIAN,
        USER_ROLES.RECEPTIONIST,
        USER_ROLES.TRANSPORT_MANAGER
      ];
      
      const staffProfiles = await Profile.find({ role: { $in: staffRoles } });
      return staffProfiles;
    } catch (error) {
      console.error('Error fetching staff:', error);
      throw error;
    }
  },
  
  async getStaffById(id: string) {
    try {
      checkMongoDBAvailability();
      
      return await Profile.findOne({ id });
    } catch (error) {
      console.error(`Error fetching staff with ID ${id}:`, error);
      throw error;
    }
  },
  
  async createStaff(staffData: any) {
    try {
      checkMongoDBAvailability();
      
      // First create a user
      const user = await User.create({
        email: staffData.email,
        password: staffData.password || 'Password123!', // Default password
        name: staffData.name,
        role: validateUserRole(staffData.role),
        aud: 'authenticated',
        raw_user_meta_data: JSON.stringify({
          name: staffData.name
        })
      });
      
      // Then create the profile
      return await Profile.create({
        id: user._id.toString(),
        name: staffData.name,
        email: staffData.email,
        role: validateUserRole(staffData.role),
        school_id: staffData.school_id,
        created_at: new Date(),
        updated_at: new Date()
      });
    } catch (error) {
      console.error('Error creating staff:', error);
      throw error;
    }
  },
  
  async updateStaff(id: string, staffData: any) {
    try {
      checkMongoDBAvailability();
      
      return await Profile.findOneAndUpdate(
        { id },
        { $set: staffData },
        { new: true }
      );
    } catch (error) {
      console.error(`Error updating staff with ID ${id}:`, error);
      throw error;
    }
  },
  
  async deleteStaff(id: string) {
    try {
      checkMongoDBAvailability();
      
      // Delete both profile and user
      await Profile.findOneAndDelete({ id });
      await User.findByIdAndDelete(id);
    } catch (error) {
      console.error(`Error deleting staff with ID ${id}:`, error);
      throw error;
    }
  },
  
  // Utility functions
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
      return null;
    }
  },
  
  // Check if MongoDB is configured
  isMongoDBConfigured() {
    try {
      checkMongoDBAvailability();
      return true;
    } catch (error) {
      return false;
    }
  },
  
  // Setup database with initial data if needed
  async setupDatabase() {
    try {
      await connectToDatabase();
      
      // Check if there are any users
      const userCount = await User.countDocuments();
      
      if (userCount === 0) {
        console.log('No users found. Creating initial super admin user...');
        
        // Create a super admin user
        await register(
          'Super Admin',
          'admin@campuscore.edu',
          'AdminPassword123!',
          USER_ROLES.SUPER_ADMIN
        );
        
        console.log('Initial setup completed successfully!');
      } else {
        console.log('Database already has users. Skipping initial setup.');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error setting up database:', error);
      throw error;
    }
  }
};

// Helper function to validate user role - imported from auth.ts
function validateUserRole(role: string): string {
  const validRoles = Object.values(USER_ROLES);
  
  if (validRoles.includes(role as any)) {
    return role;
  }
  
  console.warn(`Invalid role: ${role}. Defaulting to student.`);
  return USER_ROLES.STUDENT;
}

export default mongodbService;
