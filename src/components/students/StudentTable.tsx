
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowUpDown,
  ChevronDown,
  Trash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import mongodbService from '@/services/mongodbService';

interface Student {
  _id: string;
  name: string;
  email: string;
  rollNumber: string;
  department: string;
  status: string;
}

interface StudentTableProps {
  students: Student[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  searchValue: string;
}

const StudentTable = ({ students, isLoading, error, onRefresh, searchValue }: StudentTableProps) => {
  const { toast } = useToast();

  const handleDeleteStudent = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this student?")) {
      try {
        await mongodbService.deleteStudent(id);
        toast({
          title: "Success",
          description: "Student deleted successfully",
        });
        onRefresh(); // Refresh the list
      } catch (err) {
        console.error('Error deleting student:', err);
        toast({
          title: "Error",
          description: "Failed to delete student. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  // Filter students based on search value
  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    student.email.toLowerCase().includes(searchValue.toLowerCase()) ||
    student.rollNumber.toLowerCase().includes(searchValue.toLowerCase()) ||
    student.department.toLowerCase().includes(searchValue.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-destructive">{error}</p>
        <Button 
          variant="outline" 
          onClick={onRefresh} 
          className="mt-4"
        >
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">
              <div className="flex items-center gap-1">
                Name
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                ID
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredStudents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8">
                {searchValue ? 'No students match your search' : 'No students found'}
              </TableCell>
            </TableRow>
          ) : (
            filteredStudents.map((student) => (
              <TableRow key={student._id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://avatar.vercel.sh/${student._id}`} alt={student.name} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{student.name}</div>
                      <div className="text-xs text-muted-foreground">{student.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{student.rollNumber}</TableCell>
                <TableCell>{student.department}</TableCell>
                <TableCell>
                  <Badge
                    variant={student.status === 'active' ? 'default' : 'outline'}
                    className={
                      student.status === 'active'
                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                        : 'text-muted-foreground'
                    }
                  >
                    {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem>View Grades</DropdownMenuItem>
                      <DropdownMenuItem>View Attendance</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => handleDeleteStudent(student._id)}
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default StudentTable;
