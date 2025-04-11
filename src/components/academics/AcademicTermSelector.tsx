
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AcademicTerm } from '@/lib/services/supabase/academics/terms';

interface AcademicTermSelectorProps {
  terms: AcademicTerm[];
  currentTerm: string;
  onTermChange: (termId: string) => void;
  className?: string;
}

const AcademicTermSelector: React.FC<AcademicTermSelectorProps> = ({
  terms,
  currentTerm,
  onTermChange,
  className,
}) => {
  return (
    <Select value={currentTerm} onValueChange={onTermChange}>
      <SelectTrigger className={`w-[240px] ${className || ''}`}>
        <SelectValue placeholder="Select term" />
      </SelectTrigger>
      <SelectContent>
        {terms.map((term) => (
          <SelectItem key={term.id} value={term.id}>
            {term.name}{term.is_current ? ' (Current)' : ''}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default AcademicTermSelector;
