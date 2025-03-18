
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface StudentSearchProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
}

const StudentSearch = ({ searchValue, setSearchValue }: StudentSearchProps) => {
  return (
    <div className="flex items-center gap-2 flex-1 max-w-md">
      <div className="relative w-full">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search students..."
          className="w-full pl-8"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <Button variant="outline" size="icon">
        <SlidersHorizontal className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default StudentSearch;
