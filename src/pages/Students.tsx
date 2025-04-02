
import { useState, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { supabaseService } from '@/lib/services';
import StudentSearch from '@/components/students/StudentSearch';
import StudentActions from '@/components/students/StudentActions';
import StudentTable from '@/components/students/StudentTable';
import { Student } from '@/types/student';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import StudentProfile from '@/components/students/StudentProfile';
import ImportStudentsModal from '@/components/students/ImportStudentsModal';

const Students = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [activeTab, setActiveTab] = useState('list');
  const [showImportModal, setShowImportModal] = useState(false);

  const fetchStudents = async () => {
    try {
      setIsLoading(true);
      const data = await supabaseService.getStudents();
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

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setActiveTab('profile');
  };

  const handleBackToList = () => {
    setSelectedStudent(null);
    setActiveTab('list');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Students</h1>
        <p className="text-muted-foreground">
          Manage student information, enrollments, and academic progress.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-2 md:inline-flex">
          <TabsTrigger value="list">Student List</TabsTrigger>
          <TabsTrigger value="profile" disabled={!selectedStudent}>
            {selectedStudent ? `${selectedStudent.name}'s Profile` : 'Student Profile'}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
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
              onImportClick={() => setShowImportModal(true)}
            />
          </div>

          <StudentTable 
            students={students} 
            isLoading={isLoading} 
            error={error} 
            onRefresh={fetchStudents}
            searchValue={searchValue}
            departmentFilter={departmentFilter}
            onStudentSelect={handleStudentSelect}
          />
        </TabsContent>

        <TabsContent value="profile">
          {selectedStudent && (
            <StudentProfile 
              student={selectedStudent} 
              onBack={handleBackToList}
              onUpdate={fetchStudents}
            />
          )}
        </TabsContent>
      </Tabs>

      <ImportStudentsModal 
        isOpen={showImportModal} 
        onClose={() => setShowImportModal(false)}
        onImportSuccess={fetchStudents}
      />
    </div>
  );
};

export default Students;
