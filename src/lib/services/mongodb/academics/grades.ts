// MongoDB academic grades types
import { AcademicTerm } from './terms';

export interface Grade {
  id: string;
  student_id: string;
  subject_id: string;
  subject_name?: string;
  term_id?: string;
  term?: AcademicTerm;
  academic_year?: string;
  
  // Grade information
  score?: number;
  grade_letter?: string;
  grade_point?: number;
  
  // Assessment details
  assessment_type?: 'exam' | 'quiz' | 'assignment' | 'project' | 'midterm' | 'final' | 'other';
  assessment_name?: string;
  assessment_date?: string;
  max_score?: number;
  
  // Metadata
  created_at?: string;
  updated_at?: string;
  teacher_id?: string;
  teacher_name?: string;
  comments?: string;
}

// Functions to interact with MongoDB API for grades
export const getStudentGrades = async (studentId: string, termId?: string, subjectId?: string) => {
  // This would be implemented to call the MongoDB API
  // For now, returning mock data
  const mockGrades: Grade[] = [
    {
      id: '1',
      student_id: studentId,
      subject_id: '101',
      subject_name: 'Mathematics',
      term_id: termId || '1',
      academic_year: '2023-2024',
      score: 92,
      grade_letter: 'A',
      grade_point: 4.0,
      assessment_type: 'exam',
      assessment_name: 'Midterm Examination',
      assessment_date: new Date().toISOString(),
      max_score: 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      teacher_id: 'teacher1',
      teacher_name: 'John Smith',
      comments: 'Excellent performance in problem-solving.'
    },
    {
      id: '2',
      student_id: studentId,
      subject_id: '102',
      subject_name: 'Science',
      term_id: termId || '1',
      academic_year: '2023-2024',
      score: 85,
      grade_letter: 'B+',
      grade_point: 3.5,
      assessment_type: 'project',
      assessment_name: 'Science Fair Project',
      assessment_date: new Date().toISOString(),
      max_score: 100,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      teacher_id: 'teacher2',
      teacher_name: 'Jane Doe',
      comments: 'Good project with creative approach.'
    }
  ];
  
  if (subjectId) {
    return mockGrades.filter(grade => grade.subject_id === subjectId);
  }
  
  return mockGrades;
};
