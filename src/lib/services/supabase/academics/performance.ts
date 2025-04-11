
import { supabase } from '@/integrations/supabase/client';
import { checkSupabaseAvailability } from '../utils';
import { AcademicTerm } from './terms';

export interface PerformanceMetric {
  id: string;
  student_id: string;
  term_id: string;
  attendance_percentage?: number;
  behavior_score?: number;
  academic_score?: number;
  overall_performance?: number;
  insights?: string;
  created_at?: string;
  updated_at?: string;
  // Joined data
  term?: AcademicTerm;
}

export const getStudentPerformanceMetrics = async (studentId: string): Promise<PerformanceMetric[]> => {
  try {
    checkSupabaseAvailability();
    
    const { data, error } = await (supabase
      .from('performance_metrics') as any)
      .select(`
        *,
        term:academic_terms(*)
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data as PerformanceMetric[] || [];
  } catch (error) {
    console.error('Get student performance metrics error:', error);
    throw error;
  }
};

export const getStudentPerformanceForTerm = async (
  studentId: string, 
  termId: string
): Promise<PerformanceMetric | null> => {
  try {
    checkSupabaseAvailability();
    
    const { data, error } = await (supabase
      .from('performance_metrics') as any)
      .select(`
        *,
        term:academic_terms(*)
      `)
      .eq('student_id', studentId)
      .eq('term_id', termId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // Ignore "No rows returned" error
    
    return data as PerformanceMetric || null;
  } catch (error) {
    console.error('Get student performance for term error:', error);
    return null;
  }
};

export const generatePerformanceInsights = async (
  studentId: string,
  termId: string
): Promise<string> => {
  try {
    // In a real app, you might call an AI service here
    // For now, we'll just generate some basic insights
    
    // Get student's grades for this term
    const { data: grades } = await (supabase
      .from('grades') as any)
      .select('score')
      .eq('student_id', studentId)
      .eq('term_id', termId);
    
    // Get behavior records
    const { data: behaviorRecords } = await (supabase
      .from('behavior_records') as any)
      .select('severity')
      .eq('student_id', studentId);
    
    // Generate basic insights
    const avgScore = grades?.length ? 
      grades.reduce((sum: number, g: any) => sum + (g.score || 0), 0) / grades.length : 
      0;
    
    const positiveRecords = behaviorRecords?.filter((r: any) => r.severity === 'Positive')?.length || 0;
    const negativeRecords = (behaviorRecords?.length || 0) - positiveRecords;
    
    let insights = '';
    
    if (avgScore > 85) {
      insights += 'Student is performing exceptionally well academically. ';
    } else if (avgScore > 70) {
      insights += 'Student is performing well but has room for improvement. ';
    } else if (avgScore > 50) {
      insights += 'Student needs additional academic support. ';
    } else {
      insights += 'Student requires urgent academic intervention. ';
    }
    
    if (positiveRecords > negativeRecords) {
      insights += 'Behavior patterns show positive engagement in school activities. ';
    } else if (negativeRecords > 3) {
      insights += 'Multiple behavioral incidents suggest need for counseling or additional support. ';
    }
    
    insights += 'Recommended actions: ';
    if (avgScore < 70) {
      insights += 'Schedule additional tutoring sessions. ';
    }
    if (negativeRecords > 2) {
      insights += 'Regular check-ins with guidance counselor. ';
    }
    
    return insights;
  } catch (error) {
    console.error('Generate performance insights error:', error);
    return 'Unable to generate insights due to an error.';
  }
};

export const updateOrCreatePerformanceMetric = async (
  metric: Omit<PerformanceMetric, 'id' | 'created_at' | 'updated_at'>
): Promise<PerformanceMetric> => {
  try {
    checkSupabaseAvailability();
    
    // Check if a metric already exists for this student and term
    const { data: existingMetric } = await (supabase
      .from('performance_metrics') as any)
      .select('id')
      .eq('student_id', metric.student_id)
      .eq('term_id', metric.term_id)
      .single();
    
    if (existingMetric) {
      // Update existing metric
      const { data, error } = await (supabase
        .from('performance_metrics') as any)
        .update(metric)
        .eq('id', existingMetric.id)
        .select()
        .single();
        
      if (error) throw error;
      
      return data as PerformanceMetric;
    } else {
      // Create new metric
      const { data, error } = await (supabase
        .from('performance_metrics') as any)
        .insert(metric)
        .select()
        .single();
        
      if (error) throw error;
      
      return data as PerformanceMetric;
    }
  } catch (error) {
    console.error('Update or create performance metric error:', error);
    throw error;
  }
};
