
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ClipboardCheck, Users, AlertCircle, Clock } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';

interface AttendanceData {
  date: string;
  presentCount: number;
  absentCount: number;
  lateCount: number;
  totalCount: number;
  presentPercentage: number;
}

const AttendanceAnalytics = () => {
  const [analytics, setAnalytics] = useState<AttendanceData[]>([]);
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'year'>('week');

  useEffect(() => {
    // In a real implementation, we would fetch from database
    // For demo purposes, we'll use localStorage
    const analyticsData = localStorage.getItem('attendance_analytics');
    
    if (analyticsData) {
      const data = JSON.parse(analyticsData);
      setAnalytics(data);
    } else {
      // Generate sample data if no data exists
      generateSampleData();
    }
  }, []);

  // Generate sample data for demonstration
  const generateSampleData = () => {
    const today = new Date();
    const sampleData: AttendanceData[] = [];

    // Generate data for past 30 days
    for (let i = 30; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      const totalCount = 100;
      const presentCount = Math.floor(Math.random() * 30) + 65; // 65-95% present
      const lateCount = Math.floor(Math.random() * 10) + 1; // 1-10% late
      const absentCount = totalCount - presentCount - lateCount;

      sampleData.push({
        date: format(date, 'yyyy-MM-dd'),
        presentCount,
        absentCount,
        lateCount,
        totalCount,
        presentPercentage: (presentCount / totalCount) * 100,
      });
    }

    setAnalytics(sampleData);
    localStorage.setItem('attendance_analytics', JSON.stringify(sampleData));
  };

  // Format date for display
  const format = (date: Date, format: string) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    if (format === 'yyyy-MM-dd') {
      return `${year}-${month}-${day}`;
    }
    
    return `${year}-${month}-${day}`;
  };

  // Filter data based on selected timeframe
  const getFilteredData = () => {
    const today = new Date();
    let daysToFilter = 7; // default to week
    
    if (timeframe === 'month') {
      daysToFilter = 30;
    } else if (timeframe === 'year') {
      daysToFilter = 365;
    }
    
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - daysToFilter);
    
    return analytics.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= today;
    });
  };

  // Calculate summary statistics
  const calculateStats = () => {
    const filteredData = getFilteredData();
    if (filteredData.length === 0) return { avgPresent: 0, avgAbsent: 0, avgLate: 0 };
    
    const totalPresent = filteredData.reduce((sum, item) => sum + item.presentPercentage, 0);
    const totalAbsent = filteredData.reduce((sum, item) => sum + ((item.absentCount / item.totalCount) * 100), 0);
    const totalLate = filteredData.reduce((sum, item) => sum + ((item.lateCount / item.totalCount) * 100), 0);
    
    return {
      avgPresent: totalPresent / filteredData.length,
      avgAbsent: totalAbsent / filteredData.length,
      avgLate: totalLate / filteredData.length
    };
  };

  const stats = calculateStats();
  const filteredData = getFilteredData();

  // Format data for charts
  const chartData = filteredData.map(item => ({
    date: item.date.split('-').slice(1).join('/'), // format as MM/DD
    present: item.presentPercentage.toFixed(1),
    absent: ((item.absentCount / item.totalCount) * 100).toFixed(1),
    late: ((item.lateCount / item.totalCount) * 100).toFixed(1),
  }));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Average Attendance Rate"
          value={`${stats.avgPresent.toFixed(1)}%`}
          icon={<ClipboardCheck className="h-5 w-5 text-primary" />}
          trend={stats.avgPresent > 90 ? { value: stats.avgPresent - 90, direction: 'up' } : { value: 90 - stats.avgPresent, direction: 'down' }}
        />
        <StatCard
          title="Average Absence Rate"
          value={`${stats.avgAbsent.toFixed(1)}%`}
          icon={<AlertCircle className="h-5 w-5 text-primary" />}
          trend={stats.avgAbsent < 5 ? { value: 5 - stats.avgAbsent, direction: 'up' } : { value: stats.avgAbsent - 5, direction: 'down' }}
        />
        <StatCard
          title="Average Late Rate"
          value={`${stats.avgLate.toFixed(1)}%`}
          icon={<Clock className="h-5 w-5 text-primary" />}
          trend={stats.avgLate < 3 ? { value: 3 - stats.avgLate, direction: 'up' } : { value: stats.avgLate - 3, direction: 'down' }}
        />
      </div>

      <Tabs defaultValue="trend">
        <div className="flex items-center justify-between mb-2">
          <TabsList>
            <TabsTrigger value="trend">Attendance Trends</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
          </TabsList>

          <div className="space-x-2">
            <TabsList>
              <TabsTrigger
                value="week"
                onClick={() => setTimeframe('week')}
                data-state={timeframe === 'week' ? 'active' : ''}
              >
                Week
              </TabsTrigger>
              <TabsTrigger
                value="month"
                onClick={() => setTimeframe('month')}
                data-state={timeframe === 'month' ? 'active' : ''}
              >
                Month
              </TabsTrigger>
              <TabsTrigger
                value="year"
                onClick={() => setTimeframe('year')}
                data-state={timeframe === 'year' ? 'active' : ''}
              >
                Year
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="trend">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Rate Trend</CardTitle>
              <CardDescription>
                Daily attendance rates over time
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis
                      dataKey="date"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip formatter={(value) => [`${value}%`]} />
                    <Line
                      type="monotone"
                      dataKey="present"
                      stroke="#4ADE80"
                      strokeWidth={2}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Status Comparison</CardTitle>
              <CardDescription>
                Present, absent, and late attendance percentages
              </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis
                      dataKey="date"
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#888888"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                      formatter={(value) => [`${value}%`]}
                      labelFormatter={(label) => `Date: ${label}`}
                    />
                    <Bar dataKey="present" stackId="a" fill="#4ADE80" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" stackId="a" fill="#F87171" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="late" stackId="a" fill="#FBBF24" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceAnalytics;
