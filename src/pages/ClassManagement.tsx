import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { Loader2, Plus, Users, BookOpen, Edit, Trash2, GraduationCap } from 'lucide-react';
import { ClassData, SectionData, SubjectData } from '@/types';

const classSchema = z.object({
  name: z.string().min(1, 'Class name is required'),
  grade_level: z.number().min(1, 'Grade level is required'),
  description: z.string().optional(),
  academic_year: z.string().min(1, 'Academic year is required'),
  capacity: z.number().min(1, 'Capacity is required'),
  status: z.enum(['active', 'inactive']).default('active')
});

const sectionSchema = z.object({
  name: z.string().min(1, 'Section name is required'),
  capacity: z.number().min(1, 'Capacity is required'),
  class_teacher_id: z.string().min(1, 'Class teacher ID is required'),
  room_number: z.string().min(1, 'Room number is required')
});

const subjectSchema = z.object({
  name: z.string().min(1, 'Subject name is required'),
  description: z.string().optional(),
  code: z.string().min(1, 'Subject code is required'),
  department: z.string().min(1, 'Department is required'),
  credit_hours: z.number().min(1, 'Credit hours is required'),
  is_elective: z.boolean().default(false),
  grade_levels: z.string().min(1, 'Grade levels are required')
});

type ClassFormData = z.infer<typeof classSchema>;
type SectionFormData = z.infer<typeof sectionSchema>;
type SubjectFormData = z.infer<typeof subjectSchema>;

export default function ClassManagement() {
  const [isLoading, setIsLoading] = useState(false);
  
  // Initialize with proper required properties
  const [classes, setClasses] = useState<ClassData[]>([
    {
      id: '1',
      name: 'Grade 10',
      grade_level: 10,
      description: 'Tenth grade students',
      academic_year: '2024-2025',
      capacity: 30,
      status: 'active',
      sections: []
    }
  ]);
  
  const [sections, setSections] = useState<SectionData[]>([
    {
      id: '1',
      name: 'Section A',
      capacity: 30,
      class_teacher_id: 'teacher_1',
      room_number: '101'
    }
  ]);
  
  const [subjects, setSubjects] = useState<SubjectData[]>([
    {
      id: '1',
      name: 'Mathematics',
      description: 'Core mathematics curriculum',
      code: 'MATH101',
      department: 'Mathematics',
      credit_hours: 4,
      is_elective: false,
      grade_levels: [9, 10, 11, 12]
    }
  ]);

  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [isSectionDialogOpen, setIsSectionDialogOpen] = useState(false);
  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassData | null>(null);
  const [editingSection, setEditingSection] = useState<SectionData | null>(null);
  const [editingSubject, setEditingSubject] = useState<SubjectData | null>(null);

  const classForm = useForm<ClassFormData>({
    resolver: zodResolver(classSchema),
    defaultValues: {
      status: 'active'
    }
  });

  const sectionForm = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema)
  });

  const subjectForm = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema),
    defaultValues: {
      is_elective: false
    }
  });

  const handleEditClass = (cls: ClassData) => {
    setEditingClass(cls);
    classForm.reset({
      name: cls.name,
      grade_level: cls.grade_level,
      description: cls.description,
      academic_year: cls.academic_year,
      capacity: cls.capacity,
      status: cls.status
    });
    setIsClassDialogOpen(true);
  };

  const handleEditSection = (section: SectionData) => {
    setEditingSection(section);
    sectionForm.reset({
      name: section.name,
      capacity: section.capacity,
      class_teacher_id: section.class_teacher_id,
      room_number: section.room_number
    });
    setIsSectionDialogOpen(true);
  };

  const handleEditSubject = (subject: SubjectData) => {
    setEditingSubject(subject);
    subjectForm.reset({
      name: subject.name,
      description: subject.description,
      code: subject.code,
      department: subject.department,
      credit_hours: subject.credit_hours,
      is_elective: subject.is_elective,
      grade_levels: subject.grade_levels?.join(', ') || ''
    });
    setIsSubjectDialogOpen(true);
  };

  const handleDeleteClass = (classId: string) => {
    setClasses(prev => prev.filter(cls => cls.id !== classId));
    toast({
      title: "Class Deleted",
      description: "Class has been deleted successfully.",
    });
  };

  const handleDeleteSection = (sectionId: string) => {
    setSections(prev => prev.filter(section => section.id !== sectionId));
    toast({
      title: "Section Deleted",
      description: "Section has been deleted successfully.",
    });
  };

  const handleDeleteSubject = (subjectId: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== subjectId));
    toast({
      title: "Subject Deleted",
      description: "Subject has been deleted successfully.",
    });
  };

  const onSubmitClass = async (data: ClassFormData) => {
    setIsLoading(true);
    try {
      console.log('Class data:', data);
      
      if (editingClass) {
        // Update existing class
        setClasses(prev => prev.map(cls =>
          cls.id === editingClass.id
            ? { ...cls, ...data }
            : cls
        ));
        setEditingClass(null);
        toast({
          title: "Class Updated",
          description: `Class ${data.name} has been updated successfully.`,
        });
      } else {
        // Create new class with all required properties
        const newClass: ClassData = {
          id: `class_${Date.now()}`,
          name: data.name,
          grade_level: data.grade_level,
          description: data.description,
          academic_year: data.academic_year,
          capacity: data.capacity,
          status: data.status as 'active' | 'inactive',
          sections: []
        };
        setClasses(prev => [...prev, newClass]);
        toast({
          title: "Class Created",
          description: `Class ${data.name} has been created successfully.`,
        });
      }
      
      setIsClassDialogOpen(false);
      classForm.reset();
      
    } catch (error) {
      console.error('Error saving class:', error);
      toast({
        title: "Error",
        description: "Failed to save class. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitSection = async (data: SectionFormData) => {
    setIsLoading(true);
    try {
      console.log('Section data:', data);
      
      if (editingSection) {
        // Update existing section
        setSections(prev => prev.map(section =>
          section.id === editingSection.id
            ? { ...section, ...data }
            : section
        ));
        setEditingSection(null);
        toast({
          title: "Section Updated",
          description: `Section ${data.name} has been updated successfully.`,
        });
      } else {
        // Create new section with all required properties
        const newSection: SectionData = {
          id: `section_${Date.now()}`,
          name: data.name,
          capacity: data.capacity,
          class_teacher_id: data.class_teacher_id,
          room_number: data.room_number
        };
        setSections(prev => [...prev, newSection]);
        toast({
          title: "Section Created",
          description: `Section ${data.name} has been created successfully.`,
        });
      }
      
      setIsSectionDialogOpen(false);
      sectionForm.reset();
      
    } catch (error) {
      console.error('Error saving section:', error);
      toast({
        title: "Error",
        description: "Failed to save section. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitSubject = async (data: SubjectFormData) => {
    setIsLoading(true);
    try {
      console.log('Subject data:', data);
      
      // Parse grade levels from string to number array
      const gradeLevelsArray = data.grade_levels
        .split(',')
        .map(level => parseInt(level.trim()))
        .filter(level => !isNaN(level));
      
      if (editingSubject) {
        // Update existing subject
        setSubjects(prev => prev.map(subject =>
          subject.id === editingSubject.id
            ? { ...subject, ...data, grade_levels: gradeLevelsArray }
            : subject
        ));
        setEditingSubject(null);
        toast({
          title: "Subject Updated",
          description: `Subject ${data.name} has been updated successfully.`,
        });
      } else {
        // Create new subject with all required properties
        const newSubject: SubjectData = {
          id: `subject_${Date.now()}`,
          name: data.name,
          description: data.description,
          code: data.code,
          department: data.department,
          credit_hours: data.credit_hours,
          is_elective: data.is_elective,
          grade_levels: gradeLevelsArray
        };
        setSubjects(prev => [...prev, newSubject]);
        toast({
          title: "Subject Created",
          description: `Subject ${data.name} has been created successfully.`,
        });
      }
      
      setIsSubjectDialogOpen(false);
      subjectForm.reset();
      
    } catch (error) {
      console.error('Error saving subject:', error);
      toast({
        title: "Error",
        description: "Failed to save subject. Please try again.",
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
          Class Management
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage classes, sections, and subjects for your institution.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Manage Classes, Sections, and Subjects</CardTitle>
          <CardDescription>Add, edit, and manage classes, sections, and subjects within your institution.</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="classes" className="space-y-4">
            <TabsList>
              <TabsTrigger value="classes" className="flex items-center gap-2"><Users className="h-4 w-4" /> Classes</TabsTrigger>
              <TabsTrigger value="sections" className="flex items-center gap-2"><BookOpen className="h-4 w-4" /> Sections</TabsTrigger>
              <TabsTrigger value="subjects" className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Subjects</TabsTrigger>
            </TabsList>
            
            <TabsContent value="classes" className="space-y-4">
              <div className="flex justify-between items-center">
                <CardTitle>Classes</CardTitle>
                <Dialog 
                  open={isClassDialogOpen} 
                  onOpenChange={(open) => {
                    setIsClassDialogOpen(open);
                    if (!open) {
                      setEditingClass(null);
                      classForm.reset();
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Class
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingClass ? 'Edit Class' : 'Create New Class'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingClass 
                          ? 'Update the class details'
                          : 'Add a new class to your institution'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...classForm}>
                      <form onSubmit={classForm.handleSubmit(onSubmitClass)} className="space-y-4">
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
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={classForm.control}
                            name="grade_level"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Grade Level</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="e.g., 10" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={classForm.control}
                            name="capacity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Capacity</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="e.g., 30" {...field} />
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
                                <Input placeholder="e.g., 2024-2025" {...field} />
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
                                <Input placeholder="Additional notes about this class" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={classForm.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Status
                                </FormLabel>
                                <div className="text-sm text-muted-foreground">
                                  Set the status of this class
                                </div>
                              </div>
                              <FormControl>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                  </SelectContent>
                                </Select>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setIsClassDialogOpen(false);
                              setEditingClass(null);
                              classForm.reset();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingClass ? 'Update' : 'Create'} Class
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              {classes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No classes created yet. Click "Add Class" to get started.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class Name</TableHead>
                      <TableHead>Grade Level</TableHead>
                      <TableHead>Academic Year</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {classes.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{cls.name}</p>
                            {cls.description && (
                              <p className="text-sm text-muted-foreground">{cls.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{cls.grade_level}</TableCell>
                        <TableCell>{cls.academic_year}</TableCell>
                        <TableCell>{cls.capacity}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={cls.status === 'active' ? 'default' : 'outline'}
                            className={cls.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                          >
                            {cls.status.charAt(0).toUpperCase() + cls.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditClass(cls)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600"
                              onClick={() => handleDeleteClass(cls.id)}
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
            </TabsContent>

            <TabsContent value="sections" className="space-y-4">
              <div className="flex justify-between items-center">
                <CardTitle>Sections</CardTitle>
                <Dialog 
                  open={isSectionDialogOpen} 
                  onOpenChange={(open) => {
                    setIsSectionDialogOpen(open);
                    if (!open) {
                      setEditingSection(null);
                      sectionForm.reset();
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Section
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingSection ? 'Edit Section' : 'Create New Section'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingSection 
                          ? 'Update the section details'
                          : 'Add a new section to your institution'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...sectionForm}>
                      <form onSubmit={sectionForm.handleSubmit(onSubmitSection)} className="space-y-4">
                        <FormField
                          control={sectionForm.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Section Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Section A" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={sectionForm.control}
                            name="capacity"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Capacity</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="e.g., 30" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={sectionForm.control}
                            name="room_number"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Room Number</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., 101" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <FormField
                          control={sectionForm.control}
                          name="class_teacher_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Class Teacher ID</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., teacher_1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setIsSectionDialogOpen(false);
                              setEditingSection(null);
                              sectionForm.reset();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingSection ? 'Update' : 'Create'} Section
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              {sections.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No sections created yet. Click "Add Section" to get started.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Section Name</TableHead>
                      <TableHead>Capacity</TableHead>
                      <TableHead>Room Number</TableHead>
                      <TableHead>Class Teacher ID</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sections.map((section) => (
                      <TableRow key={section.id}>
                        <TableCell>{section.name}</TableCell>
                        <TableCell>{section.capacity}</TableCell>
                        <TableCell>{section.room_number}</TableCell>
                        <TableCell>{section.class_teacher_id}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditSection(section)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600"
                              onClick={() => handleDeleteSection(section.id)}
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
            </TabsContent>

            {/* Subjects Tab */}
            <TabsContent value="subjects" className="space-y-4">
              <div className="flex justify-between items-center">
                <CardTitle>Subjects</CardTitle>
                <Dialog 
                  open={isSubjectDialogOpen} 
                  onOpenChange={(open) => {
                    setIsSubjectDialogOpen(open);
                    if (!open) {
                      setEditingSubject(null);
                      subjectForm.reset();
                    }
                  }}
                >
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Subject
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        {editingSubject ? 'Edit Subject' : 'Create New Subject'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingSubject 
                          ? 'Update the subject details'
                          : 'Add a new subject to your institution'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    <Form {...subjectForm}>
                      <form onSubmit={subjectForm.handleSubmit(onSubmitSubject)} className="space-y-4">
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
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Additional notes about this subject" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
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
                          <FormField
                            control={subjectForm.control}
                            name="department"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Department</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g., Mathematics" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={subjectForm.control}
                            name="credit_hours"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Credit Hours</FormLabel>
                                <FormControl>
                                  <Input type="number" placeholder="e.g., 4" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={subjectForm.control}
                            name="is_elective"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                  <FormLabel className="text-base">
                                    Is Elective
                                  </FormLabel>
                                  <div className="text-sm text-muted-foreground">
                                    Mark this subject as elective
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
                        </div>
                        
                        <FormField
                          control={subjectForm.control}
                          name="grade_levels"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Grade Levels</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="e.g., 9, 10, 11, 12" 
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <div className="flex justify-end gap-2">
                          <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                              setIsSubjectDialogOpen(false);
                              setEditingSubject(null);
                              subjectForm.reset();
                            }}
                          >
                            Cancel
                          </Button>
                          <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {editingSubject ? 'Update' : 'Create'} Subject
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>

              {subjects.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No subjects created yet. Click "Add Subject" to get started.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Subject Name</TableHead>
                      <TableHead>Subject Code</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Credit Hours</TableHead>
                      <TableHead>Grade Levels</TableHead>
                      <TableHead>Is Elective</TableHead>
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
                        <TableCell>{subject.department}</TableCell>
                        <TableCell>{subject.credit_hours}</TableCell>
                        <TableCell>{subject.grade_levels?.join(', ')}</TableCell>
                        <TableCell>
                          <Badge variant={subject.is_elective ? 'default' : 'outline'}>
                            {subject.is_elective ? 'Elective' : 'Required'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => handleEditSubject(subject)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-red-600"
                              onClick={() => handleDeleteSubject(subject.id)}
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
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
