
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Edit, Save, Trash, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Student } from '@/types/student';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import mongodbService from '@/services/mongodbService';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StudentProfileProps {
  student: Student;
  onBack: () => void;
  onUpdate: () => void;
}

const StudentProfile = ({ student, onBack, onUpdate }: StudentProfileProps) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');

  const handleStatusChange = async (newStatus: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended') => {
    try {
      await mongodbService.updateStudent(student._id, { 
        ...student, 
        status: newStatus 
      });
      toast({
        title: "Status Updated",
        description: `Student status changed to ${newStatus}`,
      });
      onUpdate();
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update Failed",
        description: "Failed to update student status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to List
        </Button>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? (
              <>
                <X className="mr-2 h-4 w-4" />
                Cancel
              </>
            ) : (
              <>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </>
            )}
          </Button>
          {isEditing && (
            <Button size="sm">
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src={`https://avatar.vercel.sh/${student._id}`} alt={student.name} />
                <AvatarFallback className="text-2xl">{student.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <CardTitle>{student.name}</CardTitle>
            <CardDescription>{student.email}</CardDescription>
            <div className="mt-2">
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
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Roll Number:</span>
                <span className="font-medium">{student.roll_number || student.rollNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Department:</span>
                <span className="font-medium">{student.department}</span>
              </div>
              {(student.date_of_birth || student.dateOfBirth) && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <span className="font-medium">{new Date(student.date_of_birth || student.dateOfBirth).toLocaleDateString()}</span>
                </div>
              )}
              {student.gender && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gender:</span>
                  <span className="font-medium">{student.gender}</span>
                </div>
              )}
              {(student.contact_number || student.contactNumber) && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Contact:</span>
                  <span className="font-medium">{student.contact_number || student.contactNumber}</span>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <Button variant="outline" className="w-full" size="sm">
              <Upload className="mr-2 h-4 w-4" /> Change Photo
            </Button>
            <DropdownStatusMenu 
              currentStatus={student.status} 
              onStatusChange={handleStatusChange} 
            />
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="parents">Parents</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <TabsContent value="personal" className="space-y-4 mt-0">
              <h3 className="text-lg font-medium">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p>{student.address || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Contact Number</p>
                  <p>{student.contact_number || student.contactNumber || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Date of Birth</p>
                  <p>{(student.date_of_birth || student.dateOfBirth) ? new Date(student.date_of_birth || student.dateOfBirth).toLocaleDateString() : 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Gender</p>
                  <p>{student.gender || 'Not provided'}</p>
                </div>
              </div>

              <Separator />

              <h3 className="text-lg font-medium">Health Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  <p>{student.healthInfo?.bloodGroup || 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Allergies</p>
                  <p>{student.healthInfo?.allergies?.join(', ') || 'None'}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm text-muted-foreground">Medical Conditions</p>
                  <p>{student.healthInfo?.medicalConditions?.join(', ') || 'None'}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="academic" className="space-y-4 mt-0">
              <h3 className="text-lg font-medium">Academic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Class</p>
                  <p>{student.class || 'Not assigned'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Section</p>
                  <p>{student.section || 'Not assigned'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Admission Date</p>
                  <p>{(student.admission_date || student.admissionDate) ? new Date(student.admission_date || student.admissionDate).toLocaleDateString() : 'Not provided'}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Academic Year</p>
                  <p>{student.academic_year || student.academicYear || 'Not provided'}</p>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <p className="text-sm text-muted-foreground">Previous School</p>
                  <p>{student.previous_school || student.previousSchool || 'Not provided'}</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="parents" className="space-y-4 mt-0">
              <h3 className="text-lg font-medium">Parent/Guardian Information</h3>
              {student.parentInfo ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p>{student.parentInfo.name}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Relation</p>
                    <p>{student.parentInfo.relation}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{student.parentInfo.email}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{student.parentInfo.phone}</p>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">No parent/guardian information provided</p>
              )}

              <Separator />

              <h3 className="text-lg font-medium">Emergency Contacts</h3>
              {student.emergencyContacts && student.emergencyContacts.length > 0 ? (
                <div className="space-y-4">
                  {student.emergencyContacts.map((contact, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3 border rounded-md">
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Name</p>
                        <p>{contact.name}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Relation</p>
                        <p>{contact.relation}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p>{contact.phone}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No emergency contacts provided</p>
              )}
            </TabsContent>

            <TabsContent value="documents" className="space-y-4 mt-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Student Documents</h3>
                <Button size="sm">
                  <Upload className="mr-2 h-4 w-4" /> Upload Document
                </Button>
              </div>
              
              {student.documents && student.documents.length > 0 ? (
                <div className="space-y-2">
                  {student.documents.map((doc, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-muted-foreground">{doc.type} • Uploaded on {new Date(doc.uploadDate).toLocaleDateString()}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="ghost" size="sm">
                          <Trash className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-6 border border-dashed rounded-md">
                  <p className="text-muted-foreground mb-2">No documents uploaded yet</p>
                  <Button size="sm">
                    <Upload className="mr-2 h-4 w-4" /> Upload First Document
                  </Button>
                </div>
              )}
            </TabsContent>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const DropdownStatusMenu = ({ 
  currentStatus, 
  onStatusChange 
}: { 
  currentStatus: string; 
  onStatusChange: (status: 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended') => void 
}) => {
  const statusOptions = [
    { value: 'active' as const, label: 'Active' },
    { value: 'inactive' as const, label: 'Inactive' },
    { value: 'graduated' as const, label: 'Graduated' },
    { value: 'suspended' as const, label: 'Suspended' }
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" className="w-full" size="sm">
          Change Status
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Set Status</DropdownMenuLabel>
        {statusOptions.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onStatusChange(option.value)}
            disabled={option.value === currentStatus}
          >
            {option.label}
            {option.value === currentStatus && ' (Current)'}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StudentProfile;
