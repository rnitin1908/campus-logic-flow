
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Access Denied</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        You don't have permission to access this page.
      </p>
      {user && (
        <p className="mt-2">
          You are logged in as <span className="font-medium">{user.name}</span> with role{" "}
          <span className="font-medium">{user.role}</span>.
        </p>
      )}
      <div className="mt-8 flex gap-4">
        <Button onClick={() => navigate("/")}>Go to Dashboard</Button>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default Unauthorized;
