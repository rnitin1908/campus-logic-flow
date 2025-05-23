import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants/api';

interface FormData {
  schoolName: string;
  schoolEmail: string;
  schoolPhone: string;
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  confirmPassword: string;
  schoolAddress: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  academicYear: string;
}

const RegisterTenant = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<string>('school-info');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  
  const [formData, setFormData] = useState<FormData>({
    schoolName: '',
    schoolEmail: '',
    schoolPhone: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',
    schoolAddress: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      pincode: ''
    },
    academicYear: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent as keyof FormData] as Record<string, string>,
          [child]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const validateStep = (step: string): boolean => {
    setError('');
    
    if (step === 'school-info') {
      if (!formData.schoolName) {
        setError('School name is required');
        return false;
      }
      if (!formData.schoolEmail) {
        setError('School email is required');
        return false;
      }
      if (!formData.schoolPhone) {
        setError('School phone is required');
        return false;
      }
      return true;
    }
    
    if (step === 'admin-account') {
      if (!formData.adminName) {
        setError('Admin name is required');
        return false;
      }
      if (!formData.adminEmail) {
        setError('Admin email is required');
        return false;
      }
      if (!formData.adminPassword) {
        setError('Admin password is required');
        return false;
      }
      if (formData.adminPassword.length < 8) {
        setError('Password must be at least 8 characters');
        return false;
      }
      if (formData.adminPassword !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      return true;
    }
    
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === 'school-info') {
        setCurrentStep('admin-account');
      } else if (currentStep === 'admin-account') {
        setCurrentStep('address-info');
      }
    }
  };

  const handlePrevStep = () => {
    if (currentStep === 'admin-account') {
      setCurrentStep('school-info');
    } else if (currentStep === 'address-info') {
      setCurrentStep('admin-account');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(currentStep)) {
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const { confirmPassword, ...submissionData } = formData;
      
      const response = await axios.post(`${API_BASE_URL}/tenants/register`, submissionData);
      
      if (response.data.success) {
        toast({
          title: "Success!",
          description: "School registered successfully. Redirecting to login.",
        });
        
        // Redirect to the newly created school's login page
        setTimeout(() => {
          navigate(response.data.data.loginUrl);
        }, 2000);
      } else {
        setError(response.data.message || 'An error occurred during registration');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/40 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Register Your School/College</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={currentStep} onValueChange={setCurrentStep} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="school-info" disabled={loading}>School Info</TabsTrigger>
              <TabsTrigger value="admin-account" disabled={loading}>Admin Account</TabsTrigger>
              <TabsTrigger value="address-info" disabled={loading}>Address</TabsTrigger>
            </TabsList>

            <TabsContent value="school-info" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="schoolName">School/College Name</Label>
                <Input 
                  id="schoolName" 
                  name="schoolName"
                  placeholder="e.g., Delhi Public School" 
                  value={formData.schoolName}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="schoolEmail">School Email</Label>
                <Input 
                  id="schoolEmail" 
                  name="schoolEmail"
                  type="email" 
                  placeholder="e.g., info@school.edu" 
                  value={formData.schoolEmail}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="schoolPhone">School Phone</Label>
                <Input 
                  id="schoolPhone" 
                  name="schoolPhone"
                  placeholder="e.g., +91 9876543210" 
                  value={formData.schoolPhone}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="academicYear">Academic Year</Label>
                <Input 
                  id="academicYear" 
                  name="academicYear"
                  placeholder="e.g., 2025-2026" 
                  value={formData.academicYear}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              
              <Button 
                type="button" 
                className="w-full" 
                onClick={handleNextStep}
                disabled={loading}
              >
                Next
              </Button>
            </TabsContent>

            <TabsContent value="admin-account" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="adminName">Admin Name</Label>
                <Input 
                  id="adminName" 
                  name="adminName"
                  placeholder="Full Name" 
                  value={formData.adminName}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adminEmail">Admin Email</Label>
                <Input 
                  id="adminEmail" 
                  name="adminEmail"
                  type="email" 
                  placeholder="admin@example.com" 
                  value={formData.adminEmail}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="adminPassword">Password</Label>
                <Input 
                  id="adminPassword" 
                  name="adminPassword"
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.adminPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword"
                  type="password" 
                  placeholder="••••••••" 
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-1/2" 
                  onClick={handlePrevStep}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button 
                  type="button" 
                  className="w-1/2" 
                  onClick={handleNextStep}
                  disabled={loading}
                >
                  Next
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="address-info" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="schoolAddress.street">Street Address</Label>
                <Input 
                  id="schoolAddress.street" 
                  name="schoolAddress.street"
                  placeholder="Street Address" 
                  value={formData.schoolAddress.street}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="schoolAddress.city">City</Label>
                  <Input 
                    id="schoolAddress.city" 
                    name="schoolAddress.city"
                    placeholder="City" 
                    value={formData.schoolAddress.city}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="schoolAddress.state">State</Label>
                  <Input 
                    id="schoolAddress.state" 
                    name="schoolAddress.state"
                    placeholder="State" 
                    value={formData.schoolAddress.state}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-2">
                  <Label htmlFor="schoolAddress.country">Country</Label>
                  <Input 
                    id="schoolAddress.country" 
                    name="schoolAddress.country"
                    placeholder="Country" 
                    value={formData.schoolAddress.country}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="schoolAddress.pincode">Pincode</Label>
                  <Input 
                    id="schoolAddress.pincode" 
                    name="schoolAddress.pincode"
                    placeholder="Pincode" 
                    value={formData.schoolAddress.pincode}
                    onChange={handleInputChange}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-1/2" 
                  onClick={handlePrevStep}
                  disabled={loading}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  className="w-1/2" 
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Registering...
                    </>
                  ) : 'Register'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Separator />
          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="underline underline-offset-4 hover:text-primary">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterTenant;
