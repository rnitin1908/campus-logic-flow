
import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { mongodbService } from '@/lib/services';
import { apiClient } from '@/lib/services/api';

// Import the academic services
import { getAcademicTerms } from '@/lib/services/supabase/academics/terms';
import { getStudentGrades } from '@/lib/services/supabase/academics/grades';
import { getStudentBehaviorRecords } from '@/lib/services/supabase/academics/behavior';

// These functions will need to be implemented with MongoDB API calls
const getStudentPerformanceForTerm = async (studentId: string, termId: string) => {
  const response = await apiClient.get(`/performance?studentId=${studentId}&termId=${termId}`);
  return response.data;
};

const generatePerformanceInsights = async (studentId: string, termId: string) => {
  const response = await apiClient.get(`/insights?studentId=${studentId}&termId=${termId}`);
  return response.data;
};

const updateOrCreatePerformanceMetric = async (data: any) => {
  const response = await apiClient.post('/performance', data);
  return response.data;
};

import AcademicTermSelector from '@/components/academics/AcademicTermSelector';
import GradeReport from '@/components/academics/GradeReport';
import BehaviorRecord from '@/components/academics/BehaviorRecord';
import PerformanceMetrics from '@/components/academics/PerformanceMetrics';
import { Loader2 } from 'lucide-react';
import { ChartContainer } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Academics = () => {
  const { toast } = useToast();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState<any[]>([]);
  const [currentTermId, setCurrentTermId] = useState<string>('');
  const [grades, setGrades] = useState<any[]>([]);
  const [behaviorRecords, setBehaviorRecords] = useState<any[]>([]);
  const [performanceMetrics, setPerformanceMetrics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('grades');
  const [generatingInsights, setGeneratingInsights] = useState(false);

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // For demo purposes, we'll create a mock student
        const mockStudent = {
          id: '1',
          name: 'John Doe',
          rollNumber: 'STU001',
          department: 'Computer Science'
        };
        
        setStudent(mockStudent);
        
        // Get academic terms
        const termsData = await getAcademicTerms();
        setTerms(termsData);
        
        // Find current term or use most recent
        const currentTerm = termsData.find(t => t.is_current) || 
                           (termsData.length > 0 ? termsData[0] : null);
        
        if (currentTerm) {
          setCurrentTermId(currentTerm.id);
          await loadStudentData(mockStudent.id, currentTerm.id);
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
        toast({
          title: "Failed to load academic data",
          description: "Please try again later",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchInitialData();
  }, []);

  // Load student data for a specific term
  const loadStudentData = async (studentId: string, termId: string) => {
    setLoading(true);
    try {
      // Get grades
      const gradesData = await getStudentGrades(studentId, termId);
      setGrades(gradesData);
      
      // Get behavior records
      const behaviorData = await getStudentBehaviorRecords(studentId, termId);
      setBehaviorRecords(behaviorData);
      
      // Get performance metrics
      try {
        const metricsData = await getStudentPerformanceForTerm(studentId, termId);
        setPerformanceMetrics(metricsData);
      } catch (error) {
        console.log('Performance metrics not available, will need to generate');
      }
      
    } catch (error) {
      console.error('Error loading student data:', error);
      toast({
        title: "Failed to load student data",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle term change
  const handleTermChange = (termId: string) => {
    setCurrentTermId(termId);
    if (student) {
      loadStudentData(student.id, termId);
    }
  };

  // Generate AI insights
  const handleGenerateInsights = async () => {
    if (!student || !currentTermId) return;
    
    setGeneratingInsights(true);
    try {
      // Generate insights
      const insights = await generatePerformanceInsights(student.id, currentTermId);
      
      // Calculate metrics
      const academic_score = grades.length ? 
        grades.reduce((sum, g) => sum + (g.score || 0), 0) / grades.length : 0;
      
      const positive_behaviors = behaviorRecords.filter(r => r.behavior_type === 'positive').length;
      const total_behaviors = behaviorRecords.length;
      const behavior_score = total_behaviors ? (positive_behaviors / total_behaviors) * 100 : 50;
      
      // Update or create performance metrics
      const updatedMetrics = await updateOrCreatePerformanceMetric({
        student_id: student.id,
        term_id: currentTermId,
        academic_score,
        behavior_score,
        attendance_percentage: 85, // Placeholder - would come from attendance records
        overall_performance: (academic_score + behavior_score) / 2,
        insights
      });
      
      setPerformanceMetrics(updatedMetrics);
      
      toast({
        title: "Insights generated",
        description: "AI-powered academic insights have been updated",
      });
    } catch (error) {
      console.error('Error generating insights:', error);
      toast({
        title: "Failed to generate insights",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setGeneratingInsights(false);
    }
  };

  // Prepare chart data
  const prepareChartData = () => {
    if (!grades.length) return [];
    
    return grades.map(grade => ({
      subject: grade.subject_name || "Unknown",
      score: grade.score || 0
    }));
  };

  if (loading && !student) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Academic Records</h1>
        <p className="text-muted-foreground">
          View and manage academic performance, grades, and behavior records.
        </p>
      </div>

      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          {student && (
            <div className="mb-2">
              <h2 className="text-xl font-medium">{student.name}</h2>
              <p className="text-muted-foreground">
                ID: {student.rollNumber} • {student.department}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          {terms.length > 0 && (
            <AcademicTermSelector 
              terms={terms}
              currentTerm={currentTermId}
              onTermChange={handleTermChange}
            />
          )}
          <Button 
            variant="outline" 
            onClick={handleGenerateInsights}
            disabled={generatingInsights || !currentTermId}
          >
            {generatingInsights && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate AI Insights
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full md:w-[400px]">
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
        </TabsList>

        <TabsContent value="grades" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GradeReport grades={grades} />
            
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Visual representation of academic performance</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                {grades.length > 0 ? (
                  <ChartContainer 
                    config={{
                      grades: { theme: { light: '#3b82f6', dark: '#3b82f6' } }
                    }}
                  >
                    <BarChart data={prepareChartData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="subject" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar 
                        dataKey="score" 
                        name="Score" 
                        fill="var(--color-grades)" 
                      />
                    </BarChart>
                  </ChartContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No grade data available
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance">
          {performanceMetrics ? (
            <PerformanceMetrics metric={performanceMetrics} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Performance Metrics</CardTitle>
                <CardDescription>Student performance analytics</CardDescription>
              </CardHeader>
              <CardContent className="min-h-[250px] flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    No performance data available for this term
                  </p>
                  <Button 
                    variant="outline"
                    className="mt-4"
                    onClick={handleGenerateInsights}
                    disabled={generatingInsights}
                  >
                    {generatingInsights ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      'Generate Performance Analytics'
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="behavior">
          <BehaviorRecord records={behaviorRecords} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Academics;
