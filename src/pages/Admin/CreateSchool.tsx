import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { API_BASE_URL } from '@/lib/constants/api';
import { ArrowLeft, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';

interface SchoolFormData {
  name: string;
  slug: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
  };
  principal: {
    name: string;
    email: string;
    phone: string;
  };
  logo_file?: File | null;
  banner_file?: File | null;
}

const CreateSchool = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { token } = useAuth();
  
  const [activeTab, setActiveTab] = useState('basic');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  
  // Form state
  const [formData, setFormData] = useState<SchoolFormData>({
    name: '',
    slug: '',
    email: '',
    phone: '',
    website: '',
    address: {
      street: '',
      city: '',
      state: '',
      country: '',
      pincode: ''
    },
    principal: {
      name: '',
      email: '',
      phone: ''
    },
    logo_file: null,
    banner_file: null
  });
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parentKey, childKey] = name.split('.');
      
      // Handle nested objects with proper typing
      if (parentKey === 'address') {
        setFormData({
          ...formData,
          address: {
            ...formData.address,
            [childKey]: value
          }
        });
      } else if (parentKey === 'principal') {
        setFormData({
          ...formData,
          principal: {
            ...formData.principal,
            [childKey]: value
          }
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };
  
  // Handle image uploads
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onload = (event) => {
        if (type === 'logo') {
          setLogoPreview(event.target?.result as string);
          setFormData({
            ...formData,
            logo_file: file
          });
        } else {
          setBannerPreview(event.target?.result as string);
          setFormData({
            ...formData,
            banner_file: file
          });
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  // Generate slug from school name
  const generateSlug = () => {
    if (formData.name) {
      const slug = formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      setFormData({
        ...formData,
        slug
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.slug || !formData.email) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }
    
    // Check if slug is valid (alphanumeric and hyphen only)
    if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      toast({
        title: 'Invalid Slug',
        description: 'Slug can only contain lowercase letters, numbers, and hyphens.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create form data for file uploads
      const submitData = new FormData();
      
      // Add basic school data
      submitData.append('name', formData.name);
      submitData.append('slug', formData.slug);
      submitData.append('email', formData.email);
      submitData.append('phone', formData.phone);
      submitData.append('website', formData.website);
      
      // Add address data
      submitData.append('address[street]', formData.address.street);
      submitData.append('address[city]', formData.address.city);
      submitData.append('address[state]', formData.address.state);
      submitData.append('address[country]', formData.address.country);
      submitData.append('address[pincode]', formData.address.pincode);
      
      // Add principal data
      submitData.append('principal[name]', formData.principal.name);
      submitData.append('principal[email]', formData.principal.email);
      submitData.append('principal[phone]', formData.principal.phone);
      
      // Add files if present
      if (formData.logo_file) {
        submitData.append('logo', formData.logo_file);
      }
      
      if (formData.banner_file) {
        submitData.append('banner', formData.banner_file);
      }
      
      // Send request to API
      const response = await axios.post(`${API_BASE_URL}/api/schools`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      });
      
      toast({
        title: 'Success',
        description: 'School created successfully!',
      });
      
      // Redirect to school management page or school details
      navigate(`/admin/schools/view/${response.data._id}`);
    } catch (error: any) {
      console.error('Error creating school:', error);
      
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to create school. Please try again.',
        variant: 'destructive',
      });
      
      // For development: simulate success
      setTimeout(() => {
        toast({
          title: 'Demo: School Created',
          description: 'This is a simulated success response for development.',
        });
        navigate('/admin/schools');
      }, 1500);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          className="mr-4" 
          onClick={() => navigate('/admin/schools')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Register New School</h1>
          <p className="text-muted-foreground">
            Create a new school tenant in the system
          </p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Basic Information</TabsTrigger>
            <TabsTrigger value="contact">Contact & Address</TabsTrigger>
            <TabsTrigger value="branding">Branding</TabsTrigger>
          </TabsList>
          
          {/* Basic Information Tab */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>School Information</CardTitle>
                <CardDescription>
                  Enter the basic details about the school
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">School Name <span className="text-red-500">*</span></Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Green Valley International School"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="slug">URL Slug <span className="text-red-500">*</span></Label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={generateSlug}
                      disabled={!formData.name}
                    >
                      Generate from Name
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">yourapp.com/</span>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleChange}
                      placeholder="greenvalley"
                      required
                      className="flex-1"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This will be used in the URL and cannot be changed later. Use only lowercase letters, numbers, and hyphens.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="principal.name">Principal/Head Name</Label>
                  <Input
                    id="principal.name"
                    name="principal.name"
                    value={formData.principal.name}
                    onChange={handleChange}
                    placeholder="e.g. Dr. Jane Smith"
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => navigate('/admin/schools')}>
                  Cancel
                </Button>
                <Button type="button" onClick={() => setActiveTab('contact')}>
                  Next: Contact Information
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Contact & Address Tab */}
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>Contact & Address</CardTitle>
                <CardDescription>
                  Enter contact information and address for the school
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. info@greenvalley.edu"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +1 (555) 123-4567"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="e.g. https://www.greenvalley.edu"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address.street">Street Address</Label>
                  <Textarea
                    id="address.street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    placeholder="e.g. 123 Education Lane"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address.city">City</Label>
                    <Input
                      id="address.city"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      placeholder="e.g. Springfield"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address.state">State/Province</Label>
                    <Input
                      id="address.state"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      placeholder="e.g. IL"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address.country">Country</Label>
                    <Input
                      id="address.country"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      placeholder="e.g. United States"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address.pincode">Postal/ZIP Code</Label>
                    <Input
                      id="address.pincode"
                      name="address.pincode"
                      value={formData.address.pincode}
                      onChange={handleChange}
                      placeholder="e.g. 62704"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="principal.email">Principal's Email</Label>
                    <Input
                      id="principal.email"
                      name="principal.email"
                      type="email"
                      value={formData.principal.email}
                      onChange={handleChange}
                      placeholder="e.g. principal@greenvalley.edu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="principal.phone">Principal's Phone</Label>
                    <Input
                      id="principal.phone"
                      name="principal.phone"
                      value={formData.principal.phone}
                      onChange={handleChange}
                      placeholder="e.g. +1 (555) 987-6543"
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" onClick={() => setActiveTab('basic')}>
                  Previous: Basic Information
                </Button>
                <Button type="button" onClick={() => setActiveTab('branding')}>
                  Next: Branding
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Branding Tab */}
          <TabsContent value="branding">
            <Card>
              <CardHeader>
                <CardTitle>School Branding</CardTitle>
                <CardDescription>
                  Upload school logo and banner images
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="logo">School Logo</Label>
                  <div className="flex items-center gap-4">
                    <div className="border rounded-md w-24 h-24 flex items-center justify-center overflow-hidden">
                      {logoPreview ? (
                        <img 
                          src={logoPreview} 
                          alt="Logo Preview" 
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        id="logo"
                        type="file"
                        onChange={(e) => handleImageUpload(e, 'logo')}
                        accept="image/*"
                        className="hidden"
                      />
                      <Label 
                        htmlFor="logo" 
                        className="inline-flex h-9 cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                      >
                        Upload Logo
                      </Label>
                      <p className="text-sm text-muted-foreground mt-2">
                        Recommended size: 200x200px. PNG or SVG with transparent background preferred.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="banner">School Banner</Label>
                  <div className="flex flex-col gap-4">
                    <div className="border rounded-md w-full h-40 flex items-center justify-center overflow-hidden">
                      {bannerPreview ? (
                        <img 
                          src={bannerPreview} 
                          alt="Banner Preview" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                          <p className="text-sm text-muted-foreground mt-2">Banner image will appear here</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <Input
                        id="banner"
                        type="file"
                        onChange={(e) => handleImageUpload(e, 'banner')}
                        accept="image/*"
                        className="hidden"
                      />
                      <Label 
                        htmlFor="banner" 
                        className="inline-flex h-9 cursor-pointer items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                      >
                        Upload Banner
                      </Label>
                      <p className="text-sm text-muted-foreground mt-2">
                        Recommended size: 1200x300px. This banner will be displayed on the school's dashboard.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" onClick={() => setActiveTab('contact')}>
                  Previous: Contact Information
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Create School
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default CreateSchool;
