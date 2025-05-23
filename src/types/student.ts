
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
  
  // Additional computed properties
  name: string;
  roll_number: string;
  department: string;
  contact_number?: string;
}

export type GenderType = 'male' | 'female' | 'other';
export type StatusType = 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended';

// MongoDB-compatible conversion function
export const convertToMongoStudent = (formData: StudentFormData): any => {
  return {
    first_name: formData.first_name,
    middle_name: formData.middle_name,
    last_name: formData.last_name,
    email: formData.email,
    phone: formData.phone,
    date_of_birth: formData.date_of_birth,
    gender: formData.gender,
    address: {
      street: formData.address,
      city: formData.city,
      state: formData.state,
      country: formData.country,
      pincode: formData.pincode
    },
    admission_number: formData.admission_number,
    admission_date: formData.admission_date,
    school_id: formData.school_id,
    class_id: formData.class_id,
    section: formData.section,
    academic_year: formData.academic_year,
    parent_name: formData.parent_name,
    parent_email: formData.parent_email,
    parent_phone: formData.parent_phone,
    emergency_contact: formData.emergency_contact,
    medical_conditions: formData.medical_conditions,
    previous_school: formData.previous_school,
    transfer_certificate: formData.transfer_certificate,
    profile_image: formData.profile_image,
    status: formData.status || 'active'
  };
};

// For backward compatibility
export const convertToSupabaseStudent = convertToMongoStudent;
