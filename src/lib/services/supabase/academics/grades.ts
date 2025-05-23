
export interface Grade {
  id: string;
  student_id: string;
  subject: string;
  subject_id?: string;
  grade?: number;
  letter_grade?: string;
  points?: number;
  term_id?: string;
  academic_year?: string;
  exam_type?: string;
  exam_date?: string;
  max_marks?: number;
  obtained_marks?: number;
  percentage?: number;
  remarks?: string;
  teacher_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Mock function for grades - replace with actual Supabase calls when ready
export const getStudentGrades = async (studentId: string, termId?: string): Promise<Grade[]> => {
  return [
    {
      id: '1',
      student_id: studentId,
      subject: 'Mathematics',
      subject_id: 'math-101',
      grade: 85,
      letter_grade: 'A',
      points: 4.0,
      term_id: termId || '1',
      academic_year: '2023-2024',
      exam_type: 'Midterm',
      exam_date: new Date().toISOString(),
      max_marks: 100,
      obtained_marks: 85,
      percentage: 85,
      remarks: 'Excellent performance',
      teacher_id: 'teacher1',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      student_id: studentId,
      subject: 'Science',
      subject_id: 'sci-101',
      grade: 78,
      letter_grade: 'B+',
      points: 3.3,
      term_id: termId || '1',
      academic_year: '2023-2024',
      exam_type: 'Midterm',
      exam_date: new Date().toISOString(),
      max_marks: 100,
      obtained_marks: 78,
      percentage: 78,
      remarks: 'Good progress',
      teacher_id: 'teacher2',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
};
