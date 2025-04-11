
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { getAdmissionRequests } from '@/lib/services/supabase/admissions';
import { AdmissionRequest, AdmissionStatus as Status } from '@/types/admission';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Loader2, FileText, Eye, AlertCircle, Clock, CheckCircle, XCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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

const AdmissionStatus = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [admissions, setAdmissions] = useState<AdmissionRequest[]>([]);
  const [selectedAdmission, setSelectedAdmission] = useState<AdmissionRequest | null>(null);
  const [activeTab, setActiveTab] = useState<Status | 'all'>('all');

  useEffect(() => {
    const fetchAdmissions = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const data = await getAdmissionRequests(user.id);
        setAdmissions(data);
      } catch (error) {
        console.error('Error fetching admissions:', error);
        toast({
          title: "Failed to load applications",
          description: "There was a problem retrieving your admission applications.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdmissions();
  }, [user?.id, toast]);

  const filteredAdmissions = activeTab === 'all' 
    ? admissions 
    : admissions.filter(admission => admission.status === activeTab);

  return (
    <div className="space-y-6">
      <Tabs 
        defaultValue="all" 
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as Status | 'all')}
        className="w-full"
      >
        <TabsList className="mb-6 w-full flex flex-wrap h-auto p-1">
          <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
          <TabsTrigger value="pending" className="flex-1">Pending</TabsTrigger>
          <TabsTrigger value="reviewing" className="flex-1">Reviewing</TabsTrigger>
          <TabsTrigger value="approved" className="flex-1">Approved</TabsTrigger>
          <TabsTrigger value="rejected" className="flex-1">Rejected</TabsTrigger>
          <TabsTrigger value="waitlisted" className="flex-1">Waitlisted</TabsTrigger>
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
                {activeTab === 'all' 
                  ? "You haven't submitted any admission applications yet."
                  : `You don't have any ${statusConfig[activeTab as Status].label.toLowerCase()} applications.`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredAdmissions.map(admission => {
                const StatusIcon = statusConfig[admission.status].icon;
                return (
                  <Card key={admission.id} className="overflow-hidden">
                    <div className={`h-1 w-full ${statusConfig[admission.status].color.split(' ')[1]}`} />
                    <CardHeader className="pb-2">
                      <CardTitle className="text-xl">{admission.student_name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium">Application For</p>
                          <p className="text-gray-600">{admission.grade_applying_for}, {admission.academic_year}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Submitted On</p>
                          <p className="text-gray-600">{new Date(admission.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig[admission.status].color}`}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig[admission.status].label}
                        </div>
                        
                        <Button variant="outline" size="sm" onClick={() => setSelectedAdmission(admission)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {selectedAdmission && (
        <Dialog open={!!selectedAdmission} onOpenChange={() => setSelectedAdmission(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Review your admission application status and details
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Student Name</h4>
                  <p>{selectedAdmission.student_name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Date of Birth</h4>
                  <p>{selectedAdmission.date_of_birth || "Not provided"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Gender</h4>
                  <p>{selectedAdmission.gender || "Not provided"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Email</h4>
                  <p>{selectedAdmission.email || "Not provided"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Contact Number</h4>
                  <p>{selectedAdmission.contact_number || "Not provided"}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Grade Applying For</h4>
                  <p>{selectedAdmission.grade_applying_for}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Academic Year</h4>
                  <p>{selectedAdmission.academic_year}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-1">Previous School</h4>
                  <p>{selectedAdmission.previous_school || "Not provided"}</p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-1">Address</h4>
                <p>{selectedAdmission.address || "Not provided"}</p>
              </div>
              
              {(selectedAdmission.documents?.length || 0) > 0 ? (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Uploaded Documents</h4>
                  <div className="space-y-2">
                    {selectedAdmission.documents?.map(doc => (
                      <div key={doc.id} className="flex items-center justify-between p-2 bg-gray-50 rounded border">
                        <div className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-gray-500" />
                          <span>{doc.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                          <a href={doc.url} target="_blank" rel="noopener noreferrer">
                            <Eye className="h-4 w-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">No documents uploaded yet</div>
              )}
              
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500">Submitted on</p>
                    <p className="text-sm">{new Date(selectedAdmission.created_at).toLocaleString()}</p>
                  </div>
                  <Button variant="default" onClick={() => setSelectedAdmission(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdmissionStatus;
