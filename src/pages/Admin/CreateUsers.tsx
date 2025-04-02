
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { createTestUsers } from '@/utils/createTestUsers';
import { USER_ROLES } from '@/lib/services';
import { useAuth } from '@/contexts/AuthContext';
import { Shield } from 'lucide-react';
import { Navigate } from 'react-router-dom';

// Define a type for the test user results
interface TestUser {
  name: string;
  email: string;
  role: string;
  password: string;
  status: string;
  message?: string;
}

const CreateUsers = () => {
  const [users, setUsers] = useState<TestUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // Only allow super admins to access this page
  if (!user || user.role !== USER_ROLES.SUPER_ADMIN) {
    return <Navigate to="/unauthorized" />;
  }

  const handleCreateUsers = async () => {
    try {
      setIsLoading(true);
      const createdUsers = await createTestUsers();
      setUsers(createdUsers);
      toast({
        title: "Users Created",
        description: `Successfully processed ${createdUsers.length} test users.`,
      });
    } catch (error) {
      console.error('Error creating test users:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to create users: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="bg-primary/5">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>Create Test Users</CardTitle>
              <CardDescription>
                Create test users with different roles for testing purposes
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="mb-4 text-muted-foreground">
            This utility will create test users with different roles in the system.
            Each user will have the password <code className="bg-muted px-1 py-0.5 rounded">Password123!</code>
          </p>
          
          {users.length > 0 && (
            <div className="mt-4 border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Password</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user, index) => (
                    <TableRow key={index}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell className="font-mono text-sm">{user.email}</TableCell>
                      <TableCell className="capitalize">{user.role.replace('_', ' ')}</TableCell>
                      <TableCell className="font-mono text-sm">{user.password}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.status === 'Created' ? 'bg-green-100 text-green-800' : 
                          user.status === 'Exists' ? 'bg-blue-100 text-blue-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {user.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t p-4 bg-muted/5">
          <div className="text-sm text-muted-foreground">
            This action will create 9 test users with different roles
          </div>
          <Button onClick={handleCreateUsers} disabled={isLoading}>
            {isLoading ? (
              <>
                <span className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                Creating Users...
              </>
            ) : (
              'Create Test Users'
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateUsers;
