
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NewAdmissionRequest from '@/components/admissions/NewAdmissionRequest';
import AdmissionStatus from '@/components/admissions/AdmissionStatus';

const ParentPortal = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Parent Admission Portal</h1>
        <p className="text-muted-foreground">
          Request admission for your child and track application status
        </p>
      </div>

      <Tabs defaultValue="new" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="new">New Application</TabsTrigger>
          <TabsTrigger value="status">Application Status</TabsTrigger>
        </TabsList>
        
        <TabsContent value="new" className="mt-6">
          <NewAdmissionRequest />
        </TabsContent>
        
        <TabsContent value="status" className="mt-6">
          <AdmissionStatus />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ParentPortal;
