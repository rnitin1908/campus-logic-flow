import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface AdmissionRequest {
  id: string;
  student_name: string;
  student_email: string;
  parent_name: string;
  parent_email: string;
  phone: string;
  grade_applying_for: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

const AdminPortal = () => {
  const [requests, setRequests] = useState<AdmissionRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // TODO: Replace with actual API call when backend is ready
      console.log('Fetching admission requests...');
      
      // Mock data for now
      const mockRequests = [
        {
          id: '1',
          student_name: 'John Doe',
          student_email: 'john@example.com',
          parent_name: 'Jane Doe',
          parent_email: 'jane@example.com',
          phone: '+1234567890',
          grade_applying_for: '10th Grade',
          status: 'pending' as const,
          created_at: new Date().toISOString()
        }
      ];
      
      setRequests(mockRequests);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      // TODO: Replace with actual API call when backend is ready
      console.log('Updating request status:', id, status);
      
      setRequests(requests.map(req => 
        req.id === id ? { ...req, status } : req
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Admission Requests</CardTitle>
          <CardDescription>Manage incoming admission requests</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading requests...</div>
          ) : (
            <Table>
              <TableCaption>A list of your recent admission requests.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">ID</TableHead>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Grade Applying For</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-medium">{request.id}</TableCell>
                    <TableCell>{request.student_name}</TableCell>
                    <TableCell>{request.grade_applying_for}</TableCell>
                    <TableCell>{request.status}</TableCell>
                    <TableCell>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => updateRequestStatus(request.id, 'approved')}>Approve</Button>
                          <Button size="sm" variant="destructive" onClick={() => updateRequestStatus(request.id, 'rejected')}>Reject</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminPortal;
