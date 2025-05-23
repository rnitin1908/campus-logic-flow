
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getAcademicTerms } from '@/lib/services/supabase/academics/terms';

export interface AcademicTermSelectorProps {
  selectedTerm: string;
  onTermChange: (termId: string) => void;
  label?: string;
}

const AcademicTermSelector = ({ selectedTerm, onTermChange, label = 'Academic Term' }: AcademicTermSelectorProps) => {
  const [terms, setTerms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const termsData = await getAcademicTerms();
        setTerms(termsData);
        
        // If no term is selected and we have terms, select the current one or the first one
        if (!selectedTerm && termsData.length > 0) {
          const currentTerm = termsData.find(t => t.is_current);
          onTermChange(currentTerm ? currentTerm.id : termsData[0].id);
        }
      } catch (error) {
        console.error('Error fetching academic terms:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTerms();
  }, []);

  return (
    <div>
      <label htmlFor="term" className="block text-sm font-medium mb-2">
        {label}
      </label>
      <Select
        value={selectedTerm}
        onValueChange={onTermChange}
        disabled={loading || terms.length === 0}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={loading ? 'Loading terms...' : 'Select a term'} />
        </SelectTrigger>
        <SelectContent>
          {terms.map((term) => (
            <SelectItem key={term.id} value={term.id}>
              {term.name} ({term.academic_year})
              {term.is_current && ' (Current)'}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default AcademicTermSelector;
