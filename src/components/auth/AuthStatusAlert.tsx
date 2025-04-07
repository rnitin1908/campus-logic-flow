
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabaseService, mongodbService } from '@/lib/services';

interface AuthStatusAlertProps {
  error: string | null;
}

const AuthStatusAlert = ({ error }: AuthStatusAlertProps) => {
  const isSupabaseConfigured = supabaseService.isSupabaseConfigured();
  const isMongoDBConfigured = mongodbService.isMongoDBConfigured();

  const getAuthStatusMessage = () => {
    if (isSupabaseConfigured && isMongoDBConfigured) {
      return "Both Supabase and MongoDB authentication are configured.";
    } else if (isSupabaseConfigured) {
      return "Supabase authentication is configured.";
    } else if (isMongoDBConfigured) {
      return "MongoDB authentication is configured.";
    } else {
      return "No authentication method is configured. Set up either Supabase or MongoDB.";
    }
  };

  return (
    <>
      {!isSupabaseConfigured && !isMongoDBConfigured && (
        <Alert variant="destructive" className="border-amber-500 bg-amber-50 text-amber-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Neither Supabase nor MongoDB API is configured. Authentication will not work properly.
          </AlertDescription>
        </Alert>
      )}

      <Alert variant="default" className="border-blue-200 bg-blue-50 text-blue-700">
        <AlertDescription>
          {getAuthStatusMessage()}
        </AlertDescription>
      </Alert>
      
      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </>
  );
};

export default AuthStatusAlert;
