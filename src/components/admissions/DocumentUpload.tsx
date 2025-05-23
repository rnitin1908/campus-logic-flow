
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { apiClient } from '@/lib/services/api';

// Replace Supabase function with API call
const uploadAdmissionDocument = async (admissionId: string, file: File, type: string) => {
  // Create a FormData object to send the file
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  const response = await apiClient.post(`/admissions/${admissionId}/documents`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};
import { Loader2, Upload, FileText, Check, AlertCircle } from 'lucide-react';

interface DocumentUploadProps {
  admissionId: string;
}

type DocumentType = 'birth_certificate' | 'previous_school_records' | 'id_proof' | 'photo' | 'other';

interface UploadStatus {
  id?: string;
  name: string;
  type: DocumentType;
  status: 'idle' | 'uploading' | 'success' | 'error';
  error?: string;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({ admissionId }) => {
  const { toast } = useToast();
  const [selectedType, setSelectedType] = useState<DocumentType>('birth_certificate');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploads, setUploads] = useState<UploadStatus[]>([]);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };
  
  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }
    
    // Add to uploads list with 'uploading' status
    const newUpload: UploadStatus = {
      name: selectedFile.name,
      type: selectedType,
      status: 'uploading',
    };
    
    setUploads([...uploads, newUpload]);
    
    try {
      const result = await uploadAdmissionDocument(admissionId, selectedFile, selectedType);
      
      // Update status to success
      setUploads(uploads.map(upload => 
        upload.name === selectedFile.name && upload.type === selectedType
          ? { ...upload, id: result.id, status: 'success' }
          : upload
      ));
      
      toast({
        title: "Document uploaded",
        description: "Your document has been successfully uploaded.",
      });
      
      // Reset selection
      setSelectedFile(null);
      const fileInput = document.getElementById('file-upload') as HTMLInputElement;
      if (fileInput) {
        fileInput.value = '';
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      
      // Update status to error
      setUploads(uploads.map(upload => 
        upload.name === selectedFile.name && upload.type === selectedType
          ? { ...upload, status: 'error', error: 'Failed to upload' }
          : upload
      ));
      
      toast({
        title: "Upload failed",
        description: "There was a problem uploading your document. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Document Upload</CardTitle>
        <CardDescription>
          Upload required documents for your admission application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="document-type" className="block text-sm font-medium mb-1">
              Document Type
            </label>
            <Select value={selectedType} onValueChange={(value) => setSelectedType(value as DocumentType)}>
              <SelectTrigger>
                <SelectValue placeholder="Select document type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="birth_certificate">Birth Certificate</SelectItem>
                <SelectItem value="previous_school_records">Previous School Records</SelectItem>
                <SelectItem value="id_proof">ID Proof</SelectItem>
                <SelectItem value="photo">Photograph</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium mb-1">
              Choose File
            </label>
            <Input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
            />
          </div>
        </div>
        
        <Button 
          onClick={handleUpload} 
          disabled={!selectedFile} 
          className="w-full"
        >
          <Upload className="mr-2 h-4 w-4" /> Upload Document
        </Button>
        
        {uploads.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Uploaded Documents</h3>
            <div className="space-y-2">
              {uploads.map((upload, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md border"
                >
                  <div className="flex items-center">
                    <FileText className="mr-2 h-5 w-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{upload.name}</p>
                      <p className="text-xs text-gray-500">
                        {upload.type.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div>
                    {upload.status === 'uploading' && (
                      <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
                    )}
                    {upload.status === 'success' && (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                    {upload.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DocumentUpload;
