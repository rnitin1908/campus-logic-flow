
import { useState } from 'react';
import { createTestUsers } from '@/utils/createTestUsers';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const TestUserCreator = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [users, setUsers] = useState<Array<{name: string, email: string, role: string, password: string, status: string}>>([]);
  const { toast } = useToast();

  const handleCreateTestUsers = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    try {
      const createdUsers = await createTestUsers();
      setUsers(createdUsers);
      toast({
        title: "Test Users Created",
        description: `Successfully created ${createdUsers.length} test users.`,
      });
    } catch (error) {
      console.error('Error creating test users:', error);
      toast({
        title: "Error",
        description: "Failed to create test users. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button onClick={handleCreateTestUsers} disabled={isCreating}>
        {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Test Users
      </Button>
      
      {users.length > 0 && (
        <div className="mt-4 border rounded-md overflow-hidden">
          <div className="bg-muted p-3 font-medium border-b">
            Available Test Users
          </div>
          <div className="max-h-72 overflow-y-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-left">
                <tr>
                  <th className="p-2 font-medium">Name</th>
                  <th className="p-2 font-medium">Email</th>
                  <th className="p-2 font-medium">Password</th>
                  <th className="p-2 font-medium">Role</th>
                  <th className="p-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">{user.name}</td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2 font-mono">{user.password}</td>
                    <td className="p-2">{user.role}</td>
                    <td className="p-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'Created' ? 'bg-green-100 text-green-800' : 
                        user.status === 'Exists' ? 'bg-blue-100 text-blue-800' : 
                        'bg-red-100 text-red-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
