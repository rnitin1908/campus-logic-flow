
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Users, GraduationCap, BookOpen, ClipboardCheck } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { UpcomingEvents } from '@/components/dashboard/UpcomingEvents';

// Sample data
const attendanceData = [
  { name: 'Mon', value: 92 },
  { name: 'Tue', value: 88 },
  { name: 'Wed', value: 94 },
  { name: 'Thu', value: 90 },
  { name: 'Fri', value: 86 },
];

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your campus management system.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value="1,234"
          icon={<Users className="h-5 w-5 text-primary" />}
          trend={{ value: 5.6, direction: 'up' }}
        />
        <StatCard
          title="Total Staff"
          value="98"
          icon={<Users className="h-5 w-5 text-primary" />}
          trend={{ value: 2.1, direction: 'up' }}
        />
        <StatCard
          title="Active Courses"
          value="42"
          icon={<BookOpen className="h-5 w-5 text-primary" />}
        />
        <StatCard
          title="Attendance Rate"
          value="91%"
          icon={<ClipboardCheck className="h-5 w-5 text-primary" />}
          trend={{ value: 1.2, direction: 'down' }}
        />
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <div className="flex flex-col space-y-2">
              <h3 className="text-lg font-medium">Weekly Attendance</h3>
              <p className="text-sm text-muted-foreground">Campus-wide attendance for this week</p>
            </div>
            <div className="mt-4 h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={attendanceData}>
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, 'Attendance']}
                    contentStyle={{ borderRadius: '8px' }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        <div className="row-span-2">
          <UpcomingEvents />
        </div>
        <div className="col-span-2">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
