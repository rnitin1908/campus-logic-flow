import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TENANT_ENDPOINTS } from '@/lib/constants/api';
import { useToast } from '@/components/ui/use-toast';

interface TenantContextType {
  tenantSlug: string | null;
  tenantId: string | null;
  tenantData: any | null;
  isLoading: boolean;
  error: string | null;
  isValidTenant: boolean;
  setTenantSlug: (slug: string) => void;
  clearTenant: () => void;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};

interface TenantProviderProps {
  children: ReactNode;
}

export const TenantProvider = ({ children }: TenantProviderProps) => {
  const { tenantSlug: paramSlug } = useParams<{ tenantSlug: string }>();
  const [tenantSlug, setTenantSlug] = useState<string | null>(() => {
    // Try to get from localStorage on initial load
    return localStorage.getItem('tenantSlug');
  });
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [tenantData, setTenantData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isValidTenant, setIsValidTenant] = useState<boolean>(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Known regular routes that should not be treated as tenant slugs
  const regularRoutes = [
    'dashboard', 'students', 'staff', 'academics', 'attendance', 'auth',
    'unauthorized', 'admin', 'admissions', 'library', 'finance', 'transport',
    'analytics', 'register-school', 'login', 'register', 'reset-password',
    'not-found', 'api', 'setup-admin' // Added more routes that shouldn't be treated as tenant slugs
  ];
  
  // DEVELOPMENT ONLY: List of valid tenant slugs
  // In production, this would come from your database
  const validTenantSlugs = [
    'greenvalley', 'dps', 'stmarys', 'cityhigh', 'testschool'
  ];

  // Clear tenant data
  const clearTenant = () => {
    setTenantSlug(null);
    setTenantId(null);
    setTenantData(null);
    setIsValidTenant(false);
    localStorage.removeItem('tenantSlug');
    localStorage.removeItem('tenantId');
  };

  // Handle route-based tenant extraction
  useEffect(() => {
    console.log('Path evaluation:', { 
      pathname: location.pathname, 
      paramSlug, 
      regularRoutes 
    });

    // Extract the first path segment to check if it's a tenant slug
    const pathParts = location.pathname.split('/');
    const firstPathSegment = pathParts[1];
    
    // Case 1: We're at a direct tenant route like /:tenantSlug/...
    if (paramSlug && !regularRoutes.includes(paramSlug)) {
      console.log(`Valid tenant slug in URL: ${paramSlug}`);
      setTenantSlug(paramSlug);
      localStorage.setItem('tenantSlug', paramSlug);
      return;
    }
    
    // Case 2: We're at a regular route and need to decide if we redirect
    if (regularRoutes.includes(firstPathSegment) || !firstPathSegment) {
      console.log(`Regular route detected: ${firstPathSegment || 'root'}`);
      
      // For routes like /dashboard and /auth/login, check if user is super_admin first
      const userStr = localStorage.getItem('user');
      let user = null;
      try {
        if (userStr) {
          user = JSON.parse(userStr);
        }
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
      
      // If user is super_admin, don't set tenant context on global routes
      if (user && user.role === 'super_admin' && 
          ['/dashboard', '/auth/login', '/'].includes(location.pathname)) {
        console.log('Super admin on global route - not setting tenant context');
        // Clear tenant context for super_admin on global routes
        setTenantSlug(null);
        return;
      }
      
      // For other cases, maintain tenant context if available
      const storedTenantSlug = localStorage.getItem('tenantSlug');
      if (storedTenantSlug) {
        console.log(`Using stored tenant slug: ${storedTenantSlug}`);
        setTenantSlug(storedTenantSlug);
      }
      return;
    }
    
    // Case 3: First path segment isn't a regular route or recognized tenant
    // Just set it as the tenant slug and let the validation happen elsewhere
    console.log(`Potential tenant slug in URL: ${firstPathSegment}`);
    setTenantSlug(firstPathSegment);
  }, [paramSlug, location.pathname]);

  // Fetch and validate tenant data when slug is available
  useEffect(() => {
    const validateTenant = async () => {
      if (!tenantSlug) {
        setIsLoading(false);
        setTenantData(null);
        setTenantId(null);
        setIsValidTenant(false);
        return;
      }

      // TEMPORARY FIX: Only set valid tenant slugs as valid for development
      // In production, you would validate against your database
      if (validTenantSlugs.includes(tenantSlug)) {
        console.log(`Setting tenant as valid (dev mode): ${tenantSlug}`);
        setTenantData({
          id: `tenant-${tenantSlug}`,
          name: tenantSlug.toUpperCase(),
          slug: tenantSlug
        });
        setTenantId(`tenant-${tenantSlug}`);
        setIsValidTenant(true);
        localStorage.setItem('tenantSlug', tenantSlug);
        localStorage.setItem('tenantId', `tenant-${tenantSlug}`);
      } else {
        console.warn(`Invalid tenant slug: ${tenantSlug}`);
        setError('Tenant not found');
        setIsValidTenant(false);
        clearTenant();
        
        // Check if this is a global route that should be allowed despite invalid tenant
        const isGlobalRoute = [
          '/auth/login', '/dashboard', '/not-found', '/unauthorized',
          '/admin', '/register-school', '/auth/register', '/auth/setup-admin'
        ].some(route => location.pathname.startsWith(route));
        
        // If it's a standard route like /dashboard, don't show error or redirect
        if (!isGlobalRoute) {
          // Show an error message
          toast({
            title: "Invalid Tenant",
            description: `The tenant "${tenantSlug}" does not exist or is not available.`,
            variant: "destructive"
          });
          
          // Redirect to 404 page only if we're trying to access a tenant-specific route
          navigate('/not-found', { replace: true });
        }
      }
      setIsLoading(false);
      
      /* COMMENT OUT API VALIDATION FOR NOW - UNCOMMENT WHEN API IS READY
      setIsLoading(true);
      setError(null);

      try {
        console.log(`Validating tenant slug: ${tenantSlug}`);
        const response = await axios.get(TENANT_ENDPOINTS.GET_BY_SLUG(tenantSlug));
        
        if (response.data.success) {
          // Tenant is valid
          console.log(`Tenant validated successfully: ${tenantSlug}`, response.data.data);
          setTenantData(response.data.data);
          setTenantId(response.data.data.id);
          setIsValidTenant(true);
          
          // Persist tenant data
          localStorage.setItem('tenantSlug', tenantSlug);
          localStorage.setItem('tenantId', response.data.data.id);
        } else {
          // Tenant is invalid
          console.warn(`Invalid tenant slug: ${tenantSlug}`);
          setError('Tenant not found');
          setIsValidTenant(false);
          clearTenant();
          
          // Show an error message
          toast({
            title: "Invalid Tenant",
            description: `The tenant "${tenantSlug}" does not exist or is not available.`,
            variant: "destructive"
          });
          
          // Redirect to 404 page
          navigate('/not-found', { replace: true });
        }
      } catch (err) {
        console.error(`Error validating tenant slug: ${tenantSlug}`, err);
        setError('Error validating tenant');
        setIsValidTenant(false);
        setTenantData(null);
        setTenantId(null);
        
        // Show an error message
        toast({
          title: "Tenant Validation Error",
          description: "There was a problem connecting to the tenant service.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
      */
    };

    validateTenant();
  }, [tenantSlug]);

  const value = {
    tenantSlug,
    tenantId,
    tenantData,
    isLoading,
    error,
    isValidTenant,
    setTenantSlug,
    clearTenant
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};
