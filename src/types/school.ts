
export interface SchoolFormData {
  name: string;
  code?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string;
  email: string;
  website?: string;
  principal_name?: string;
  established_year?: number;
  type?: 'public' | 'private' | 'charter' | 'international';
  level?: 'primary' | 'secondary' | 'higher' | 'all';
  description?: string;
  logo_url?: string;
  status?: 'active' | 'inactive';
  tenant_id?: string;
}

export interface School {
  id: string;
  _id?: string;
  name: string;
  code?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone: string;
  email: string;
  website?: string;
  principal_name?: string;
  established_year?: number;
  type?: 'public' | 'private' | 'charter' | 'international';
  level?: 'primary' | 'secondary' | 'higher' | 'all';
  description?: string;
  logo_url?: string;
  status: 'active' | 'inactive';
  tenant_id?: string;
  created_at?: string;
  updated_at?: string;
}
