
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { mongodbService } from '@/lib/services';
import { getStudentGrades } from '@/lib/services/supabase/academics/grades';
import { getStudentBehaviorRecords } from '@/lib/services/supabase/academics/behavior';
import GradeReport from '@/components/academics/GradeReport';
import BehaviorRecord from '@/components/academics/BehaviorRecord';
import AcademicTermSelector from '@/components/academics/AcademicTermSelector';

const Academics = () => {
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedTerm, setSelectedTerm] = useState<string>('');
  const [students, setStudents] = useState<any[]>([]);
  const [grades, setGrades] = useState<any[]>([]);
  const [behaviorRecords, setBehaviorRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (selectedStudent && selectedTerm) {
      fetchAcademicData();
    }
  }, [selectedStudent, selectedTerm]);

  const fetchStudents = async () => {
    try {
      const response = await mongodbService.getStudents({ limit: 100 });
      setStudents(response.data || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAcademicData = async () => {
    try {
      setLoading(true);
      
      // Fetch grades and behavior records
      const [gradesData, behaviorData] = await Promise.all([
        getStudentGrades(selectedStudent, selectedTerm),
        getStudentBehaviorRecords(selectedStudent, selectedTerm)
      ]);
      
      setGrades(gradesData);
      setBehaviorRecords(behaviorData);
    } catch (error) {
      console.error('Error fetching academic data:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Academic Records</CardTitle>
          <CardDescription>View student grades and behavior records</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label htmlFor="student" className="block text-sm font-medium mb-2">
                Select Student
              </label>
              <select
                id="student"
                value={selectedStudent}
                onChange={(e) => setSelectedStudent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="">Choose a student...</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id}>
                    {student.first_name} {student.last_name} - {student.roll_number}
                  </option>
                ))}
              </select>
            </div>
            
            <AcademicTermSelector
              selectedTerm={selectedTerm}
              onTermChange={setSelectedTerm}
            />
          </div>

          {selectedStudent && selectedTerm && (
            <Tabs defaultValue="grades" className="w-full">
              <TabsList>
                <TabsTrigger value="grades">Grades</TabsTrigger>
                <TabsTrigger value="behavior">Behavior</TabsTrigger>
              </TabsList>
              
              <TabsContent value="grades">
                <GradeReport 
                  studentId={selectedStudent} 
                  termId={selectedTerm}
                  grades={grades}
                  loading={loading}
                />
              </TabsContent>
              
              <TabsContent value="behavior">
                <BehaviorRecord 
                  studentId={selectedStudent} 
                  termId={selectedTerm}
                  records={behaviorRecords}
                  loading={loading}
                />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Academics;
