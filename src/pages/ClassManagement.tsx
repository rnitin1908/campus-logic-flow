
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, Users, BookOpen, GraduationCap, Edit, Trash2 } from 'lucide-react';

const classSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  grade_level: z.number().min(1).max(12),
  description: z.string().optional(),
  academic_year: z.string().min(1, 'Academic year is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1').default(30),
  status: z.enum(['active', 'inactive']).default('active')
});

const sectionSchema = z.object({
  name: z.string().min(1, 'Section name is required'),
  capacity: z.number().min(1, 'Capacity must be at least 1').default(30),
  class_teacher_id: z.string().optional(),
  room_number: z.string().optional()
});

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  code: z.string().min(1, 'Subject code is required'),
  description: z.string().optional(),
  department: z.string().optional(),
  credit_hours: z.number().min(1).max(10).default(1),
  is_elective: z.boolean().default(false),
  grade_levels: z.array(z.number()).min(1, 'Select at least one grade level')
});

type ClassFormData = z.infer<typeof classSchema>;
type SectionFormData = z.infer<typeof sectionSchema>;
type SubjectFormData = z.infer<typeof subjectSchema>;

interface ClassData {
  id: string;
  name: string;
  grade_level: number;
  description?: string;
  academic_year: string;
  capacity: number;
  status: 'active' | 'inactive';
  sections: SectionData[];
}

interface SectionData {
  id: string;
  name: string;
  capacity: number;
  class_teacher?: string;
  room_number?: string;
}

interface SubjectData {
  id: string;
  name: string;
  code: string;
  description?: string;
  department?: string;
  credit_hours: number;
  is_elective: boolean;
  grade_levels: number[];
}

export default function ClassManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('classes');
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [subjects, setSubjects] = useState<SubjectData[]>([]);
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);

  const classForm = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      capacity: 30,
      status: 'active',
      academic_year: '2024-25'
    }
  });

  const sectionForm = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      capacity: 30
    }
  });

  const subjectForm = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      credit_hours: 1,
      is_elective: false,
      grade_levels: []
    }
  });

  const onClassSubmit = async (data: ClassFormData) => {
    setIsLoading(true);
    try {
      console.log('Creating class:', data);
      
      const newClass: ClassData = {
        id: `class_${Date.now()}`,
        ...data,
        sections: []
      };
      
      setClasses(prev => [...prev, newClass]);
      setIsClassDialogOpen(false);
      classForm.reset();
      
      toast({
        title: "Class Created",
        description: `Class ${data.name} has been created successfully.`,
      });
    } catch (error) {
      console.error('Error creating class:', error);
      toast({
        title: "Error",
        description: "Failed to create class. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSectionSubmit = async (data: SectionFormData) => {
    if (!selectedClass) return;
    
    setIsLoading(true);
    try {
      console.log('Creating section:', data);
      
      const newSection: SectionData = {
        id: `section_${Date.now()}`,
        ...data
      };
      
      setClasses(prev => prev.map(cls => 
        cls.id === selectedClass.id 
          ? { ...cls, sections: [...cls.sections, newSection] }
          : cls
      ));
      
      setIsSectionDialogOpen(false);
      sectionForm.reset();
      
      toast({
        title: "Section Created",
        description: `Section ${data.name} has been added to ${selectedClass.name}.`,
      });
    } catch (error) {
      console.error('Error creating section:', error);
      toast({
        title: "Error",
        description: "Failed to create section. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubjectSubmit = async (data: SubjectFormData) => {
    setIsLoading(true);
    try {
      console.log('Creating subject:', data);
      
      const newSubject: SubjectData = {
        id: `subject_${Date.now()}`,
        ...data
      };
      
      setSubjects(prev => [...prev, newSubject]);
      setIsSubjectDialogOpen(false);
      subjectForm.reset();
      
      toast({
        title: "Subject Created",
        description: `Subject ${data.name} has been created successfully.`,
      });
    } catch (error) {
      console.error('Error creating subject:', error);
      toast({
        title: "Error",
        description: "Failed to create subject. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <GraduationCap className="h-8 w-8" />
          Class, Section & Subject Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Set up your academic structure with classes, sections, and subjects.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="classes" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Classes & Sections
          </TabsTrigger>
          <TabsTrigger value="subjects" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Subjects
          </TabsTrigger>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Overview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="classes" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Classes</CardTitle>
                  <CardDescription>
                    Manage your academic classes and their sections
                  </CardDescription>
                </div>
                <Dialog open={isClassDialogOpen} onOpenChange={setIsClassDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Class
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Class</DialogTitle>
                      <DialogDescription>
                        Add a new class to your academic structure
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...classForm}>
                      <form onSubmit={classForm.handleSubmit(onClassSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={classForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Class Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Grade 10" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={classForm.control}
                            name="grade_level"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Grade Level</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="1" 
                                    max="12" 
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={classForm.control}
                          name="academic_year"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Academic Year</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 2024-25" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={classForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description (Optional)</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Class description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={classForm.control}
                            name="capacity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Default Capacity</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="1" 
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={classForm.control}
                            name="status"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsClassDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Class
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {classes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No classes created yet. Click "Add Class" to get started.
                </div>
              ) : (
                <div className="space-y-4">
                  {classes.map((classItem) => (
                    <Card key={classItem.id} className="border">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-lg">{classItem.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Grade {classItem.grade_level} • {classItem.academic_year}
                            </p>
                            {classItem.description && (
                              <p className="text-sm mt-1">{classItem.description}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={classItem.status === 'active' ? 'default' : 'secondary'}>
                              {classItem.status}
                            </Badge>
                            <Dialog open={isSectionDialogOpen} onOpenChange={setIsSectionDialogOpen}>
                              <DialogTrigger asChild>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => setSelectedClass(classItem)}
                                >
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add Section
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Add Section to {selectedClass?.name}</DialogTitle>
                                  <DialogDescription>
                                    Create a new section within this class
                                  </DialogDescription>
                                </DialogHeader>
                                <Form {...sectionForm}>
                                  <form onSubmit={sectionForm.handleSubmit(onSectionSubmit)} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <FormField
                                        control={sectionForm.control}
                                        name="name"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Section Name</FormLabel>
                                            <FormControl>
                                              <Input placeholder="e.g., A, B, C" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        control={sectionForm.control}
                                        name="capacity"
                                        render={({ field }) => (
                                          <FormItem>
                                            <FormLabel>Capacity</FormLabel>
                                            <FormControl>
                                              <Input 
                                                type="number" 
                                                min="1" 
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                              />
                                            </FormControl>
                                            <FormMessage />
                                          </FormItem>
                                        )}
                                      />
                                    </div>
                                    
                                    <FormField
                                      control={sectionForm.control}
                                      name="room_number"
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormLabel>Room Number (Optional)</FormLabel>
                                          <FormControl>
                                            <Input placeholder="e.g., Room 101" {...field} />
                                          </FormControl>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                    
                                    <div className="flex justify-end gap-2">
                                      <Button type="button" variant="outline" onClick={() => setIsSectionDialogOpen(false)}>
                                        Cancel
                                      </Button>
                                      <Button type="submit" disabled={isLoading}>
                                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Add Section
                                      </Button>
                                    </div>
                                  </form>
                                </Form>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardHeader>
                      {classItem.sections.length > 0 && (
                        <CardContent className="pt-0">
                          <h4 className="font-medium mb-2">Sections</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                            {classItem.sections.map((section) => (
                              <div key={section.id} className="p-3 border rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <p className="font-medium">Section {section.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                      Capacity: {section.capacity}
                                    </p>
                                    {section.room_number && (
                                      <p className="text-sm text-muted-foreground">
                                        {section.room_number}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Subjects</CardTitle>
                  <CardDescription>
                    Manage subjects that will be taught across different classes
                  </CardDescription>
                </div>
                <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Subject
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Create New Subject</DialogTitle>
                      <DialogDescription>
                        Add a new subject to your curriculum
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...subjectForm}>
                      <form onSubmit={subjectForm.handleSubmit(onSubjectSubmit)} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={subjectForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Subject Name</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Mathematics" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={subjectForm.control}
                            name="code"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Subject Code</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., MATH101" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={subjectForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description (Optional)</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Subject description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={subjectForm.control}
                            name="department"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Department</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Science" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={subjectForm.control}
                            name="credit_hours"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Credit Hours</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="1" 
                                    max="10" 
                                    {...field}
                                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" onClick={() => setIsSubjectDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Subject
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {subjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No subjects created yet. Click "Add Subject" to get started.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject</TableHead>
                      <TableHead>Code</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Credit Hours</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {subjects.map((subject) => (
                      <TableRow key={subject.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{subject.name}</p>
                            {subject.description && (
                              <p className="text-sm text-muted-foreground">{subject.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{subject.code}</TableCell>
                        <TableCell>{subject.department || '-'}</TableCell>
                        <TableCell>{subject.credit_hours}</TableCell>
                        <TableCell>
                          <Badge variant={subject.is_elective ? 'secondary' : 'default'}>
                            {subject.is_elective ? 'Elective' : 'Core'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600">
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
        </TabsContent>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Classes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{classes.length}</div>
                <p className="text-sm text-muted-foreground">
                  Total classes created
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Sections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {classes.reduce((total, cls) => total + cls.sections.length, 0)}
                </div>
                <p className="text-sm text-muted-foreground">
                  Total sections created
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Subjects
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{subjects.length}</div>
                <p className="text-sm text-muted-foreground">
                  Total subjects created
                </p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
