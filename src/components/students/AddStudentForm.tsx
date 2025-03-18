
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import mongodbService from '@/services/mongodbService';

interface AddStudentFormProps {
  onStudentAdded: () => void;
}

const AddStudentForm = ({ onStudentAdded }: AddStudentFormProps) => {
  const { toast } = useToast();
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    name: '',
    email: '',
    rollNumber: '',
    department: '',
    status: 'active'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewStudent(prev => ({ ...prev, [id]: value }));
  };

  const handleAddStudent = async () => {
    try {
      await mongodbService.createStudent(newStudent);
      setIsAddStudentOpen(false);
      setNewStudent({
        name: '',
        email: '',
        rollNumber: '',
        department: '',
        status: 'active'
      });
      toast({
        title: "Success",
        description: "Student added successfully",
      });
      onStudentAdded(); // Refresh the list
    } catch (err) {
      console.error('Error adding student:', err);
      toast({
        title: "Error",
        description: "Failed to add student. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isAddStudentOpen} onOpenChange={setIsAddStudentOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Enter the details for the new student below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input 
              id="name" 
              className="col-span-3" 
              value={newStudent.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input 
              id="email" 
              className="col-span-3" 
              value={newStudent.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="rollNumber" className="text-right">
              Roll Number
            </Label>
            <Input 
              id="rollNumber" 
              className="col-span-3" 
              value={newStudent.rollNumber}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="department" className="text-right">
              Department
            </Label>
            <Input 
              id="department" 
              className="col-span-3" 
              value={newStudent.department}
              onChange={handleInputChange}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddStudent}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentForm;
