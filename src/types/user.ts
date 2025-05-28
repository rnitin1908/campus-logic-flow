
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  profile_image?: string;
  school_id?: string;
  class_id?: string;
  section?: string;
  parent_links?: ParentLink[];
  student_links?: StudentLink[];
  account_status: 'active' | 'pending' | 'suspended' | 'inactive';
  created_at: string;
  updated_at: string;
}

export interface ParentLink {
  parent_id: string;
  student_id: string;
  relationship: 'father' | 'mother' | 'guardian' | 'other';
  is_primary_contact: boolean;
}

export interface StudentLink {
  student_id: string;
  parent_id: string;
  relationship: 'father' | 'mother' | 'guardian' | 'other';
  is_primary_contact: boolean;
}

export interface UserFormData {
  name: string;
  email: string;
  password?: string;
  role: string;
  phone?: string;
  school_id?: string;
  class_id?: string;
  section?: string;
  parent_links?: ParentLink[];
}

export interface Class {
  id: string;
  name: string;
  grade_level: string;
  school_id: string;
}

export interface School {
  id: string;
  name: string;
  code: string;
}
