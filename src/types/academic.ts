
export interface Grade {
  id: string;
  student_id: string;
  subject: {
    name: string;
    code: string;
  } | string;
  score?: number;
  letter_grade?: string;
  term_id: string;
  academic_year: string;
  comments?: string;
  created_at?: string;
  updated_at?: string;
}

export interface BehaviorRecord {
  id: string;
  student_id: string;
  category: string;
  severity: string;
  description: string;
  incident_date: string;
  reporter?: {
    name: string;
    role: string;
  } | string;
  action_taken?: string;
  term_id: string;
  academic_year: string;
  created_at?: string;
  updated_at?: string;
}

export interface AcademicTerm {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  academic_year: string;
  is_current: boolean;
}
