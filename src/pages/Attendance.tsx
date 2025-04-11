
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AttendanceTracker from '@/components/attendance/AttendanceTracker';
import AttendanceAlerts from '@/components/attendance/AttendanceAlerts';
import AttendanceAnalytics from '@/components/attendance/AttendanceAnalytics';
import BiometricVerification from '@/components/attendance/BiometricVerification';

const Attendance = () => {
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
        <p className="text-muted-foreground">
          Track, analyze, and manage student attendance records.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-4 md:inline-flex">
          <TabsTrigger value="daily">Daily Tracking</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="biometric">Biometric</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-4">
          <AttendanceTracker />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <AttendanceAnalytics />
        </TabsContent>

        <TabsContent value="alerts" className="space-y-4">
          <AttendanceAlerts />
        </TabsContent>

        <TabsContent value="biometric" className="space-y-4">
          <BiometricVerification />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Attendance;
