
export interface ClassFormData {
  name: string;
  grade: string;
  section?: string;
  academic_year: string;
  teacher_id?: string;
  school_id?: string;
  capacity?: number;
  description?: string;
  schedule?: {
    days: string[];
    start_time: string;
    end_time: string;
  }[];
  status?: 'active' | 'inactive';
}

export interface Class {
  id: string;
  _id?: string;
  name: string;
  grade: string;
  section?: string;
  academic_year: string;
  teacher_id?: string;
  school_id?: string;
  capacity?: number;
  description?: string;
  schedule?: {
    days: string[];
    start_time: string;
    end_time: string;
  }[];
  status: 'active' | 'inactive';
  created_at?: string;
  updated_at?: string;
}
