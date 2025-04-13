
import { useState } from 'react';
import { Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { supabaseService, mongodbService } from '@/lib/services';

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
      
      let results;
      
      // Try Supabase first if configured
      if (isSupabaseConfigured) {
        try {
          console.log("Creating test users via Supabase...");
          results = await supabaseService.createTestUsers();
        } catch (supabaseError) {
          console.error("Error creating Supabase test users:", supabaseError);
          // Fall back to MongoDB if Supabase fails
          if (isMongoDBConfigured) {
            console.log("Falling back to MongoDB for test users...");
            results = await mongodbService.createTestUsers();
          } else {
            throw supabaseError;
          }
        }
      } 
      // If Supabase is not configured, use MongoDB
      else if (isMongoDBConfigured) {
        console.log("Creating test users via MongoDB...");
        results = await mongodbService.createTestUsers();
      } else {
        throw new Error('Neither Supabase nor MongoDB is properly configured');
      }
      
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
        
        // Pre-fill form with test credentials for convenience
        onUsersCreated("superadmin@campuscore.edu", "Password123!");
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
          <div className="bg-muted/50 p-2 font-medium border-b">Test User Status</div>
          <div className="max-h-32 overflow-y-auto">
            {testUsersResult.map((user, index) => (
              <div key={index} className="px-2 py-1 border-b text-xs last:border-b-0 flex justify-between">
                <span>{user.email}</span>
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-medium ${
                  user.status === 'Created' ? 'bg-green-100 text-green-800' : 
                  user.status === 'Exists' ? 'bg-blue-100 text-blue-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {user.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TestUserCreator;
