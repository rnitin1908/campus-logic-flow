
import React from 'react';
import { format } from 'date-fns';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Award, Brain, Calendar } from "lucide-react";
import { PerformanceMetric } from '@/lib/services/supabase/academics/performance';

interface PerformanceMetricsProps {
  metric: PerformanceMetric;
}

const PerformanceMetrics: React.FC<PerformanceMetricsProps> = ({
  metric,
}) => {
  // Helper to get color based on score
  const getColorForScore = (score?: number) => {
    if (!score) return "text-gray-500";
    if (score >= 80) return "text-green-600";
    if (score >= 65) return "text-emerald-600";
    if (score >= 50) return "text-blue-600";
    if (score >= 35) return "text-yellow-600";
    return "text-red-600";
  };

  // Helper to get progress color
  const getProgressColor = (score?: number) => {
    if (!score) return "";
    if (score >= 80) return "bg-green-600";
    if (score >= 65) return "bg-emerald-600";
    if (score >= 50) return "bg-blue-600";
    if (score >= 35) return "bg-yellow-600";
    return "bg-red-600";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>
          {metric.term ? `Term: ${metric.term.name} (${format(new Date(metric.term.start_date), 'MMM d')} - ${format(new Date(metric.term.end_date), 'MMM d, yyyy')})` : 'Current Term'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium flex items-center gap-1">
                  <Award size={16} /> Academic Score
                </span>
                <span className={`text-sm font-medium ${getColorForScore(metric.academic_score)}`}>
                  {metric.academic_score?.toFixed(1) || 'N/A'}
                </span>
              </div>
              <Progress 
                value={metric.academic_score || 0} 
                max={100} 
                className={`h-2 ${getProgressColor(metric.academic_score)}`} 
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium flex items-center gap-1">
                  <Calendar size={16} /> Attendance
                </span>
                <span className={`text-sm font-medium ${getColorForScore(metric.attendance_percentage)}`}>
                  {metric.attendance_percentage?.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={metric.attendance_percentage || 0}
                max={100}
                className={`h-2 ${getProgressColor(metric.attendance_percentage)}`}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium flex items-center gap-1">
                  <AlertCircle size={16} /> Behavior Score
                </span>
                <span className={`text-sm font-medium ${getColorForScore(metric.behavior_score)}`}>
                  {metric.behavior_score?.toFixed(1) || 'N/A'}
                </span>
              </div>
              <Progress 
                value={metric.behavior_score || 0}
                max={100}
                className={`h-2 ${getProgressColor(metric.behavior_score)}`}
              />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium flex items-center gap-1">
                  <Brain size={16} /> Overall Performance
                </span>
                <span className={`text-sm font-medium ${getColorForScore(metric.overall_performance)}`}>
                  {metric.overall_performance?.toFixed(1) || 'N/A'}
                </span>
              </div>
              <Progress 
                value={metric.overall_performance || 0}
                max={100}
                className={`h-2 ${getProgressColor(metric.overall_performance)}`}
              />
            </div>
          </div>
          
          <div className="border rounded-lg p-3 bg-slate-50 dark:bg-slate-900">
            <h4 className="text-sm font-medium mb-2">AI-Generated Insights</h4>
            <p className="text-sm text-muted-foreground">
              {metric.insights || 'No insights available for this term.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
