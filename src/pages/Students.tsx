
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import mongodbService from '@/services/mongodbService';
import StudentSearch from '@/components/students/StudentSearch';
import StudentActions from '@/components/students/StudentActions';
import StudentTable from '@/components/students/StudentTable';

interface Student {
  _id: string;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  status: string;
}

const Students = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await mongodbService.getStudents();
      setStudents(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch students');
      console.error('Error fetching students:', err);
      toast({
        title: "Error",
        description: "Failed to load students. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">
          Manage student information, enrollments, and academic progress.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <StudentSearch 
          searchValue={searchValue} 
          setSearchValue={setSearchValue}
          departmentFilter={departmentFilter}
          setDepartmentFilter={setDepartmentFilter}
        />
        <StudentActions 
          onStudentAdded={fetchStudents}
          students={students}
        />
      </div>

      <StudentTable 
        students={students} 
        isLoading={isLoading} 
        error={error} 
        onRefresh={fetchStudents}
        searchValue={searchValue}
        departmentFilter={departmentFilter}
      />
    </div>
  );
};

export default Students;
