
import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface StudentSearchProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (value: string) => void;
}

const StudentSearch = ({ 
  searchValue, 
  setSearchValue, 
  departmentFilter, 
  setDepartmentFilter 
}: StudentSearchProps) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="outline" 
            size="icon"
            className={departmentFilter ? "bg-primary/20" : ""}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <h4 className="font-medium leading-none">Filter Students</h4>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select 
                value={departmentFilter} 
                onValueChange={setDepartmentFilter}
              >
                <SelectTrigger id="department">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Departments</SelectItem>
                  <SelectItem value="Computer Science">Computer Science</SelectItem>
                  <SelectItem value="Electrical Engineering">Electrical Engineering</SelectItem>
                  <SelectItem value="Mechanical Engineering">Mechanical Engineering</SelectItem>
                  <SelectItem value="Civil Engineering">Civil Engineering</SelectItem>
                  <SelectItem value="Business Administration">Business Administration</SelectItem>
                  <SelectItem value="Physics">Physics</SelectItem>
                  <SelectItem value="Mathematics">Mathematics</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  setDepartmentFilter('');
                  setIsFilterOpen(false);
                }}
              >
                Clear
              </Button>
              <Button 
                size="sm"
                onClick={() => setIsFilterOpen(false)}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default StudentSearch;
