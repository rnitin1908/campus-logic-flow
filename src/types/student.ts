
export interface StudentFormData {
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  admission_number: string;
  admission_date: string;
  school_id: string;
  class_id: string;
  section: string;
  academic_year: string;
  parent_name?: string;
  parent_email?: string;
  parent_phone?: string;
  emergency_contact?: string;
  medical_conditions?: string;
  previous_school?: string;
  transfer_certificate?: string;
  profile_image?: string;
  status?: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended';
  
  // Frontend compatibility properties
  name: string;
  rollNumber: string;
  roll_number: string;
  department: string;
  contactNumber?: string;
  contact_number?: string;
  dateOfBirth: string;
  admissionDate: string;
  academicYear: string;
  previousSchool?: string;
}

export interface Student {
  id: string;
  _id?: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email: string;
  phone: string;
  date_of_birth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  admission_number: string;
  admission_date: string;
  school_id: string;
  class_id: string;
  section: string;
  academic_year: string;
  parent_name?: string;
  parent_email?: string;
  parent_phone?: string;
  emergency_contact?: string;
  medical_conditions?: string;
  previous_school?: string;
  transfer_certificate?: string;
  profile_image?: string;
  created_at?: string;
  updated_at?: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended';
  
  // Computed/frontend properties
  name: string;
  rollNumber: string;
  roll_number: string;
  department: string;
  contactNumber?: string;
  contact_number?: string;
  dateOfBirth?: string;
  admissionDate?: string;
  academicYear?: string;
  previousSchool?: string;
  class?: string;
  enrollment_date?: string;
  
  // Additional complex properties
  healthInfo?: {
    bloodGroup?: string;
    allergies?: string[];
    medicalConditions?: string[];
  };
  parentInfo?: {
    name: string;
    relation: string;
    email: string;
    phone: string;
  };
  emergencyContacts?: Array<{
    name: string;
    relation: string;
    phone: string;
  }>;
  documents?: Array<{
    name: string;
    type: string;
    uploadDate: string;
  }>;
}

export interface MinimalStudent {
  id: string;
  name: string;
  email: string;
  rollNumber: string;
  roll_number: string;
  department: string;
  status: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended';
}

export interface Grade {
  id: string;
  student_id: string;
  subject_id: string;
  term_id: string;
  score: number;
  letter_grade?: string;
  comments?: string;
  created_at: string;
  updated_at: string;
  subject?: {
    name: string;
    code: string;
  };
}

export interface BehaviorRecord {
  id: string;
  student_id: string;
  category: string;
  description: string;
  severity: string;
  incident_date: string;
  action_taken?: string;
  created_at: string;
  updated_at: string;
  reporter?: {
    name: string;
  };
}

export type GenderType = 'male' | 'female' | 'other';
export type StatusType = 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended';

// MongoDB-compatible conversion function
export const convertToMongoStudent = (formData: StudentFormData): any => {
  return {
    first_name: formData.first_name || formData.name?.split(' ')[0] || '',
    middle_name: formData.middle_name,
    last_name: formData.last_name || formData.name?.split(' ').slice(1).join(' ') || '',
    email: formData.email,
    phone: formData.phone || formData.contactNumber || formData.contact_number || '',
    date_of_birth: formData.date_of_birth || formData.dateOfBirth,
    gender: formData.gender,
    address: {
      street: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      pincode: formData.pincode
    },
    admission_number: formData.admission_number,
    admission_date: formData.admission_date || formData.admissionDate,
    school_id: formData.school_id,
    class_id: formData.class_id,
    section: formData.section,
    academic_year: formData.academic_year || formData.academicYear,
    parent_name: formData.parent_name,
    parent_email: formData.parent_email,
    parent_phone: formData.parent_phone,
    emergency_contact: formData.emergency_contact,
    medical_conditions: formData.medical_conditions,
    previous_school: formData.previous_school || formData.previousSchool,
    transfer_certificate: formData.transfer_certificate,
    profile_image: formData.profile_image,
    status: formData.status || 'active',
    // Additional fields for compatibility
    roll_number: formData.rollNumber || formData.roll_number || '',
    department: formData.department || '',
    name: formData.name || `${formData.first_name} ${formData.last_name}`.trim()
  };
};

// For backward compatibility
export const convertToSupabaseStudent = convertToMongoStudent;
