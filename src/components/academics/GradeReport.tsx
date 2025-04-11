
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Grade } from '@/lib/services/supabase/academics/grades';

interface GradeReportProps {
  grades: Grade[];
  title?: string;
  description?: string;
}

const GradeReport: React.FC<GradeReportProps> = ({
  grades,
  title = "Grade Report",
  description = "Academic performance across subjects",
}) => {
  // Calculate average grade
  const totalScore = grades.reduce((sum, grade) => sum + (grade.score || 0), 0);
  const averageScore = grades.length ? totalScore / grades.length : 0;
  
  // Helper function to determine grade color
  const getGradeColor = (score?: number) => {
    if (!score) return "bg-gray-200 text-gray-800";
    if (score >= 90) return "bg-green-100 text-green-800";
    if (score >= 80) return "bg-emerald-100 text-emerald-800";
    if (score >= 70) return "bg-blue-100 text-blue-800";
    if (score >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // Helper function to convert numeric score to letter grade
  const scoreToLetter = (score?: number) => {
    if (!score) return "-";
    if (score >= 90) return "A";
    if (score >= 80) return "B";
    if (score >= 70) return "C";
    if (score >= 60) return "D";
    return "F";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {grades.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No grades available for this term
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Subject</TableHead>
                <TableHead>Code</TableHead>
                <TableHead className="text-center">Score</TableHead>
                <TableHead className="text-center">Grade</TableHead>
                <TableHead>Comments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {grades.map((grade) => (
                <TableRow key={grade.id}>
                  <TableCell className="font-medium">
                    {grade.subject?.name || "Unknown Subject"}
                  </TableCell>
                  <TableCell>
                    {grade.subject?.code || "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {grade.score || '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={getGradeColor(grade.score)}>
                      {grade.letter_grade || scoreToLetter(grade.score) || '-'}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-[300px] truncate">
                    {grade.comments || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      {grades.length > 0 && (
        <CardFooter className="flex justify-between">
          <div>
            <span className="text-sm text-muted-foreground">
              {grades.length} subjects
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Average Score:</span>
            <Badge className={getGradeColor(averageScore)}>
              {averageScore.toFixed(1)}
            </Badge>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default GradeReport;
