// MongoDB academic performance metrics types
import { AcademicTerm } from './terms';

export interface PerformanceMetric {
  id: string;
  student_id: string;
  term_id?: string;
  term?: AcademicTerm;
  academic_year?: string;
  
  // Core metrics
  attendance_rate?: number;
  assignment_completion?: number;
  class_participation?: number;
  test_scores?: number;
  overall_grade?: number;
  
  // Additional metrics
  improvement?: number;
  behavior_score?: number;
  extracurricular_participation?: number;
  
  // Metadata
  created_at?: string;
  updated_at?: string;
  notes?: string;
}

// Functions to interact with MongoDB API for performance metrics
export const getStudentPerformanceMetrics = async (studentId: string, termId?: string) => {
  // This would be implemented to call the MongoDB API
  // For now, returning mock data
  const mockData: PerformanceMetric = {
    id: '1',
    student_id: studentId,
    term_id: termId || '1',
    academic_year: '2023-2024',
    attendance_rate: 92,
    assignment_completion: 85,
    class_participation: 78,
    test_scores: 88,
    overall_grade: 86,
    improvement: 5,
    behavior_score: 90,
    extracurricular_participation: 75,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  return mockData;
};
