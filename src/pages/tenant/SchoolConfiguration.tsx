import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Loader2, Upload } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants/api';
import { useAuth } from '@/contexts/AuthContext';
import { Switch } from '@/components/ui/switch';

interface SchoolConfig {
  name: string;
  logo_url: string;
  banner_url: string;
  contact_info: {
    email: string;
    phone: string;
    alternate_phone: string;
    website: string;
  };
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
  settings: {
    academic_year: string;
    current_term: string;
    grading_system: string;
    attendance_type: string;
    working_days: string[];
    school_timing: {
      start_time: string;
      end_time: string;
    };
    sms_notifications: boolean;
    email_notifications: boolean;
  };
  features_enabled: {
    online_admission: boolean;
    online_fee_payment: boolean;
    parent_portal: boolean;
    student_portal: boolean;
    teacher_portal: boolean;
    library_management: boolean;
    transport_management: boolean;
    hostel_management: boolean;
    inventory_management: boolean;
  };
}

const SchoolConfiguration = () => {
  const { schoolCode } = useParams<{ schoolCode: string }>();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  
  const [config, setConfig] = useState<SchoolConfig>({
    name: '',
    logo_url: '',
    banner_url: '',
    contact_info: {
      email: '',
      phone: '',
      alternate_phone: '',
      website: ''
    },
    address: {
      street: '',
      city: '',
      state: '',
      country: 'India',
      pincode: ''
    },
    principal: {
      name: '',
      email: '',
      phone: ''
    },
    settings: {
      academic_year: '',
      current_term: '',
      grading_system: 'percentage',
      attendance_type: 'daily',
      working_days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],
      school_timing: {
        start_time: '08:00',
        end_time: '15:00'
      },
      sms_notifications: false,
      email_notifications: true
    },
    features_enabled: {
      online_admission: true,
      online_fee_payment: true,
      parent_portal: true,
      student_portal: true,
      teacher_portal: true,
      library_management: true,
      transport_management: true,
      hostel_management: false,
      inventory_management: false
    }
  });

  useEffect(() => {
    const fetchSchoolConfig = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/schools/code/${schoolCode}`);
        
        if (response.data.success) {
          setConfig(response.data.data);
        }
      } catch (error) {
        console.error('Error fetching school configuration:', error);
        toast({
          title: 'Error',
          description: 'Failed to load school configuration',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };

    if (schoolCode) {
      fetchSchoolConfig();
    }
  }, [schoolCode, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setConfig(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof SchoolConfig] as any,
          [field]: value
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setConfig(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof SchoolConfig] as any,
          [field]: value
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleToggleChange = (name: string, checked: boolean) => {
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setConfig(prev => ({
        ...prev,
        [section]: {
          ...prev[section as keyof SchoolConfig] as any,
          [field]: checked
        }
      }));
    } else {
      setConfig(prev => ({
        ...prev,
        [name]: checked
      }));
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setLogoFile(e.target.files[0]);
    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setBannerFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      // Handle file uploads first if any
      let updatedConfig = { ...config };
      
      if (logoFile) {
        const formData = new FormData();
        formData.append('file', logoFile);
        
        const uploadResponse = await axios.post(`${API_BASE_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (uploadResponse.data.success) {
          updatedConfig.logo_url = uploadResponse.data.url;
        }
      }
      
      if (bannerFile) {
        const formData = new FormData();
        formData.append('file', bannerFile);
        
        const uploadResponse = await axios.post(`${API_BASE_URL}/upload`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        if (uploadResponse.data.success) {
          updatedConfig.banner_url = uploadResponse.data.url;
        }
      }
      
      // Update school configuration
      const response = await axios.put(`${API_BASE_URL}/schools/code/${schoolCode}`, updatedConfig);
      
      if (response.data.success) {
        toast({
          title: 'Success',
          description: 'School configuration updated successfully',
        });
      }
    } catch (error) {
      console.error('Error saving school configuration:', error);
      toast({
        title: 'Error',
        description: 'Failed to save school configuration',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">School Configuration</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save Changes
        </Button>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="basic">Basic Information</TabsTrigger>
          <TabsTrigger value="contact">Contact & Address</TabsTrigger>
          <TabsTrigger value="academic">Academic Settings</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
              <CardDescription>Basic details about your school</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">School Name</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={config.name}
                  onChange={handleInputChange}
                  disabled={saving}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="logo">School Logo</Label>
                  <div className="flex items-center gap-4">
                    {config.logo_url && (
                      <img 
                        src={config.logo_url} 
                        alt="School logo" 
                        className="w-16 h-16 object-contain border rounded"
                      />
                    )}
                    <div className="flex-1">
                      <Label 
                        htmlFor="logo-upload" 
                        className="cursor-pointer flex items-center gap-2 p-2 border rounded hover:bg-muted"
                      >
                        <Upload className="h-4 w-4" />
                        {logoFile ? logoFile.name : 'Upload Logo'}
                      </Label>
                      <Input 
                        id="logo-upload" 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={handleLogoChange}
                        disabled={saving}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="banner">School Banner</Label>
                  <div className="flex items-center gap-4">
                    {config.banner_url && (
                      <img 
                        src={config.banner_url} 
                        alt="School banner" 
                        className="w-32 h-16 object-cover border rounded"
                      />
                    )}
                    <div className="flex-1">
                      <Label 
                        htmlFor="banner-upload" 
                        className="cursor-pointer flex items-center gap-2 p-2 border rounded hover:bg-muted"
                      >
                        <Upload className="h-4 w-4" />
                        {bannerFile ? bannerFile.name : 'Upload Banner'}
                      </Label>
                      <Input 
                        id="banner-upload" 
                        type="file" 
                        accept="image/*"
                        className="hidden"
                        onChange={handleBannerChange}
                        disabled={saving}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="contact" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>School contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact_info.email">Email</Label>
                  <Input 
                    id="contact_info.email" 
                    name="contact_info.email"
                    value={config.contact_info.email}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact_info.phone">Phone</Label>
                  <Input 
                    id="contact_info.phone" 
                    name="contact_info.phone"
                    value={config.contact_info.phone}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact_info.alternate_phone">Alternate Phone</Label>
                  <Input 
                    id="contact_info.alternate_phone" 
                    name="contact_info.alternate_phone"
                    value={config.contact_info.alternate_phone}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contact_info.website">Website</Label>
                  <Input 
                    id="contact_info.website" 
                    name="contact_info.website"
                    value={config.contact_info.website}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Address</CardTitle>
              <CardDescription>School location details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address.street">Street Address</Label>
                <Textarea 
                  id="address.street" 
                  name="address.street"
                  value={config.address.street}
                  onChange={handleInputChange}
                  disabled={saving}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address.city">City</Label>
                  <Input 
                    id="address.city" 
                    name="address.city"
                    value={config.address.city}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address.state">State</Label>
                  <Input 
                    id="address.state" 
                    name="address.state"
                    value={config.address.state}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address.country">Country</Label>
                  <Input 
                    id="address.country" 
                    name="address.country"
                    value={config.address.country}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address.pincode">Pincode</Label>
                  <Input 
                    id="address.pincode" 
                    name="address.pincode"
                    value={config.address.pincode}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="academic" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Academic Settings</CardTitle>
              <CardDescription>Configure academic year and grading system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="settings.academic_year">Academic Year</Label>
                  <Input 
                    id="settings.academic_year" 
                    name="settings.academic_year"
                    value={config.settings.academic_year}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="settings.current_term">Current Term</Label>
                  <Input 
                    id="settings.current_term" 
                    name="settings.current_term"
                    value={config.settings.current_term}
                    onChange={handleInputChange}
                    disabled={saving}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="settings.grading_system">Grading System</Label>
                  <Select 
                    value={config.settings.grading_system}
                    onValueChange={(value) => handleSelectChange('settings.grading_system', value)}
                    disabled={saving}
                  >
                    <SelectTrigger id="settings.grading_system">
                      <SelectValue placeholder="Select grading system" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Percentage</SelectItem>
                      <SelectItem value="gpa">GPA</SelectItem>
                      <SelectItem value="letter_grade">Letter Grade</SelectItem>
                      <SelectItem value="custom">Custom</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="settings.attendance_type">Attendance Type</Label>
                  <Select 
                    value={config.settings.attendance_type}
                    onValueChange={(value) => handleSelectChange('settings.attendance_type', value)}
                    disabled={saving}
                  >
                    <SelectTrigger id="settings.attendance_type">
                      <SelectValue placeholder="Select attendance type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="subject_wise">Subject-wise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>School Timing</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="settings.school_timing.start_time">Start Time</Label>
                    <Input 
                      id="settings.school_timing.start_time" 
                      name="settings.school_timing.start_time"
                      type="time"
                      value={config.settings.school_timing.start_time}
                      onChange={handleInputChange}
                      disabled={saving}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="settings.school_timing.end_time">End Time</Label>
                    <Input 
                      id="settings.school_timing.end_time" 
                      name="settings.school_timing.end_time"
                      type="time"
                      value={config.settings.school_timing.end_time}
                      onChange={handleInputChange}
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Notification Settings</Label>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="settings.sms_notifications" className="cursor-pointer">SMS Notifications</Label>
                    <Switch 
                      id="settings.sms_notifications"
                      checked={config.settings.sms_notifications}
                      onCheckedChange={(checked) => handleToggleChange('settings.sms_notifications', checked)}
                      disabled={saving}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="settings.email_notifications" className="cursor-pointer">Email Notifications</Label>
                    <Switch 
                      id="settings.email_notifications"
                      checked={config.settings.email_notifications}
                      onCheckedChange={(checked) => handleToggleChange('settings.email_notifications', checked)}
                      disabled={saving}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Enabled Features</CardTitle>
              <CardDescription>Control which features are available in your school</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="features_enabled.online_admission" className="cursor-pointer">Online Admission</Label>
                  <Switch 
                    id="features_enabled.online_admission"
                    checked={config.features_enabled.online_admission}
                    onCheckedChange={(checked) => handleToggleChange('features_enabled.online_admission', checked)}
                    disabled={saving}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="features_enabled.online_fee_payment" className="cursor-pointer">Online Fee Payment</Label>
                  <Switch 
                    id="features_enabled.online_fee_payment"
                    checked={config.features_enabled.online_fee_payment}
                    onCheckedChange={(checked) => handleToggleChange('features_enabled.online_fee_payment', checked)}
                    disabled={saving}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="features_enabled.parent_portal" className="cursor-pointer">Parent Portal</Label>
                  <Switch 
                    id="features_enabled.parent_portal"
                    checked={config.features_enabled.parent_portal}
                    onCheckedChange={(checked) => handleToggleChange('features_enabled.parent_portal', checked)}
                    disabled={saving}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="features_enabled.student_portal" className="cursor-pointer">Student Portal</Label>
                  <Switch 
                    id="features_enabled.student_portal"
                    checked={config.features_enabled.student_portal}
                    onCheckedChange={(checked) => handleToggleChange('features_enabled.student_portal', checked)}
                    disabled={saving}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="features_enabled.teacher_portal" className="cursor-pointer">Teacher Portal</Label>
                  <Switch 
                    id="features_enabled.teacher_portal"
                    checked={config.features_enabled.teacher_portal}
                    onCheckedChange={(checked) => handleToggleChange('features_enabled.teacher_portal', checked)}
                    disabled={saving}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="features_enabled.library_management" className="cursor-pointer">Library Management</Label>
                  <Switch 
                    id="features_enabled.library_management"
                    checked={config.features_enabled.library_management}
                    onCheckedChange={(checked) => handleToggleChange('features_enabled.library_management', checked)}
                    disabled={saving}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="features_enabled.transport_management" className="cursor-pointer">Transport Management</Label>
                  <Switch 
                    id="features_enabled.transport_management"
                    checked={config.features_enabled.transport_management}
                    onCheckedChange={(checked) => handleToggleChange('features_enabled.transport_management', checked)}
                    disabled={saving}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="features_enabled.hostel_management" className="cursor-pointer">Hostel Management</Label>
                  <Switch 
                    id="features_enabled.hostel_management"
                    checked={config.features_enabled.hostel_management}
                    onCheckedChange={(checked) => handleToggleChange('features_enabled.hostel_management', checked)}
                    disabled={saving}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="features_enabled.inventory_management" className="cursor-pointer">Inventory Management</Label>
                  <Switch 
                    id="features_enabled.inventory_management"
                    checked={config.features_enabled.inventory_management}
                    onCheckedChange={(checked) => handleToggleChange('features_enabled.inventory_management', checked)}
                    disabled={saving}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SchoolConfiguration;
