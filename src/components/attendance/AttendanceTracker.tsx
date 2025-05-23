
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { mongodbService } from '@/lib/services';
import { 
  Table, TableBody, TableCell, TableHead, 
  TableHeader, TableRow 
} from '@/components/ui/table';
import { Check, X, Clock, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import DatePicker from '@/components/attendance/DatePicker';

// Create a specific interface for students with attendance status
interface AttendanceStudent {
  id: string;
  name: string;
  rollNumber: string;
  department: string;
  status: '' | 'present' | 'absent' | 'late';
}

// Interface for analytics data
interface AttendanceAnalytics {
  date: string;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  totalCount: number;
  presentPercentage: number;
}

const AttendanceTracker = () => {
  const { toast } = useToast();
  const [students, setStudents] = useState<AttendanceStudent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setIsLoading(true);
        const response = await mongodbService.getStudents({
          limit: 100, // Adjust as needed
          sortBy: 'created_at',
          sortOrder: 'desc'
        });
        
        // Initialize attendance status for all students
        const studentsWithStatus: AttendanceStudent[] = response.data.map(student => ({
          id: student.id || student._id,
          name: student.full_name || `${student.first_name} ${student.last_name}`,
          rollNumber: student.roll_number || '',
          department: student.department || '',
          status: ''
        }));
        
        setStudents(studentsWithStatus);
        
        // Fetch attendance for selected date if exists
        fetchAttendanceForDate(selectedDate, studentsWithStatus);
      } catch (error) {
        console.error('Error fetching students:', error);
        toast({
          title: 'Error',
          description: 'Failed to load students. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudents();
  }, [toast]);

  // Fetch attendance records for a specific date
  const fetchAttendanceForDate = async (date: Date, studentsList: AttendanceStudent[]) => {
    try {
      setIsLoading(true);
      
      // In a real implementation, we would fetch from database
      // For demo purposes, we'll use localStorage
      const formattedDate = format(date, 'yyyy-MM-dd');
      const savedAttendance = localStorage.getItem(`attendance_${formattedDate}`);
      
      if (savedAttendance) {
        const attendanceData = JSON.parse(savedAttendance);
        
        // Update students with saved attendance status
        const updatedStudents = studentsList.map(student => {
          const savedStatus = attendanceData.find((a: any) => a.studentId === student.id);
          return {
            ...student,
            status: savedStatus ? (savedStatus.status as '' | 'present' | 'absent' | 'late') : '',
          };
        });
        
        setStudents(updatedStudents);
      } else {
        // Reset attendance status if no data exists for this date
        const resetStudents = studentsList.map(student => ({
          ...student,
          status: '' as const
        }));
        
        setStudents(resetStudents);
      }
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      toast({
        title: 'Error',
        description: 'Failed to load attendance data.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle date change
  const handleDateChange = (date: Date | undefined) => {
    if (!date) return;
    
    if (hasUnsavedChanges) {
      // Ask user to confirm before changing date with unsaved changes
      if (window.confirm('You have unsaved changes. Do you want to continue without saving?')) {
        setSelectedDate(date);
        fetchAttendanceForDate(date, students);
      }
    } else {
      setSelectedDate(date);
      fetchAttendanceForDate(date, students);
    }
  };

  // Update student attendance status
  const updateAttendanceStatus = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setStudents(prevStudents => {
      const newStudents = prevStudents.map(student => {
        if (student.id === studentId) {
          return { ...student, status };
        }
        return student;
      });
      setHasUnsavedChanges(true);
      return newStudents;
    });
  };

  // Save attendance for the day
  const saveAttendance = async () => {
    try {
      setIsSaving(true);
      
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const attendanceData = students.map(student => ({
        studentId: student.id,
        status: student.status,
        date: formattedDate
      }));
      
      // In a real implementation, we would save to database
      // For demo purposes, we'll use localStorage
      localStorage.setItem(`attendance_${formattedDate}`, JSON.stringify(attendanceData));
      
      // Update attendance analytics data
      updateAttendanceAnalytics(formattedDate, students);
      
      toast({
        title: 'Success',
        description: 'Attendance has been saved successfully.',
      });
      
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving attendance:', error);
      toast({
        title: 'Error',
        description: 'Failed to save attendance data.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Update analytics data
  const updateAttendanceAnalytics = (date: string, students: AttendanceStudent[]) => {
    const presentCount = students.filter(s => s.status === 'present').length;
    const absentCount = students.filter(s => s.status === 'absent').length;
    const lateCount = students.filter(s => s.status === 'late').length;
    const totalCount = students.length;
    
    const analyticsData: AttendanceAnalytics = {
      date,
      presentCount,
      absentCount,
      lateCount,
      totalCount,
      presentPercentage: (presentCount / totalCount) * 100,
    };
    
    // Store analytics data
    const analyticsHistory = localStorage.getItem('attendance_analytics') || '[]';
    const analytics = JSON.parse(analyticsHistory);
    
    // Check if data for this date already exists
    const existingIndex = analytics.findIndex((a: any) => a.date === date);
    
    if (existingIndex >= 0) {
      analytics[existingIndex] = analyticsData;
    } else {
      analytics.push(analyticsData);
    }
    
    localStorage.setItem('attendance_analytics', JSON.stringify(analytics));
  };

  // Generate status buttons for student
  const renderStatusButtons = (student: AttendanceStudent) => {
    return (
      <div className="flex gap-2">
        <Button
          size="sm"
          variant={student.status === 'present' ? 'default' : 'outline'}
          onClick={() => updateAttendanceStatus(student.id, 'present')}
        >
          <Check className={`h-4 w-4 ${student.status === 'present' ? 'text-white' : 'text-green-500'}`} />
        </Button>
        <Button
          size="sm"
          variant={student.status === 'absent' ? 'default' : 'outline'}
          onClick={() => updateAttendanceStatus(student.id, 'absent')}
        >
          <X className={`h-4 w-4 ${student.status === 'absent' ? 'text-white' : 'text-red-500'}`} />
        </Button>
        <Button
          size="sm"
          variant={student.status === 'late' ? 'default' : 'outline'}
          onClick={() => updateAttendanceStatus(student.id, 'late')}
        >
          <Clock className={`h-4 w-4 ${student.status === 'late' ? 'text-white' : 'text-amber-500'}`} />
        </Button>
      </div>
    );
  };

  // Get human-readable status
  const getStatusText = (status: string) => {
    switch (status) {
      case 'present':
        return <span className="text-green-500 font-medium flex items-center"><Check className="h-4 w-4 mr-1" /> Present</span>;
      case 'absent':
        return <span className="text-red-500 font-medium flex items-center"><X className="h-4 w-4 mr-1" /> Absent</span>;
      case 'late':
        return <span className="text-amber-500 font-medium flex items-center"><Clock className="h-4 w-4 mr-1" /> Late</span>;
      default:
        return <span className="text-gray-400">Not marked</span>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Daily Attendance</CardTitle>
            <CardDescription>
              Record and manage student attendance
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <DatePicker 
              selectedDate={selectedDate}
              onDateChange={handleDateChange}
            />
            <Button 
              onClick={saveAttendance} 
              disabled={!hasUnsavedChanges || isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Attendance'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Roll Number</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Mark Attendance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.rollNumber}</TableCell>
                      <TableCell>{student.department}</TableCell>
                      <TableCell>{getStatusText(student.status)}</TableCell>
                      <TableCell className="text-right">
                        {renderStatusButtons(student)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AttendanceTracker;
