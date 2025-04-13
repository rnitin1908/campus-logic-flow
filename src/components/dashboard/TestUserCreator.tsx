
import { useState } from 'react';
import { createTestUsers } from '@/utils/createTestUsers';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export const TestUserCreator = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateTestUsers = async () => {
    if (isCreating) return;
    
    setIsCreating(true);
    try {
      const users = await createTestUsers();
      toast({
        title: "Test Users Created",
        description: `Successfully created ${users.length} test users.`,
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
    <div className="mt-4">
      <Button onClick={handleCreateTestUsers} disabled={isCreating}>
        {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Create Test Users
      </Button>
    </div>
  );
};
