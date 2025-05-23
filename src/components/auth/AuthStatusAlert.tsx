
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { mongodbService } from '@/lib/services';

interface AuthStatusAlertProps {
  error: string | null;
}

const AuthStatusAlert = ({ error }: AuthStatusAlertProps) => {
  const isMongoDBConfigured = mongodbService.isMongoDBConfigured();

  return (
    <>
      {!isMongoDBConfigured ? (
        <Alert variant="destructive" className="border-amber-500 bg-amber-50 text-amber-800">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            MongoDB API is not configured. Authentication will not work properly.
          </AlertDescription>
        </Alert>
      ) : (
        <Alert variant="default" className="border-green-200 bg-green-50 text-green-700">
          <CheckCircle className="h-4 w-4 mr-2" />
          <AlertDescription>
            MongoDB authentication is configured and ready.
          </AlertDescription>
        </Alert>
      )}
      
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
