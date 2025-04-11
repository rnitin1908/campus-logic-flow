
export type AdmissionStatus = 'pending' | 'reviewing' | 'approved' | 'rejected' | 'waitlisted';

export interface AdmissionRequest {
  id: string;
  parent_id: string;
  student_name: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  contact_number?: string;
  email?: string;
  previous_school?: string;
  grade_applying_for: string;
  academic_year: string;
  status: AdmissionStatus;
  notes?: string;
  school_id?: string;
  created_at: string;
  updated_at: string;
  documents?: AdmissionDocument[];
}

export interface AdmissionDocument {
  id: string;
  admission_id: string;
  type: string;
  name: string;
  url: string;
  uploaded_at: string;
}

export interface AdmissionRequestFormData {
  student_name: string;
  date_of_birth?: string;
  gender?: string;
  address?: string;
  contact_number?: string;
  email?: string;
  previous_school?: string;
  grade_applying_for: string;
  academic_year: string;
  school_id?: string;
  notes?: string;
}
