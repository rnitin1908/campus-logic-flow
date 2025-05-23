// MongoDB academic terms types

export interface AcademicTerm {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  academic_year: string;
  is_current?: boolean;
  school_id?: string;
  created_at?: string;
  updated_at?: string;
}

// Functions to interact with MongoDB API for academic terms
export const getAcademicTerms = async (schoolId?: string) => {
  // This would be implemented to call the MongoDB API
  // For now, returning mock data
  const currentYear = new Date().getFullYear();
  
  const mockTerms: AcademicTerm[] = [
    {
      id: '1',
      name: 'Fall Term',
      start_date: `${currentYear}-08-15`,
      end_date: `${currentYear}-12-20`,
      academic_year: `${currentYear}-${currentYear + 1}`,
      is_current: true,
      school_id: schoolId || 'default',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Spring Term',
      start_date: `${currentYear + 1}-01-10`,
      end_date: `${currentYear + 1}-05-30`,
      academic_year: `${currentYear}-${currentYear + 1}`,
      is_current: false,
      school_id: schoolId || 'default',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];
  
  return mockTerms;
};
