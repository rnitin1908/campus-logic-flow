import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Users, 
  School, 
  AlertTriangle 
} from 'lucide-react';
import { API_BASE_URL } from '@/lib/constants/api';
import { useAuth } from '@/contexts/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';

// School interface
interface School {
  _id: string;
  name: string;
  code: string;
  logo_url?: string;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  admin_count?: number;
  student_count?: number;
  teacher_count?: number;
}

const SchoolManagement = () => {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  
  // Fetch schools data
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setIsLoading(true);
        // In a real implementation, this would be an API call
        const response = await axios.get(`${API_BASE_URL}/schools`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Ensure response.data is an array
        console.log("response.data",response.data.data);
        console.log("response.school",response.data.schools);
        const schoolsData = Array.isArray(response.data.data) ? response.data.data : 
                          (response.data.data && Array.isArray(response.data.data)) ? 
                          response.data.data : [];
        
        setSchools(schoolsData);
        setFilteredSchools(schoolsData);
      } catch (error) {
        console.error('Error fetching schools:', error);
        toast({
          title: 'Error',
          description: 'Failed to load schools. Please try again.',
          variant: 'destructive',
        });
        
        // For development: use mock data if API fails
        const mockSchools: School[] = [
          {
            _id: '1',
            name: 'Green Valley School',
            slug: 'greenvalley',
            status: 'active',
            createdAt: new Date().toISOString(),
            admin_count: 3,
            student_count: 450,
            teacher_count: 32,
          },
          {
            _id: '2',
            name: 'Blue Mountain Academy',
            slug: 'bluemountain',
            status: 'active',
            createdAt: new Date().toISOString(),
            admin_count: 2,
            student_count: 320,
            teacher_count: 28,
          },
          {
            _id: '3',
            name: 'Sunshine Elementary',
            slug: 'sunshine',
            status: 'inactive',
            createdAt: new Date().toISOString(),
            admin_count: 1,
            student_count: 200,
            teacher_count: 15,
          },
          {
            _id: '4',
            name: 'Tech High School',
            slug: 'techhs',
            status: 'pending',
            createdAt: new Date().toISOString(),
            admin_count: 0,
            student_count: 0,
            teacher_count: 0,
          },
        ];
        
        setSchools(mockSchools);
        setFilteredSchools(mockSchools);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSchools();
  }, [token, toast]);
  
  // Filter schools based on search term and status
  useEffect(() => {
    // Ensure schools is an array
    if (!Array.isArray(schools)) {
      setFilteredSchools([]);
      return;
    }
    
    let result = [...schools];
    
    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        school => 
          school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          school.slug.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(school => school.status === statusFilter);
    }
    
    setFilteredSchools(result);
  }, [searchTerm, statusFilter, schools]);
  
  // Handle delete school
  const handleDeleteSchool = async () => {
    if (!selectedSchool) return;
    
    try {
      // In a real implementation, this would be an API call
      await axios.delete(`${API_BASE_URL}/api/schools/${selectedSchool._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // Update schools list (in reality would fetch fresh data)
      setSchools(schools.map(school => 
        school._id === selectedSchool._id 
          ? { ...school, status: 'inactive' as const } 
          : school
      ));
      
      toast({
        title: 'Success',
        description: `School ${selectedSchool.name} has been deactivated.`,
      });
    } catch (error) {
      console.error('Error deleting school:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete school. Please try again.',
        variant: 'destructive',
      });
      
      // For development: update UI anyway
      setSchools(schools.map(school => 
        school._id === selectedSchool._id 
          ? { ...school, status: 'inactive' as const } 
          : school
      ));
    } finally {
      setShowDeleteDialog(false);
      setSelectedSchool(null);
    }
  };
  
  // Navigation handlers
  const handleAddSchool = () => {
    navigate('/admin/schools/create');
  };
  
  const handleEditSchool = (school: School) => {
    navigate(`/admin/schools/edit/${school._id}`);
  };
  
  const handleViewSchool = (school: School) => {
    navigate(`/admin/schools/view/${school._id}`);
  };
  
  const handleManageAdmins = (school: School) => {
    navigate(`/admin/schools/${school._id}/admins`);
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
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">School Management</h1>
          <p className="text-muted-foreground">
            Manage all schools and tenants in the system
          </p>
        </div>
        <Button onClick={handleAddSchool}>
          <Plus className="mr-2 h-4 w-4" /> Add School
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
                placeholder="Search schools..."
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
                <Button 
                  variant={statusFilter === 'pending' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setStatusFilter('pending')}
                  className={statusFilter === 'pending' ? 'bg-orange-500 hover:bg-orange-600' : ''}
                >
                  Pending
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Schools Table */}
      <Card>
        <CardHeader>
          <CardTitle>Schools</CardTitle>
          <CardDescription>
            Total: {filteredSchools.length} schools {statusFilter !== 'all' && `(filtered by ${statusFilter})`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
            </div>
          ) : filteredSchools.length === 0 ? (
            <div className="text-center py-8">
              <School className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
              <h3 className="mt-4 text-lg font-semibold">No schools found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Get started by adding a new school'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button onClick={handleAddSchool} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" /> Add School
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>School Name</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Admins</TableHead>
                    <TableHead>Students</TableHead>
                    <TableHead>Teachers</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.isArray(filteredSchools) && filteredSchools.map((school) => (
                    <TableRow key={school._id}>
                      <TableCell className="font-medium">{school.name}</TableCell>
                      <TableCell className="font-mono text-sm">{school.code}</TableCell>
                      <TableCell>{renderStatusBadge(school.status)}</TableCell>
                      <TableCell>{school.admin_count || 0}</TableCell>
                      <TableCell>{school.student_count || 0}</TableCell>
                      <TableCell>{school.teacher_count || 0}</TableCell>
                      <TableCell>{format(new Date(school.created_at), 'MMM d, yyyy')}</TableCell>
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
                            <DropdownMenuItem onClick={() => handleViewSchool(school)}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditSchool(school)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit School
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleManageAdmins(school)}>
                              <Users className="mr-2 h-4 w-4" /> Manage Admins
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => {
                                setSelectedSchool(school);
                                setShowDeleteDialog(true);
                              }}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Deactivate School
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
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Deactivate School
            </DialogTitle>
            <DialogDescription>
              This will deactivate "{selectedSchool?.name}" and prevent users from accessing it.
              All data will be preserved but inaccessible until reactivated.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm font-medium">Are you sure you want to proceed?</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteSchool}>
              Deactivate School
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SchoolManagement;
