
import React, { useEffect, useState } from 'react';
import { getAdmissionRequests, updateAdmissionStatus } from '@/lib/services/supabase/admissions';
import { AdmissionRequest, AdmissionStatus } from '@/types/admission';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { 
  Clock, CheckCircle, XCircle, Eye, Search, Loader2,
  Filter, FileText, MoreHorizontal, AlertCircle, UserPlus
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Textarea } from '@/components/ui/textarea';

const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    icon: Clock
  },
  reviewing: {
    label: 'Under Review',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    icon: Eye
  },
  approved: {
    label: 'Approved',
    color: 'text-green-600 bg-green-50 border-green-200',
    icon: CheckCircle
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-600 bg-red-50 border-red-200',
    icon: XCircle
  },
  waitlisted: {
    label: 'Waitlisted',
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    icon: AlertCircle
  }
};

interface School {
  id: string;
  name: string;
}

const AdminPortal = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [admissions, setAdmissions] = useState<AdmissionRequest[]>([]);
  const [filteredAdmissions, setFilteredAdmissions] = useState<AdmissionRequest[]>([]);
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<AdmissionStatus | 'all'>('all');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('');
  const [schools, setSchools] = useState<School[]>([]);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<AdmissionStatus>('reviewing');
  const [statusNotes, setStatusNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const { data, error } = await supabase.from('schools').select('id, name');
        if (error) throw error;
        setSchools(data || []);
      } catch (error) {
        console.error('Error fetching schools:', error);
        toast({
          title: "Error fetching schools",
          description: "Could not load school list. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchSchools();
  }, [toast]);

  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        setLoading(true);
        const schoolId = selectedSchoolId || undefined;
        const data = await getAdmissionRequests(undefined, schoolId);
        setAdmissions(data);
        setFilteredAdmissions(data);
      } catch (error) {
        console.error('Error fetching admissions:', error);
        toast({
          title: "Failed to load applications",
          description: "There was a problem retrieving admission applications.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissions();
  }, [selectedSchoolId, toast]);

  // Filter when tab, search, or school changes
  useEffect(() => {
    let result = admissions;
    
    // Filter by status if not "all"
    if (activeTab !== 'all') {
      result = result.filter(admission => admission.status === activeTab);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(admission => 
        admission.student_name.toLowerCase().includes(term) ||
        admission.email?.toLowerCase().includes(term) ||
        admission.grade_applying_for.toLowerCase().includes(term)
      );
    }
    
    setFilteredAdmissions(result);
  }, [activeTab, searchTerm, admissions]);

  const handleUpdateStatus = async () => {
    if (!selectedAdmission) return;
    
    setIsUpdating(true);
    try {
      await updateAdmissionStatus(selectedAdmission.id, newStatus, statusNotes || undefined);
      
      // Update the local state
      const updatedAdmissions = admissions.map(admission => 
        admission.id === selectedAdmission.id
          ? { ...admission, status: newStatus, notes: statusNotes || admission.notes }
          : admission
      );
      
      setAdmissions(updatedAdmissions);
      
      // Also update selected admission if it's open in the dialog
      if (selectedAdmission) {
        setSelectedAdmission({
          ...selectedAdmission,
          status: newStatus,
          notes: statusNotes || selectedAdmission.notes
        });
      }
      
      toast({
        title: "Status updated",
        description: `Application status has been updated to ${statusConfig[newStatus].label}`,
      });
      
      setIsUpdateDialogOpen(false);
      setStatusNotes('');
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Update failed",
        description: "Failed to update the application status.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const openUpdateDialog = (admission: AdmissionRequest) => {
    setSelectedAdmission(admission);
    setNewStatus(admission.status);
    setStatusNotes(admission.notes || '');
    setIsUpdateDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Admission Applications</h1>
        <p className="text-muted-foreground">
          Manage student admission applications and track their status
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by name, email or grade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="w-full md:w-64">
          <Select value={selectedSchoolId} onValueChange={setSelectedSchoolId}>
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filter by school" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Schools</SelectItem>
              {schools.map((school) => (
                <SelectItem key={school.id} value={school.id}>
                  {school.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as AdmissionStatus | 'all')}
        className="w-full"
      >
        <TabsList className="mb-6 w-full flex flex-wrap h-auto p-1">
          <TabsTrigger value="all" className="flex-1">
            All
            <Badge variant="secondary" className="ml-2">{admissions.length}</Badge>
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex-1">
            Pending
            <Badge variant="secondary" className="ml-2">
              {admissions.filter(a => a.status === 'pending').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="reviewing" className="flex-1">
            Reviewing
            <Badge variant="secondary" className="ml-2">
              {admissions.filter(a => a.status === 'reviewing').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="approved" className="flex-1">
            Approved
            <Badge variant="secondary" className="ml-2">
              {admissions.filter(a => a.status === 'approved').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="flex-1">
            Rejected
            <Badge variant="secondary" className="ml-2">
              {admissions.filter(a => a.status === 'rejected').length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="waitlisted" className="flex-1">
            Waitlisted
            <Badge variant="secondary" className="ml-2">
              {admissions.filter(a => a.status === 'waitlisted').length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              <span>Loading applications...</span>
            </div>
          ) : filteredAdmissions.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-gray-500" />
              </div>
              <h3 className="mt-2 text-sm font-semibold">No applications found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm 
                  ? "No applications match your search criteria."
                  : activeTab === 'all' 
                    ? "There are no admission applications yet."
                    : `There are no ${statusConfig[activeTab as AdmissionStatus].label.toLowerCase()} applications.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredAdmissions.map(admission => {
                const StatusIcon = statusConfig[admission.status].icon;
                return (
                  <Card key={admission.id} className="overflow-hidden">
                    <div className={`h-1 w-full ${statusConfig[admission.status].color.split(' ')[1]}`} />
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                        <div className="mb-4 md:mb-0">
                          <h3 className="text-lg font-semibold">{admission.student_name}</h3>
                          <p className="text-sm text-gray-500">
                            Applying for {admission.grade_applying_for}, {admission.academic_year}
                          </p>
                        </div>
                        
                        <div className="flex flex-col md:flex-row md:items-center gap-2">
                          <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig[admission.status].color}`}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {statusConfig[admission.status].label}
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="ml-2">
                                Actions <MoreHorizontal className="ml-1 h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => setSelectedAdmission(admission)}>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openUpdateDialog(admission)}>
                                <AlertCircle className="mr-2 h-4 w-4" />
                                Update Status
                              </DropdownMenuItem>
                              {admission.status === 'approved' && (
                                <DropdownMenuItem>
                                  <UserPlus className="mr-2 h-4 w-4" />
                                  Enroll Student
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 text-sm">
                        <div>
                          <p className="font-medium">Contact</p>
                          <p>{admission.email || "No email provided"}</p>
                          <p>{admission.contact_number || "No contact number"}</p>
                        </div>
                        <div>
                          <p className="font-medium">School</p>
                          <p>{schools.find(s => s.id === admission.school_id)?.name || "No school selected"}</p>
                        </div>
                        <div>
                          <p className="font-medium">Documents</p>
                          <p>{admission.documents?.length || 0} uploaded</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* View Application Details Dialog */}
      {selectedAdmission && !isUpdateDialogOpen && (
        <Dialog open={!!selectedAdmission} onOpenChange={() => setSelectedAdmission(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Admission Application Details</DialogTitle>
              <DialogDescription>
                Review the full details of this student admission application
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <div className={`p-3 rounded-md border ${statusConfig[selectedAdmission.status].color}`}>
                <div className="flex items-center">
                  {React.createElement(statusConfig[selectedAdmission.status].icon, { className: "mr-2 h-5 w-5" })}
                  <div>
                    <p className="font-medium">Status: {statusConfig[selectedAdmission.status].label}</p>
                    {selectedAdmission.notes && (
                      <p className="text-sm mt-1">{selectedAdmission.notes}</p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Student Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Full Name</p>
                        <p>{selectedAdmission.student_name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                        <p>{selectedAdmission.date_of_birth || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Gender</p>
                        <p>{selectedAdmission.gender || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Previous School</p>
                        <p>{selectedAdmission.previous_school || "Not provided"}</p>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p>{selectedAdmission.address || "Not provided"}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle>Contact & Application Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Email</p>
                        <p>{selectedAdmission.email || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Contact Number</p>
                        <p>{selectedAdmission.contact_number || "Not provided"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Grade Applying For</p>
                        <p>{selectedAdmission.grade_applying_for}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Academic Year</p>
                        <p>{selectedAdmission.academic_year}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">School</p>
                        <p>{schools.find(s => s.id === selectedAdmission.school_id)?.name || "Not specified"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Application Date</p>
                        <p>{new Date(selectedAdmission.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Documents</CardTitle>
                  <CardDescription>
                    Documents uploaded with this application
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(selectedAdmission.documents?.length || 0) > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedAdmission.documents?.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                          <div className="flex items-center overflow-hidden">
                            <FileText className="mr-2 h-4 w-4 flex-shrink-0 text-gray-500" />
                            <span className="truncate text-sm">{doc.name}</span>
                          </div>
                          <Button variant="ghost" size="sm" asChild className="ml-2 flex-shrink-0">
                            <a href={doc.url} target="_blank" rel="noopener noreferrer">
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>No documents have been uploaded</p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setSelectedAdmission(null)}>
                  Close
                </Button>
                <Button onClick={() => openUpdateDialog(selectedAdmission)}>
                  Update Status
                </Button>
                {selectedAdmission.status === 'approved' && (
                  <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Enroll Student
                  </Button>
                )}
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}
      
      {/* Update Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Application Status</DialogTitle>
            <DialogDescription>
              Change the status of the admission application for {selectedAdmission?.student_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium">Status</label>
              <Select value={newStatus} onValueChange={(value) => setNewStatus(value as AdmissionStatus)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="reviewing">Under Review</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="waitlisted">Waitlisted</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">Notes</label>
              <Textarea
                id="notes"
                placeholder="Add any notes or reasons for this status update..."
                value={statusNotes}
                onChange={(e) => setStatusNotes(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateStatus} disabled={isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating
                </>
              ) : (
                "Update Status"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPortal;
