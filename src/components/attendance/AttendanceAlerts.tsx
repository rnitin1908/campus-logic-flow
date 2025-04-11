
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { AlertCircle, Bell, BellOff, Send } from 'lucide-react';

interface Alert {
  id: string;
  studentId: string;
  studentName: string;
  rollNumber: string;
  type: 'absence' | 'consecutive' | 'pattern';
  message: string;
  status: 'pending' | 'sent' | 'resolved';
  date: string;
}

const AttendanceAlerts = () => {
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [thresholds, setThresholds] = useState({
    absence: 3, // Number of absences to trigger alert
    consecutive: 2, // Consecutive absences to trigger alert
    patternDetection: true, // Enable pattern detection
  });

  useEffect(() => {
    // In a real app, we'd fetch from backend
    // For demo purposes, we'll use localStorage or generate sample data
    const savedAlerts = localStorage.getItem('attendance_alerts');
    
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    } else {
      // Generate sample alerts
      generateSampleAlerts();
    }
    
    // Load saved thresholds if any
    const savedThresholds = localStorage.getItem('attendance_alert_thresholds');
    if (savedThresholds) {
      setThresholds(JSON.parse(savedThresholds));
    }
  }, []);

  const generateSampleAlerts = () => {
    const sampleAlerts: Alert[] = [
      {
        id: '1',
        studentId: 'sample1',
        studentName: 'John Doe',
        rollNumber: 'CS2021001',
        type: 'absence',
        message: 'Student has been absent 3 times this month',
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
      },
      {
        id: '2',
        studentId: 'sample2',
        studentName: 'Jane Smith',
        rollNumber: 'CS2021002',
        type: 'consecutive',
        message: 'Student has been absent for 3 consecutive days',
        status: 'sent',
        date: new Date().toISOString().split('T')[0],
      },
      {
        id: '3',
        studentId: 'sample3',
        studentName: 'Mike Johnson',
        rollNumber: 'CS2021003',
        type: 'pattern',
        message: 'Student shows pattern of absence on Mondays',
        status: 'pending',
        date: new Date().toISOString().split('T')[0],
      },
    ];
    
    setAlerts(sampleAlerts);
    localStorage.setItem('attendance_alerts', JSON.stringify(sampleAlerts));
  };

  const updateThresholds = (field: keyof typeof thresholds, value: number | boolean) => {
    const updatedThresholds = { ...thresholds, [field]: value };
    setThresholds(updatedThresholds);
    localStorage.setItem('attendance_alert_thresholds', JSON.stringify(updatedThresholds));
    
    toast({
      title: 'Settings updated',
      description: 'Alert thresholds have been updated.',
    });
  };

  const handleSendAlert = (alertId: string) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: 'sent' } : alert
    );
    
    setAlerts(updatedAlerts);
    localStorage.setItem('attendance_alerts', JSON.stringify(updatedAlerts));
    
    toast({
      title: 'Alert sent',
      description: 'Notification has been sent to parents/guardians.',
    });
  };

  const handleResolveAlert = (alertId: string) => {
    const updatedAlerts = alerts.map(alert => 
      alert.id === alertId ? { ...alert, status: 'resolved' } : alert
    );
    
    setAlerts(updatedAlerts);
    localStorage.setItem('attendance_alerts', JSON.stringify(updatedAlerts));
    
    toast({
      title: 'Alert resolved',
      description: 'The alert has been marked as resolved.',
    });
  };

  const getAlertTypeLabel = (type: string) => {
    switch (type) {
      case 'absence':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Frequent Absence</Badge>;
      case 'consecutive':
        return <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">Consecutive Absence</Badge>;
      case 'pattern':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 hover:bg-purple-100">Pattern Detected</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-gray-100 text-gray-800">Pending</Badge>;
      case 'sent':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800">Sent</Badge>;
      case 'resolved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Resolved</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Alert Settings</CardTitle>
          <CardDescription>
            Configure attendance alert thresholds and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="absence-threshold">Absence Threshold</Label>
              <Input
                id="absence-threshold"
                type="number"
                min="1"
                max="10"
                value={thresholds.absence}
                onChange={(e) => updateThresholds('absence', parseInt(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                Alert after this many absences per month
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="consecutive-threshold">Consecutive Absences</Label>
              <Input
                id="consecutive-threshold"
                type="number"
                min="1"
                max="5"
                value={thresholds.consecutive}
                onChange={(e) => updateThresholds('consecutive', parseInt(e.target.value))}
              />
              <p className="text-sm text-muted-foreground">
                Alert after this many consecutive absences
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="pattern-detection">Pattern Detection</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="pattern-detection"
                  checked={thresholds.patternDetection}
                  onCheckedChange={(checked) => updateThresholds('patternDetection', checked)}
                />
                <Label htmlFor="pattern-detection">
                  {thresholds.patternDetection ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Detect absence patterns (e.g., always absent on Mondays)
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Alerts</CardTitle>
          <CardDescription>
            Manage and respond to attendance alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          {alerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Bell className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium">No alerts</h3>
              <p className="text-sm text-muted-foreground">
                No attendance alerts have been generated yet.
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Alert Type</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="font-medium">{alert.studentName}</TableCell>
                      <TableCell>{alert.rollNumber}</TableCell>
                      <TableCell>{getAlertTypeLabel(alert.type)}</TableCell>
                      <TableCell>{alert.message}</TableCell>
                      <TableCell>{getStatusBadge(alert.status)}</TableCell>
                      <TableCell>{alert.date}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {alert.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendAlert(alert.id)}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Send
                            </Button>
                          )}
                          {alert.status !== 'resolved' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleResolveAlert(alert.id)}
                            >
                              Resolve
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <p className="text-sm text-muted-foreground">
            <AlertCircle className="h-4 w-4 inline mr-1" />
            Alerts are automatically generated based on attendance patterns and thresholds.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AttendanceAlerts;
