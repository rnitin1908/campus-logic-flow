
export interface UserFormData {
  email: string;
  password?: string;
  name: string;
  role: string;
  school_id?: string;
  profile_image?: string;
  status?: 'active' | 'inactive' | 'suspended';
}

export interface User {
  id: string;
  _id?: string;
  email: string;
  name: string;
  role: string;
  school_id?: string;
  profile_image?: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at?: string;
  updated_at?: string;
}
