import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Mail, 
  Shield, 
  UserCog, 
  AlertTriangle,
  Check,
  X 
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants/api';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';

// Types
interface SchoolAdmin {
  _id: string;
  name: string;
  email: string;
  role: string;
  schoolRole: string;
  status: 'active' | 'inactive' | 'pending';
  permissions: string[];
  createdAt: string;
  lastLogin?: string;
}

interface School {
  _id: string;
  name: string;
  slug: string;
  logo_url?: string;
}

// School roles mapping
const SCHOOL_ROLES = {
  principal: 'Principal',
  vice_principal: 'Vice Principal',
  admin_staff: 'Administrative Staff',
  it_admin: 'IT Administrator',
  finance_admin: 'Finance Administrator',
  academic_head: 'Academic Head'
};

// Component for managing school admins
const SchoolAdmins = () => {
  const { schoolId } = useParams<{ schoolId: string }>();
  const { user, token } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [school, setSchool] = useState<School | null>(null);
  const [admins, setAdmins] = useState<SchoolAdmin[]>([]);
  const [filteredAdmins, setFilteredAdmins] = useState<SchoolAdmin[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<SchoolAdmin | null>(null);
  
  // Form state for adding/editing admin
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [adminFormData, setAdminFormData] = useState({
    name: '',
    email: '',
    schoolRole: 'principal',
    permissions: [] as string[]
  });
  
  // Fetch school and admins data
  useEffect(() => {
    const fetchSchoolData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch school details
        const schoolResponse = await axios.get(`${API_BASE_URL}/schools/${schoolId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setSchool(schoolResponse.data);
        
        // Fetch school admins
        const adminsResponse = await axios.get(`${API_BASE_URL}/schools/${schoolId}/admins`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setAdmins(adminsResponse.data);
        setFilteredAdmins(adminsResponse.data);
      } catch (error) {
        console.error('Error fetching school data:', error);
        toast({
          title: 'Error',
          description: 'Failed to load school data. Please try again.',
          variant: 'destructive',
        });
        
        // For development: Mock data
        const mockSchool: School = {
          _id: schoolId || '1',
          name: 'Green Valley School',
          slug: 'greenvalley',
        };
        
        const mockAdmins: SchoolAdmin[] = [
          {
            _id: '1',
            name: 'John Smith',
            email: 'john.smith@greenvalley.edu',
            role: 'school_admin',
            schoolRole: 'principal',
            status: 'active',
            permissions: ['manage_users', 'manage_teachers', 'manage_students', 'view_reports'],
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          },
          {
            _id: '2',
            name: 'Mary Johnson',
            email: 'mary.johnson@greenvalley.edu',
            role: 'school_admin',
            schoolRole: 'vice_principal',
            status: 'active',
            permissions: ['manage_teachers', 'manage_students', 'view_reports'],
            createdAt: new Date().toISOString(),
          },
          {
            _id: '3',
            name: 'Robert Davis',
            email: 'robert.davis@greenvalley.edu',
            role: 'school_admin',
            schoolRole: 'it_admin',
            status: 'inactive',
            permissions: ['manage_users', 'manage_system'],
            createdAt: new Date().toISOString(),
          },
        ];
        
        setSchool(mockSchool);
        setAdmins(mockAdmins);
        setFilteredAdmins(mockAdmins);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (schoolId) {
      fetchSchoolData();
    }
  }, [schoolId, token, toast]);
  
  // Filter admins based on search term and status
  useEffect(() => {
    let result = admins;
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        admin => 
          admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          admin.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(admin => admin.status === statusFilter);
    }
    
    setFilteredAdmins(result);
  }, [searchTerm, statusFilter, admins]);
  
  // Handle form field changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setAdminFormData({
      ...adminFormData,
      [name]: value
    });
  };
  
  // Handle permission toggle
  const handlePermissionToggle = (permission: string) => {
    setAdminFormData(prev => {
      const permissions = [...prev.permissions];
      
      if (permissions.includes(permission)) {
        return {
          ...prev,
          permissions: permissions.filter(p => p !== permission)
        };
      } else {
        return {
          ...prev,
          permissions: [...permissions, permission]
        };
      }
    });
  };
  
  // Handle adding/editing admin
  const handleSaveAdmin = async () => {
    // Validate form
    if (!adminFormData.name || !adminFormData.email || !adminFormData.schoolRole) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      if (isEditing && selectedAdmin) {
        // Update existing admin
        await axios.put(
          `${API_BASE_URL}/schools/${schoolId}/admins/${selectedAdmin._id}`,
          adminFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        toast({
          title: 'Success',
          description: 'Admin updated successfully!',
        });
        
        // Update admins list
        setAdmins(admins.map(admin => 
          admin._id === selectedAdmin._id 
            ? { 
                ...admin, 
                name: adminFormData.name, 
                email: adminFormData.email, 
                schoolRole: adminFormData.schoolRole,
                permissions: adminFormData.permissions
              } 
            : admin
        ));
      } else {
        // Create new admin
        const response = await axios.post(
          `${API_BASE_URL}/schools/${schoolId}/admins`, 
          adminFormData,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );
        
        toast({
          title: 'Success',
          description: 'Admin created successfully!',
        });
        
        // Add new admin to list
        setAdmins([...admins, {
          _id: response.data._id,
          name: adminFormData.name,
          email: adminFormData.email,
          role: 'school_admin',
          schoolRole: adminFormData.schoolRole,
          status: 'active',
          permissions: adminFormData.permissions,
          createdAt: new Date().toISOString(),
        }]);
      }
      
      // Reset form and close dialog
      setShowAdminDialog(false);
      setAdminFormData({
        name: '',
        email: '',
        schoolRole: 'principal',
        permissions: []
      });
      setIsEditing(false);
      setSelectedAdmin(null);
    } catch (error) {
      console.error('Error saving admin:', error);
      toast({
        title: 'Error',
        description: 'Failed to save admin. Please try again.',
        variant: 'destructive',
      });
      
      // For development: simulate success
      // Update UI to show changes
      if (isEditing && selectedAdmin) {
        setAdmins(admins.map(admin => 
          admin._id === selectedAdmin._id 
            ? { 
                ...admin, 
                name: adminFormData.name, 
                email: adminFormData.email, 
                schoolRole: adminFormData.schoolRole,
                permissions: adminFormData.permissions
              } 
            : admin
        ));
      } else {
        // Add mock new admin
        const newId = (Math.max(...admins.map(a => parseInt(a._id))) + 1).toString();
        setAdmins([...admins, {
          _id: newId,
          name: adminFormData.name,
          email: adminFormData.email,
          role: 'school_admin',
          schoolRole: adminFormData.schoolRole,
          status: 'active',
          permissions: adminFormData.permissions,
          createdAt: new Date().toISOString(),
        }]);
      }
      
      // Reset form and close dialog
      setShowAdminDialog(false);
      setAdminFormData({
        name: '',
        email: '',
        schoolRole: 'principal',
        permissions: []
      });
      setIsEditing(false);
      setSelectedAdmin(null);
      
      toast({
        title: 'Demo: Admin Saved',
        description: 'This is a simulated success response for development.',
      });
    }
  };
  
  // Handle deactivating/activating admin
  const handleToggleAdminStatus = async () => {
    if (!selectedAdmin) return;
    
    const newStatus = selectedAdmin.status === 'active' ? 'inactive' : 'active';
    
    try {
      await axios.patch(
        `${API_BASE_URL}/schools/${schoolId}/admins/${selectedAdmin._id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast({
        title: 'Success',
        description: `Admin ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully!`,
      });
      
      // Update admins list
      setAdmins(admins.map(admin => 
        admin._id === selectedAdmin._id 
          ? { ...admin, status: newStatus as 'active' | 'inactive' } 
          : admin
      ));
    } catch (error) {
      console.error('Error toggling admin status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update admin status. Please try again.',
        variant: 'destructive',
      });
      
      // For development: Update UI anyway
      setAdmins(admins.map(admin => 
        admin._id === selectedAdmin._id 
          ? { ...admin, status: newStatus as 'active' | 'inactive' } 
          : admin
      ));
      
      toast({
        title: 'Demo: Status Updated',
        description: 'This is a simulated success response for development.',
      });
    } finally {
      setShowDeleteDialog(false);
      setSelectedAdmin(null);
    }
  };
  
  // Handle sending password reset email
  const handleSendPasswordReset = async (admin: SchoolAdmin) => {
    try {
      await axios.post(
        `${API_BASE_URL}/api/auth/reset-password`,
        { email: admin.email },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      toast({
        title: 'Password Reset Sent',
        description: `Password reset link has been sent to ${admin.email}.`,
      });
    } catch (error) {
      console.error('Error sending password reset:', error);
      toast({
        title: 'Error',
        description: 'Failed to send password reset email. Please try again.',
        variant: 'destructive',
      });
      
      // For development: Show success toast anyway
      toast({
        title: 'Demo: Reset Email Sent',
        description: `Password reset link would be sent to ${admin.email} in production.`,
      });
    }
  };
  
  // Edit admin handler
  const handleEditAdmin = (admin: SchoolAdmin) => {
    setIsEditing(true);
    setSelectedAdmin(admin);
    setAdminFormData({
      name: admin.name,
      email: admin.email,
      schoolRole: admin.schoolRole,
      permissions: admin.permissions,
    });
    setShowAdminDialog(true);
  };
  
  // Format school role
  const formatSchoolRole = (roleKey: string) => {
    return SCHOOL_ROLES[roleKey as keyof typeof SCHOOL_ROLES] || roleKey;
  };
  
  // Render status badge
  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="secondary">Inactive</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-orange-500 border-orange-500">Pending</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Available permissions
  const availablePermissions = [
    { id: 'manage_users', label: 'Manage Users' },
    { id: 'manage_teachers', label: 'Manage Teachers' },
    { id: 'manage_students', label: 'Manage Students' },
    { id: 'manage_courses', label: 'Manage Courses' },
    { id: 'manage_grades', label: 'Manage Grades' },
    { id: 'manage_attendance', label: 'Manage Attendance' },
    { id: 'manage_system', label: 'Manage System Settings' },
    { id: 'view_reports', label: 'View Reports' },
    { id: 'manage_finances', label: 'Manage Finances' },
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => navigate('/admin/schools')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Schools
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">School Administrators</h1>
          {school && (
            <p className="text-muted-foreground flex items-center">
              <Shield className="h-4 w-4 mr-2" /> 
              Manage admins for {school.name}
            </p>
          )}
        </div>
        <Button onClick={() => {
          setIsEditing(false);
          setAdminFormData({
            name: '',
            email: '',
            schoolRole: 'principal',
            permissions: []
          });
          setShowAdminDialog(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Add Admin
        </Button>
      </div>
      
      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-x-4 md:space-y-0">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search admins..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">Status:</span>
              <div className="flex space-x-1">
                <Button 
                  variant={statusFilter === 'all' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setStatusFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={statusFilter === 'active' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setStatusFilter('active')}
                  className={statusFilter === 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
                >
                  Active
                </Button>
                <Button 
                  variant={statusFilter === 'inactive' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setStatusFilter('inactive')}
                >
                  Inactive
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Admins Table */}
      <Card>
        <CardHeader>
          <CardTitle>School Administrators</CardTitle>
          <CardDescription>
            Total: {filteredAdmins.length} administrators {statusFilter !== 'all' && `(filtered by ${statusFilter})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            </div>
          ) : filteredAdmins.length === 0 ? (
            <div className="text-center py-8">
              <UserCog className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-semibold">No administrators found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding a new administrator'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={() => {
                  setIsEditing(false);
                  setAdminFormData({
                    name: '',
                    email: '',
                    schoolRole: 'principal',
                    permissions: []
                  });
                  setShowAdminDialog(true);
                }} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Add Admin
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.map((admin) => (
                    <TableRow key={admin._id}>
                      <TableCell className="font-medium">{admin.name}</TableCell>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>{formatSchoolRole(admin.schoolRole)}</TableCell>
                      <TableCell>{renderStatusBadge(admin.status)}</TableCell>
                      <TableCell>
                        {admin.lastLogin 
                          ? format(new Date(admin.lastLogin), 'MMM d, yyyy')
                          : 'Never'}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Open menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditAdmin(admin)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSendPasswordReset(admin)}>
                              <Mail className="mr-2 h-4 w-4" /> Send Password Reset
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className={admin.status === 'active' ? "text-destructive focus:text-destructive" : "text-green-500 focus:text-green-500"}
                              onClick={() => {
                                setSelectedAdmin(admin);
                                setShowDeleteDialog(true);
                              }}
                            >
                              {admin.status === 'active' ? (
                                <>
                                  <X className="mr-2 h-4 w-4" /> Deactivate
                                </>
                              ) : (
                                <>
                                  <Check className="mr-2 h-4 w-4" /> Activate
                                </>
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Admin Dialog - Add/Edit */}
      <Dialog open={showAdminDialog} onOpenChange={setShowAdminDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Administrator' : 'Add New Administrator'}</DialogTitle>
            <DialogDescription>
              {isEditing 
                ? 'Update administrator details for this school' 
                : 'Add a new administrator for this school'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                name="name"
                value={adminFormData.name}
                onChange={handleFormChange}
                placeholder="e.g. John Smith"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={adminFormData.email}
                onChange={handleFormChange}
                placeholder="e.g. john.smith@school.edu"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="schoolRole">Role in School <span className="text-red-500">*</span></Label>
              <select
                id="schoolRole"
                name="schoolRole"
                value={adminFormData.schoolRole}
                onChange={handleFormChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                required
              >
                {Object.entries(SCHOOL_ROLES).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="grid grid-cols-2 gap-2">
                {availablePermissions.map(permission => (
                  <div key={permission.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={`permission-${permission.id}`}
                      checked={adminFormData.permissions.includes(permission.id)}
                      onChange={() => handlePermissionToggle(permission.id)}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <Label htmlFor={`permission-${permission.id}`} className="text-sm">
                      {permission.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAdminDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveAdmin}>
              {isEditing ? 'Update Admin' : 'Add Admin'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Status Change Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedAdmin?.status === 'active' ? (
                <>
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Deactivate Administrator
                </>
              ) : (
                <>
                  <Check className="h-5 w-5 text-green-500" />
                  Activate Administrator
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {selectedAdmin?.status === 'active' 
                ? `This will deactivate ${selectedAdmin?.name} and prevent them from accessing the system.`
                : `This will activate ${selectedAdmin?.name} and allow them to access the system.`}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium">Are you sure you want to proceed?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant={selectedAdmin?.status === 'active' ? 'destructive' : 'default'}
              onClick={handleToggleAdminStatus}
              className={selectedAdmin?.status !== 'active' ? 'bg-green-500 hover:bg-green-600' : ''}
            >
              {selectedAdmin?.status === 'active' ? 'Deactivate' : 'Activate'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolAdmins;
