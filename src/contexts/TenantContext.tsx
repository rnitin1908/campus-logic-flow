
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useLocation, useParams } from 'react-router-dom';

interface TenantData {
  id: string;
  name: string;
  slug: string;
  settings?: any;
}

interface TenantContextType {
  tenantSlug: string | null;
  tenantData: TenantData | null;
  setTenantData: (data: TenantData | null) => void;
  clearTenant: () => void;
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextType>({
  tenantSlug: null,
  tenantData: null,
  setTenantData: () => {},
  clearTenant: () => {},
  isLoading: false,
});

export const TenantProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const [tenantData, setTenantData] = useState<TenantData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Extract tenant slug from URL path
    const pathSegments = location.pathname.split('/').filter(Boolean);
    
    // Check if first segment is a tenant slug (not a known global route)
    const globalRoutes = ['auth', 'register-tenant', 'setup', 'unauthorized'];
    
    if (pathSegments.length > 0 && !globalRoutes.includes(pathSegments[0])) {
      const possibleTenantSlug = pathSegments[0];
      
      // Update tenant slug if it's different
      if (possibleTenantSlug !== tenantSlug) {
        console.log('Setting tenant slug from URL:', possibleTenantSlug);
        setTenantSlug(possibleTenantSlug);
        
        // Set mock tenant data for now
        setTenantData({
          id: possibleTenantSlug,
          name: possibleTenantSlug.toUpperCase() + ' School',
          slug: possibleTenantSlug,
        });
      }
    } else {
      // Clear tenant if on global route
      if (tenantSlug !== null) {
        console.log('Clearing tenant slug - on global route');
        setTenantSlug(null);
        setTenantData(null);
      }
    }
  }, [location.pathname, tenantSlug]);

  const clearTenant = () => {
    setTenantSlug(null);
    setTenantData(null);
  };

  return (
    <TenantContext.Provider
      value={{
        tenantSlug,
        tenantData,
        setTenantData,
        clearTenant,
        isLoading,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
};
