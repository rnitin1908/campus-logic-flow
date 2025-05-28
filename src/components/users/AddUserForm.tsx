
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useToast } from "@/components/ui/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { mongodbService } from '@/lib/services';
import { UserFormData, Class, School } from '@/types/user';
import { USER_ROLES } from '@/lib/constants/roles';
import ParentLinkManager from './ParentLinkManager';

interface AddUserFormProps {
  onUserAdded: () => void;
}

const AddUserForm = ({ onUserAdded }: AddUserFormProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [schools, setSchools] = useState<School[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedSchool, setSelectedSchool] = useState('');
  const [parentLinks, setParentLinks] = useState<any[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserFormData>();

  const watchedRole = watch('role');
  const watchedSchool = watch('school_id');

  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    if (watchedSchool) {
      fetchClasses(watchedSchool);
    }
  }, [watchedSchool]);

  const fetchSchools = async () => {
    try {
      const response = await mongodbService.getSchools();
      setSchools(response);
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  const fetchClasses = async (schoolId: string) => {
    try {
      const response = await mongodbService.getClasses(schoolId);
      setClasses(response);
    } catch (error) {
      console.error('Error fetching classes:', error);
      setClasses([]);
    }
  };

  const onSubmit = async (data: UserFormData) => {
    try {
      setIsLoading(true);
      
      const userData = {
        ...data,
        parent_links: selectedRole === USER_ROLES.STUDENT ? parentLinks : undefined,
      };

      await mongodbService.createUser(userData);
      
      toast({
        title: "Success",
        description: "User created successfully",
      });
      
      reset();
      setParentLinks([]);
      onUserAdded();
    } catch (error) {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Add New User</CardTitle>
        <CardDescription>
          Create a new user account with appropriate role and permissions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                {...register('name', { required: 'Name is required' })}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { 
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters'
                  }
                })}
                placeholder="Enter password"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                {...register('phone')}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => {
                  setSelectedRole(value);
                  setValue('role', value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(USER_ROLES).map(([key, value]) => (
                    <SelectItem key={key} value={value}>
                      {value.replace('_', ' ').toUpperCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="school_id">School</Label>
              <Select
                value={selectedSchool}
                onValueChange={(value) => {
                  setSelectedSchool(value);
                  setValue('school_id', value);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select school" />
                </SelectTrigger>
                <SelectContent>
                  {schools.map((school) => (
                    <SelectItem key={school.id} value={school.id}>
                      {school.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {(selectedRole === USER_ROLES.STUDENT || selectedRole === USER_ROLES.TEACHER) && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="class_id">Class</Label>
                  <Select
                    onValueChange={(value) => setValue('class_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((cls) => (
                        <SelectItem key={cls.id} value={cls.id}>
                          {cls.name} - Grade {cls.grade_level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedRole === USER_ROLES.STUDENT && (
                  <div className="space-y-2">
                    <Label htmlFor="section">Section</Label>
                    <Input
                      id="section"
                      {...register('section')}
                      placeholder="Enter section (e.g., A, B, C)"
                    />
                  </div>
                )}
              </>
            )}
          </div>

          {selectedRole === USER_ROLES.STUDENT && (
            <div className="space-y-4">
              <Label>Parent Links</Label>
              <ParentLinkManager
                parentLinks={parentLinks}
                onParentLinksChange={setParentLinks}
              />
            </div>
          )}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Creating User...' : 'Create User'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddUserForm;
