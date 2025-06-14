// MongoDB academic behavior records types
import { AcademicTerm } from './terms';

export interface BehaviorRecord {
  id: string;
  student_id: string;
  term_id?: string;
  term?: AcademicTerm;
  academic_year?: string;
  
  // Behavior details
  incident_date?: string;
  behavior_type?: 'positive' | 'negative' | 'neutral';
  description?: string;
  action_taken?: string;
  severity?: 'minor' | 'moderate' | 'major';
  
  // Metadata
  reported_by_id?: string;
  reported_by_name?: string;
  created_at?: string;
  updated_at?: string;
  resolved?: boolean;
  resolution_date?: string;
  resolution_notes?: string;
  parent_notified?: boolean;
}

// Functions to interact with MongoDB API for behavior records
export const getStudentBehaviorRecords = async (studentId: string, termId?: string) => {
  // This would be implemented to call the MongoDB API
  // For now, returning mock data
  const mockRecords: BehaviorRecord[] = [
    {
      id: '1',
      student_id: studentId,
      term_id: termId || '1',
      academic_year: '2023-2024',
      incident_date: new Date().toISOString(),
      behavior_type: 'positive',
      description: 'Helped another student with their assignment',
      action_taken: 'Positive reinforcement, recognition in class',
      severity: 'minor',
      reported_by_id: 'teacher1',
      reported_by_name: 'John Smith',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      resolved: true,
      resolution_date: new Date().toISOString(),
      parent_notified: false
    },
    {
      id: '2',
      student_id: studentId,
      term_id: termId || '1',
      academic_year: '2023-2024',
      incident_date: new Date().toISOString(),
      behavior_type: 'negative',
      description: 'Disrupted class by talking',
      action_taken: 'Verbal warning',
      severity: 'minor',
      reported_by_id: 'teacher2',
      reported_by_name: 'Jane Doe',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      resolved: true,
      resolution_date: new Date().toISOString(),
      parent_notified: false
    }
  ];
  
  return mockRecords;
};
