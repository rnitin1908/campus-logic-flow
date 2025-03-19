
import { useState } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import AddStudentForm from './AddStudentForm';
import mongodbService from '@/services/mongodbService';

interface StudentActionsProps {
  onStudentAdded: () => void;
  students: any[];
}

const StudentActions = ({ onStudentAdded, students }: StudentActionsProps) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      // Convert students data to CSV format
      const headers = ['Name', 'Email', 'Roll Number', 'Department', 'Status'];
      const csvRows = [headers.join(',')];
      
      students.forEach(student => {
        const values = [
          `"${student.name}"`,
          `"${student.email}"`,
          `"${student.rollNumber}"`,
          `"${student.department}"`,
          `"${student.status}"`
        ];
        csvRows.push(values.join(','));
      });
      
      const csvData = csvRows.join('\n');
      
      // Create a blob and download
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `students_export_${new Date().toISOString().slice(0,10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Export Successful",
        description: `${students.length} students exported to CSV`,
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleExport}
        disabled={isExporting || students.length === 0}
      >
        <Download className="mr-2 h-4 w-4" />
        {isExporting ? 'Exporting...' : 'Export'}
      </Button>
      <AddStudentForm onStudentAdded={onStudentAdded} />
    </div>
  );
};

export default StudentActions;
