
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
}
