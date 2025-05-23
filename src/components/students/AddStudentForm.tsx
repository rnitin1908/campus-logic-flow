
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import mongodbService from '@/services/mongodbService';
import { StudentFormData } from '@/types/student';

interface AddStudentFormProps {
  onStudentAdded: () => void;
}

const AddStudentForm = ({ onStudentAdded }: AddStudentFormProps) => {
  const { toast } = useToast();
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [newStudent, setNewStudent] = useState<StudentFormData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '',
    gender: 'male',
    address: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    admission_number: '',
    admission_date: '',
    school_id: '',
    class_id: '',
    section: '',
    academic_year: '',
    status: 'active',
    // Frontend compatibility
    name: '',
    rollNumber: '',
    roll_number: '',
    department: '',
    contactNumber: '',
    contact_number: '',
    dateOfBirth: '',
    admissionDate: '',
    academicYear: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setNewStudent(prev => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setNewStudent(prev => ({ ...prev, [field]: value }));
  };

  const handleAddStudent = async () => {
    // Basic validation
    if (!newStudent.first_name || !newStudent.last_name || !newStudent.email || !newStudent.rollNumber || !newStudent.department) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      // Prepare data with both formats for compatibility
      const studentData = {
        ...newStudent,
        name: `${newStudent.first_name} ${newStudent.last_name}`.trim(),
        roll_number: newStudent.rollNumber,
        contact_number: newStudent.contactNumber,
        date_of_birth: newStudent.dateOfBirth,
        admission_date: newStudent.admissionDate,
        academic_year: newStudent.academicYear,
      };

      await mongodbService.createStudent(studentData);
      setIsAddStudentOpen(false);
      resetForm();
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

  const resetForm = () => {
    setNewStudent({
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: 'male',
      address: '',
      city: '',
      state: '',
      country: '',
      pincode: '',
      admission_number: '',
      admission_date: '',
      school_id: '',
      class_id: '',
      section: '',
      academic_year: '',
      status: 'active',
      name: '',
      rollNumber: '',
      roll_number: '',
      department: '',
      contactNumber: '',
      contact_number: '',
      dateOfBirth: '',
      admissionDate: '',
      academicYear: '',
    });
    setActiveTab('basic');
  };

  return (
    <Dialog open={isAddStudentOpen} onOpenChange={(open) => {
      setIsAddStudentOpen(open);
      if (!open) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Student</DialogTitle>
          <DialogDescription>
            Enter the details for the new student below.
          </DialogDescription>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="contact">Contact Details</TabsTrigger>
            <TabsTrigger value="academic">Academic Info</TabsTrigger>
          </TabsList>
          <TabsContent value="basic" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">
                  First Name <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="first_name" 
                  value={newStudent.first_name}
                  onChange={handleInputChange}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">
                  Last Name <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="last_name" 
                  value={newStudent.last_name}
                  onChange={handleInputChange}
                  placeholder="Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="email" 
                  type="email"
                  value={newStudent.email}
                  onChange={handleInputChange}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input 
                  id="dateOfBirth" 
                  type="date"
                  value={newStudent.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={newStudent.gender} 
                  onValueChange={(value: 'male' | 'female' | 'other') => handleSelectChange('gender', value)}
                >
                  <SelectTrigger id="gender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="button" onClick={() => setActiveTab('contact')}>
                Next
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="contact" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input 
                  id="contactNumber" 
                  value={newStudent.contactNumber}
                  onChange={handleInputChange}
                  placeholder="+1 234 567 890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input 
                  id="address" 
                  value={newStudent.address}
                  onChange={handleInputChange}
                  placeholder="123 Main St, City"
                />
              </div>
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setActiveTab('basic')}>
                Previous
              </Button>
              <Button type="button" onClick={() => setActiveTab('academic')}>
                Next
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="academic" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rollNumber">
                  Roll Number <span className="text-destructive">*</span>
                </Label>
                <Input 
                  id="rollNumber" 
                  value={newStudent.rollNumber}
                  onChange={handleInputChange}
                  placeholder="R2023001"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">
                  Department <span className="text-destructive">*</span>
                </Label>
                <Select 
                  value={newStudent.department} 
                  onValueChange={(value) => handleSelectChange('department', value)}
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
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
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select 
                  value={newStudent.status} 
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="graduated">Graduated</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={() => setActiveTab('contact')}>
                Previous
              </Button>
              <Button type="button" onClick={handleAddStudent}>
                Submit
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsAddStudentOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentForm;
