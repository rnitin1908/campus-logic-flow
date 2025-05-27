
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  schoolId: string | null;
  schoolName: string | null;
  token: string;
  tenantSlug?: string;
}

export interface AcademicYearData {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description?: string;
  status: 'active' | 'upcoming' | 'completed';
  created_at: string;
}

export interface ClassData {
  id: string;
  name: string;
  grade_level?: number;
  description?: string;
  academic_year?: string;
  capacity?: number;
  status?: 'active' | 'inactive';
  sections: SectionData[];
}

export interface SectionData {
  id: string;
  name: string;
  capacity?: number;
  class_teacher_id?: string;
  room_number?: string;
}

export interface SubjectData {
  id: string;
  name: string;
  description?: string;
  code?: string;
  department?: string;
  credit_hours?: number;
  is_elective?: boolean;
  grade_levels?: number[];
}
