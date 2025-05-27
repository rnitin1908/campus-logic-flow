
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface TenantContextType {
  tenantSlug: string | null;
  isValidTenant: boolean;
  setIsValidTenant: (valid: boolean) => void;
  setTenantSlug: (slug: string | null) => void;
}

const TenantContext = createContext<TenantContextType>({
  tenantSlug: null,
  isValidTenant: false,
  setIsValidTenant: () => {},
  setTenantSlug: () => {},
});

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const [isValidTenant, setIsValidTenant] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Extract tenant slug from URL path
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 1 && pathParts[1] && pathParts[1] !== 'auth') {
      const slug = pathParts[1];
      setTenantSlug(slug);
      setIsValidTenant(true);
    } else {
      // Check if we have a stored tenant slug
      const storedSlug = localStorage.getItem('tenantSlug');
      if (storedSlug) {
        setTenantSlug(storedSlug);
        setIsValidTenant(true);
      }
    }
  }, [location.pathname]);

  const value: TenantContextType = {
    tenantSlug,
    isValidTenant,
    setIsValidTenant,
    setTenantSlug,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
