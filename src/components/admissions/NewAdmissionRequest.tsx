import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle } from 'lucide-react';

interface AdmissionFormData {
  student_name: string;
  student_email: string;
  parent_name?: string;
  parent_email?: string;
  phone?: string;
  grade_applying_for: string;
  previous_school?: string;
  additional_notes?: string;
}

const NewAdmissionRequest = () => {
  const [formData, setFormData] = useState<AdmissionFormData>({
    student_name: '',
    student_email: '',
    parent_name: '',
    parent_email: '',
    phone: '',
    grade_applying_for: '',
    previous_school: '',
    additional_notes: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.student_name || !formData.student_email) {
      setError('Please fill in all required fields');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // TODO: Replace with actual API call when backend is ready
      console.log('Creating admission request:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      // Reset form
      setFormData({
        student_name: '',
        student_email: '',
        parent_name: '',
        parent_email: '',
        phone: '',
        grade_applying_for: '',
        previous_school: '',
        additional_notes: ''
      });
    } catch (error: any) {
      setError(error.message || 'Failed to submit admission request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Admission Request</CardTitle>
        <CardDescription>Submit a new admission request for a student.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {success && (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>Admission request submitted successfully!</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-2">
          <Label htmlFor="student_name">Student Name</Label>
          <Input
            id="student_name"
            name="student_name"
            placeholder="Enter student name"
            value={formData.student_name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="student_email">Student Email</Label>
          <Input
            id="student_email"
            name="student_email"
            type="email"
            placeholder="Enter student email"
            value={formData.student_email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="parent_name">Parent Name (Optional)</Label>
          <Input
            id="parent_name"
            name="parent_name"
            placeholder="Enter parent name"
            value={formData.parent_name || ''}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="parent_email">Parent Email (Optional)</Label>
          <Input
            id="parent_email"
            name="parent_email"
            type="email"
            placeholder="Enter parent email"
            value={formData.parent_email || ''}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phone">Phone (Optional)</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter phone number"
            value={formData.phone || ''}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="grade_applying_for">Grade Applying For</Label>
          <Input
            id="grade_applying_for"
            name="grade_applying_for"
            placeholder="Enter grade applying for"
            value={formData.grade_applying_for}
            onChange={handleChange}
            required
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="previous_school">Previous School (Optional)</Label>
          <Input
            id="previous_school"
            name="previous_school"
            placeholder="Enter previous school"
            value={formData.previous_school || ''}
            onChange={handleChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="additional_notes">Additional Notes (Optional)</Label>
          <Input
            id="additional_notes"
            name="additional_notes"
            placeholder="Enter additional notes"
            value={formData.additional_notes || ''}
            onChange={handleChange}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? 'Submitting...' : 'Submit Request'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewAdmissionRequest;
