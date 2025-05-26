import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { useTenant } from "@/contexts/TenantContext";
import { useAuth } from "@/contexts/AuthContext";

const NotFound = () => {
  const location = useLocation();
  const { tenantSlug } = useTenant();
  const { user } = useAuth();
  
  // Determine the best home path
  const homePath =user?.role === 'super_admin' ? '/dashboard' : user?.tenantSlug 
    ? `/${user.tenantSlug}/dashboard` 
    : tenantSlug 
      ? `/${tenantSlug}/dashboard`
      : '/dashboard'; // Default fallback

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <Link to={homePath} className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
