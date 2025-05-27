
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, Calendar, CheckCircle, Clock, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const academicYearSchema = z.object({
  name: z.string().min(1, 'Academic year name is required'),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().min(1, 'End date is required'),
  is_current: z.boolean().default(false),
  description: z.string().optional()
}).refine((data) => {
  const startDate = new Date(data.start_date);
  const endDate = new Date(data.end_date);
  return endDate > startDate;
}, {
  message: "End date must be after start date",
  path: ["end_date"]
});

type AcademicYearFormData = z.infer<typeof academicYearSchema>;

interface AcademicYearData {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description?: string;
  status: 'active' | 'upcoming' | 'completed';
  created_at: string;
}

export default function AcademicYearSetup() {
  const [isLoading, setIsLoading] = useState(false);
  const [academicYears, setAcademicYears] = useState<AcademicYearData[]>([
    {
      id: '1',
      name: '2024-2025',
      start_date: '2024-04-01',
      end_date: '2025-03-31',
      is_current: true,
      description: 'Current academic year',
      status: 'active',
      created_at: '2024-01-15'
    }
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYearData | null>(null);

  const form = useForm<AcademicYearFormData>({
    resolver: zodResolver(academicYearSchema),
    defaultValues: {
      is_current: false
    }
  });

  const getAcademicYearStatus = (startDate: string, endDate: string): 'active' | 'upcoming' | 'completed' => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) return 'upcoming';
    if (now > end) return 'completed';
    return 'active';
  };

  const onSubmit = async (data: AcademicYearFormData) => {
    setIsLoading(true);
    try {
      console.log('Academic year data:', data);
      
      // If setting as current, update all others to not current
      let updatedAcademicYears = [...academicYears];
      if (data.is_current) {
        updatedAcademicYears = updatedAcademicYears.map(year => ({
          ...year,
          is_current: false
        }));
      }

      const status = getAcademicYearStatus(data.start_date, data.end_date);
      
      if (editingYear) {
        // Update existing academic year
        updatedAcademicYears = updatedAcademicYears.map(year =>
          year.id === editingYear.id
            ? { ...year, ...data, status }
            : year
        );
        setEditingYear(null);
        toast({
          title: "Academic Year Updated",
          description: `Academic year ${data.name} has been updated successfully.`,
        });
      } else {
        // Create new academic year
        const newAcademicYear: AcademicYearData = {
          id: `year_${Date.now()}`,
          ...data,
          status,
          created_at: new Date().toISOString()
        };
        updatedAcademicYears.push(newAcademicYear);
        toast({
          title: "Academic Year Created",
          description: `Academic year ${data.name} has been created successfully.`,
        });
      }
      
      setAcademicYears(updatedAcademicYears);
      setIsDialogOpen(false);
      form.reset();
      
    } catch (error) {
      console.error('Error saving academic year:', error);
      toast({
        title: "Error",
        description: "Failed to save academic year. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (year: AcademicYearData) => {
    setEditingYear(year);
    form.reset({
      name: year.name,
      start_date: year.start_date,
      end_date: year.end_date,
      is_current: year.is_current,
      description: year.description || ''
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (yearId: string) => {
    const yearToDelete = academicYears.find(year => year.id === yearId);
    if (yearToDelete?.is_current) {
      toast({
        title: "Cannot Delete",
        description: "Cannot delete the current academic year.",
        variant: "destructive",
      });
      return;
    }

    setAcademicYears(prev => prev.filter(year => year.id !== yearId));
    toast({
      title: "Academic Year Deleted",
      description: "Academic year has been deleted successfully.",
    });
  };

  const handleSetAsCurrent = (yearId: string) => {
    setAcademicYears(prev => prev.map(year => ({
      ...year,
      is_current: year.id === yearId
    })));
    
    const year = academicYears.find(y => y.id === yearId);
    toast({
      title: "Current Year Updated",
      description: `${year?.name} is now set as the current academic year.`,
    });
  };

  const currentYear = academicYears.find(year => year.is_current);

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Calendar className="h-8 w-8" />
          Academic Year Setup
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage academic years and sessions for your institution.
        </p>
      </div>

      {/* Current Academic Year Overview */}
      {currentYear && (
        <Card className="mb-6 border-green-200 bg-green-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <CheckCircle className="h-5 w-5" />
                  Current Academic Year
                </CardTitle>
                <CardDescription className="text-green-700">
                  Active session for all academic activities
                </CardDescription>
              </div>
              <Badge className="bg-green-600">Active</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-green-800">Academic Year</p>
                <p className="text-lg font-bold text-green-900">{currentYear.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Duration</p>
                <p className="text-green-900">
                  {format(new Date(currentYear.start_date), 'MMM dd, yyyy')} - {format(new Date(currentYear.end_date), 'MMM dd, yyyy')}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">Days Remaining</p>
                <p className="text-green-900">
                  {Math.max(0, Math.ceil((new Date(currentYear.end_date).getTime() - new Date().getTime()) / (1000 * 3600 * 24)))} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Academic Years Management */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Academic Years</CardTitle>
              <CardDescription>
                Manage all academic years and sessions
              </CardDescription>
            </div>
            <Dialog 
              open={isDialogOpen} 
              onOpenChange={(open) => {
                setIsDialogOpen(open);
                if (!open) {
                  setEditingYear(null);
                  form.reset();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Academic Year
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingYear ? 'Edit Academic Year' : 'Create New Academic Year'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingYear 
                      ? 'Update the academic year details'
                      : 'Add a new academic year to your institution'
                    }
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Academic Year Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., 2024-2025" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="start_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Start Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="end_date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="Additional notes about this academic year" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="is_current"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Set as Current Academic Year
                            </FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Mark this as the active academic year for all operations
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          setIsDialogOpen(false);
                          setEditingYear(null);
                          form.reset();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {editingYear ? 'Update' : 'Create'} Academic Year
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {academicYears.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No academic years created yet. Click "Add Academic Year" to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Academic Year</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {academicYears.map((year) => (
                  <TableRow key={year.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{year.name}</p>
                        {year.description && (
                          <p className="text-sm text-muted-foreground">{year.description}</p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>{format(new Date(year.start_date), 'MMM dd, yyyy')}</p>
                        <p className="text-muted-foreground">to {format(new Date(year.end_date), 'MMM dd, yyyy')}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={
                          year.status === 'active' ? 'default' : 
                          year.status === 'upcoming' ? 'secondary' : 
                          'outline'
                        }
                        className={
                          year.status === 'active' ? 'bg-green-100 text-green-800' :
                          year.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }
                      >
                        {year.status === 'active' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {year.status === 'upcoming' && <Clock className="h-3 w-3 mr-1" />}
                        {year.status.charAt(0).toUpperCase() + year.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {year.is_current ? (
                        <Badge className="bg-green-600">Current</Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSetAsCurrent(year.id)}
                          disabled={year.status === 'completed'}
                        >
                          Set as Current
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleEdit(year)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-600"
                          onClick={() => handleDelete(year.id)}
                          disabled={year.is_current}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
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
}
