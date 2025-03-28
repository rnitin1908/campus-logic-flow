
import { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, FileSpreadsheet, UploadCloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import mongodbService from '@/services/mongodbService';
import { StudentFormData } from '@/types/student';

interface ImportStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: () => void;
}

const ImportStudentsModal = ({ isOpen, onClose, onImportSuccess }: ImportStudentsModalProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    
    // Check if file is CSV
    if (selectedFile.type !== 'text/csv' && !selectedFile.name.endsWith('.csv')) {
      setError('Please upload a CSV file');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    setError(null);
    parseCSVPreview(selectedFile);
  };

  const parseCSVPreview = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;

      try {
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(header => 
          header.replace(/^"/, '').replace(/"$/, '')
        );
        
        // Parse only first 5 records for preview
        const previewRows = [];
        for (let i = 1; i < Math.min(6, lines.length); i++) {
          if (!lines[i].trim()) continue;
          
          const values = lines[i].split(',').map(value => 
            value.replace(/^"/, '').replace(/"$/, '')
          );
          
          const row: Record<string, string> = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          
          previewRows.push(row);
        }
        
        setPreviewData(previewRows);
      } catch (err) {
        console.error('Error parsing CSV:', err);
        setError('Error parsing CSV file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!file) return;
    
    try {
      setIsUploading(true);
      setUploadProgress(10);
      
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result as string;
        if (!text) return;
        
        const lines = text.split('\n');
        const headers = lines[0].split(',').map(header => 
          header.replace(/^"/, '').replace(/"$/, '')
        );
        
        // Map CSV headers to student object properties
        const headerMap: Record<string, string> = {
          'Name': 'name',
          'Email': 'email',
          'Roll Number': 'rollNumber',
          'Department': 'department',
          'Status': 'status',
          'Contact Number': 'contactNumber',
          'Address': 'address',
          'Gender': 'gender',
          'Date of Birth': 'dateOfBirth'
        };
        
        const students: StudentFormData[] = [];
        
        // Skip header row
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          
          setUploadProgress(10 + Math.floor((i / lines.length) * 50));
          
          const values = lines[i].split(',').map(value => 
            value.replace(/^"/, '').replace(/"$/, '')
          );
          
          const student: any = { status: 'active' }; // Default status
          
          headers.forEach((header, index) => {
            const key = headerMap[header];
            if (key && values[index]) {
              student[key] = values[index];
            }
          });
          
          // Validate required fields
          if (student.name && student.email && student.rollNumber && student.department) {
            students.push(student);
          }
        }
        
        if (students.length === 0) {
          throw new Error('No valid student records found in the CSV file');
        }
        
        // Simulate batch import
        setUploadProgress(60);
        
        // For now just import one by one since we don't have a batch import endpoint
        for (let i = 0; i < students.length; i++) {
          await mongodbService.createStudent(students[i]);
          setUploadProgress(60 + Math.floor((i / students.length) * 40));
        }
        
        setUploadProgress(100);
        
        toast({
          title: "Import Successful",
          description: `${students.length} students were imported successfully`,
        });
        
        setTimeout(() => {
          onImportSuccess();
          onClose();
          setFile(null);
          setPreviewData([]);
          setUploadProgress(0);
          setIsUploading(false);
        }, 1000);
      };
      
      reader.readAsText(file);
      
    } catch (err: any) {
      console.error('Import error:', err);
      setError(err.message || 'Failed to import students');
      setIsUploading(false);
      toast({
        title: "Import Failed",
        description: err.message || "There was an error importing the data",
        variant: "destructive",
      });
    }
  };

  const handleClose = () => {
    if (!isUploading) {
      onClose();
      setFile(null);
      setPreviewData([]);
      setError(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Students</DialogTitle>
          <DialogDescription>
            Upload a CSV file to bulk import students. Download a template to get started.
          </DialogDescription>
        </DialogHeader>
        
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {!file ? (
          <div className="grid w-full h-32 place-items-center rounded-md border border-dashed p-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <FileSpreadsheet className="h-8 w-8 text-muted-foreground" />
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">Drag and drop your CSV file here</p>
                <p className="text-xs text-muted-foreground">Or click to browse files</p>
              </div>
              <input
                type="file"
                accept=".csv"
                className="absolute inset-0 cursor-pointer opacity-0"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </div>
          </div>
        ) : isUploading ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">{file.name}</span>
              <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-2" />
            <p className="text-sm text-muted-foreground">
              Importing students... Please do not close this window.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5" />
                <span className="text-sm font-medium">{file.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setFile(null)}>
                Change
              </Button>
            </div>
            
            {previewData.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Preview ({previewData.length} records)</h4>
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted">
                          {Object.keys(previewData[0]).map((header) => (
                            <th key={header} className="px-3 py-2 text-left font-medium">{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {previewData.map((row, i) => (
                          <tr key={i} className="border-t">
                            {Object.values(row).map((value, j) => (
                              <td key={j} className="px-3 py-2">{value || '-'}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Showing first {previewData.length} records. Total records in file may be more.
                </p>
              </div>
            )}
          </div>
        )}
        
        <DialogFooter className="flex items-center justify-between sm:justify-between">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isUploading}
          >
            Cancel
          </Button>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline"
              disabled={isUploading}
              onClick={() => {
                // Create and download template CSV
                const headers = ['Name,Email,Roll Number,Department,Status,Contact Number,Address,Gender,Date of Birth'];
                const example = ['"John Doe","john@example.com","R2023001","Computer Science","active","1234567890","123 Main St","male","2000-01-01"'];
                const template = [...headers, ...example].join('\n');
                const blob = new Blob([template], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'student_import_template.csv');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Download Template
            </Button>
            <Button 
              onClick={handleImport}
              disabled={!file || isUploading}
            >
              {isUploading ? (
                <>Importing...</>
              ) : (
                <>
                  <UploadCloud className="mr-2 h-4 w-4" /> Import Students
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImportStudentsModal;
