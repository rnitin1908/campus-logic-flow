
import { useState } from 'react';
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  Plus,
  Search,
  SlidersHorizontal,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Sample data
const staffData = [
  {
    id: '1',
    name: 'Dr. Robert Anderson',
    email: 'r.anderson@example.edu',
    staffId: 'FAC001',
    department: 'Computer Science',
    position: 'Professor',
    joinDate: '2015-09-01',
    status: 'active',
  },
  {
    id: '2',
    name: 'Dr. Maria Garcia',
    email: 'm.garcia@example.edu',
    staffId: 'FAC002',
    department: 'Mathematics',
    position: 'Associate Professor',
    joinDate: '2017-01-15',
    status: 'active',
  },
  {
    id: '3',
    name: 'Prof. David Kim',
    email: 'd.kim@example.edu',
    staffId: 'FAC003',
    department: 'Physics',
    position: 'Assistant Professor',
    joinDate: '2018-08-20',
    status: 'active',
  },
  {
    id: '4',
    name: 'Dr. Sarah Johnson',
    email: 's.johnson@example.edu',
    staffId: 'FAC004',
    department: 'Biology',
    position: 'Professor',
    joinDate: '2012-05-10',
    status: 'active',
  },
  {
    id: '5',
    name: 'Prof. James Wilson',
    email: 'j.wilson@example.edu',
    staffId: 'FAC005',
    department: 'History',
    position: 'Associate Professor',
    joinDate: '2016-09-01',
    status: 'on leave',
  },
];

const Staff = () => {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Staff</h1>
        <p className="text-muted-foreground">
          Manage faculty and administrative staff information and assignments.
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search staff..."
              className="w-full pl-8"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Users className="mr-2 h-4 w-4" />
            Add Staff
          </Button>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">
                <div className="flex items-center gap-1">
                  Name
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>
                <div className="flex items-center gap-1">
                  Join Date
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {staffData.map((staff) => (
              <TableRow key={staff.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={`https://avatar.vercel.sh/${staff.id}`} alt={staff.name} />
                      <AvatarFallback>{staff.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{staff.name}</div>
                      <div className="text-xs text-muted-foreground">{staff.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{staff.staffId}</TableCell>
                <TableCell>{staff.department}</TableCell>
                <TableCell>{staff.position}</TableCell>
                <TableCell>{new Date(staff.joinDate).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={staff.status === 'active' ? 'default' : 'outline'}
                    className={
                      staff.status === 'active'
                        ? 'bg-green-100 text-green-800 hover:bg-green-100'
                        : 'text-amber-800 bg-amber-100 hover:bg-amber-100'
                    }
                  >
                    {staff.status === 'active' ? 'Active' : 'On Leave'}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Edit Details</DropdownMenuItem>
                      <DropdownMenuItem>View Schedule</DropdownMenuItem>
                      <DropdownMenuItem>View Courses</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Remove Staff
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Staff;
