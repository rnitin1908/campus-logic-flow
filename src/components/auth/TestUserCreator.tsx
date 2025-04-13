
import { useState } from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabaseService, mongodbService } from '@/lib/services';
import { createTestUsers } from '@/utils/createTestUsers';

type TestUserResult = {
  name: string;
  email: string;
  role: string;
  password: string;
  status: string;
  message?: string;
};

interface TestUserCreatorProps {
  onUsersCreated: (email: string, password: string) => void;
}

const TestUserCreator = ({ onUsersCreated }: TestUserCreatorProps) => {
  const [creatingTestUsers, setCreatingTestUsers] = useState(false);
  const [testUsersResult, setTestUsersResult] = useState<TestUserResult[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const isSupabaseConfigured = supabaseService.isSupabaseConfigured();
  const isMongoDBConfigured = mongodbService.isMongoDBConfigured();

  const handleTestUserCreation = async () => {
    setCreatingTestUsers(true);
    setError(null);
    setTestUsersResult([]);
    
    try {
      console.log("Starting test user creation process...");
      
      // Directly use the standalone createTestUsers function which has more robust error handling
      const results = await createTestUsers();
      
      console.log("Test user creation results:", results);
      setTestUsersResult(results);
      
      // Count successful creations and existing users
      const readyToUseCount = results.filter(user => 
        user.status === 'Created' || user.status === 'Exists'
      ).length;
      
      if (readyToUseCount > 0) {
        toast({
          title: "Test users processed",
          description: `${readyToUseCount} out of ${results.length} users are ready to use.`,
        });
        
        // Find any admin user to pre-fill form with
        const adminUser = results.find(user => 
          (user.role.includes('admin') || user.role.includes('super')) && 
          (user.status === 'Created' || user.status === 'Exists')
        );
        
        // If no admin user, use any available user
        const userToUse = adminUser || results.find(user => 
          user.status === 'Created' || user.status === 'Exists'
        );
        
        if (userToUse) {
          // Pre-fill form with test credentials for convenience
          onUsersCreated(userToUse.email, userToUse.password || "Password123!");
        }
      } else {
        toast({
          variant: "destructive",
          title: "Failed to create test users",
          description: "Check the console for more details about the errors.",
        });
      }
    } catch (error: any) {
      console.error('Error creating test users:', error);
      setError(`Failed to create test users: ${error.message}`);
      
      toast({
        variant: "destructive",
        title: "Error creating test users",
        description: error.message || "An unknown error occurred",
      });
    } finally {
      setCreatingTestUsers(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-amber-50 p-4 rounded-md border border-amber-200">
        <h3 className="font-medium text-amber-800 mb-2 flex items-center">
          <Users className="h-4 w-4 mr-2" />
          First Time Setup
        </h3>
        <p className="text-sm text-amber-700 mb-3">
          If this is your first time here, please create test users before logging in.
        </p>
        <Button 
          variant="default" 
          onClick={handleTestUserCreation} 
          disabled={creatingTestUsers}
          className="w-full bg-amber-600 hover:bg-amber-700"
        >
          {creatingTestUsers ? (
            <span className="flex items-center gap-1">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Creating test users...
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4 mr-2" />
              Create Test Users
            </span>
          )}
        </Button>
      </div>
      
      {testUsersResult.length > 0 && (
        <div className="text-xs border rounded-md overflow-hidden">
          <div className="bg-muted/50 p-2 font-medium border-b">Test User Credentials</div>
          <div className="max-h-48 overflow-y-auto">
            <table className="w-full text-xs">
              <thead className="bg-muted/30">
                <tr className="border-b">
                  <th className="p-2 text-left">Role</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Password</th>
                  <th className="p-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {testUsersResult.map((user, index) => (
                  <tr key={index} className={index % 2 === 0 ? 'bg-muted/10' : ''}>
                    <td className="p-1.5 border-b">{user.role}</td>
                    <td className="p-1.5 border-b">{user.email}</td>
                    <td className="p-1.5 border-b">Password123!</td>
                    <td className="p-1.5 border-b">
                      <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
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

export default TestUserCreator;
