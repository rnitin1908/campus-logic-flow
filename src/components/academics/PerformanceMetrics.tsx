
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
import { PerformanceMetric } from '@/lib/services/mongodb/academics/performance';

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
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Academic Score</span>
                <span className={`text-sm font-medium ${getColorForScore(metric.test_scores)}`}>
                  {metric.test_scores || 'N/A'}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 mb-4">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(metric.test_scores)}`}
                  style={{ width: `${metric.test_scores || 0}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Attendance</span>
                <span className={`text-sm font-medium ${getColorForScore(metric.attendance_rate)}`}>
                  {metric.attendance_rate || 'N/A'}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 mb-4">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(metric.attendance_rate)}`}
                  style={{ width: `${metric.attendance_rate || 0}%` }}
                />
              </div>
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
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Performance</span>
                <span className={`text-sm font-medium ${getColorForScore(metric.overall_grade)}`}>
                  {metric.overall_grade || 'N/A'}
                </span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 mb-4">
                <div 
                  className={`h-2 rounded-full ${getProgressColor(metric.overall_grade)}`}
                  style={{ width: `${metric.overall_grade || 0}%` }}
                />
              </div>
            </div>
          </div>
          
          <div className="border rounded-lg p-3 bg-slate-50 dark:bg-slate-900">
            <h4 className="text-sm font-medium mb-2">Performance Notes</h4>
            <p className="text-sm text-muted-foreground">
              {metric.notes || 'No notes available for this term.'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceMetrics;
