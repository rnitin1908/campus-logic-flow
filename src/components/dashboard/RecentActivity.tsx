
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  time: string;
  category: 'student' | 'staff' | 'course' | 'grade' | 'attendance';
}

const activityItems: ActivityItem[] = [
  {
    id: '1',
    title: 'New Student Enrolled',
    description: 'John Doe has enrolled in Computer Science',
    time: '2 hours ago',
    category: 'student'
  },
  {
    id: '2',
    title: 'Grade Updated',
    description: 'CS101 midterm grades have been updated',
    time: '3 hours ago',
    category: 'grade'
  },
  {
    id: '3',
    title: 'Attendance Marked',
    description: 'Attendance for Math 202 has been recorded',
    time: '5 hours ago',
    category: 'attendance'
  },
  {
    id: '4',
    title: 'New Course Added',
    description: 'Advanced Algorithms course has been added',
    time: '1 day ago',
    category: 'course'
  },
  {
    id: '5',
    title: 'Staff Meeting Scheduled',
    description: 'Staff meeting scheduled for Friday',
    time: '1 day ago',
    category: 'staff'
  }
];

const getCategoryIcon = (category: ActivityItem['category']) => {
  switch (category) {
    case 'student':
      return <div className="h-2 w-2 rounded-full bg-blue-500" />;
    case 'staff':
      return <div className="h-2 w-2 rounded-full bg-purple-500" />;
    case 'course':
      return <div className="h-2 w-2 rounded-full bg-green-500" />;
    case 'grade':
      return <div className="h-2 w-2 rounded-full bg-yellow-500" />;
    case 'attendance':
      return <div className="h-2 w-2 rounded-full bg-red-500" />;
    default:
      return <div className="h-2 w-2 rounded-full bg-gray-500" />;
  }
};

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest updates across your campus</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activityItems.map((item, index) => (
            <div key={item.id}>
              <div className="flex items-start gap-4">
                <div className="mt-1 flex h-6 w-6 items-center justify-center">
                  {getCategoryIcon(item.category)}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{item.title}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </div>
              {index < activityItems.length - 1 && <Separator className="my-4" />}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
