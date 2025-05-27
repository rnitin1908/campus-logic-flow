
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface TenantData {
  id: string;
  name: string;
  slug: string;
  // Add other tenant properties as needed
}

interface TenantContextType {
  tenantSlug: string | null;
  isValidTenant: boolean;
  tenantData: TenantData | null;
  isLoading: boolean;
  setIsValidTenant: (valid: boolean) => void;
  setTenantSlug: (slug: string | null) => void;
  clearTenant: () => void;
}

const TenantContext = createContext<TenantContextType>({
  tenantSlug: null,
  isValidTenant: false,
  tenantData: null,
  isLoading: false,
  setIsValidTenant: () => {},
  setTenantSlug: () => {},
  clearTenant: () => {},
});

export const TenantProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tenantSlug, setTenantSlug] = useState<string | null>(null);
  const [isValidTenant, setIsValidTenant] = useState(false);
  const [tenantData, setTenantData] = useState<TenantData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Extract tenant slug from URL path
    const pathParts = location.pathname.split('/');
    if (pathParts.length > 1 && pathParts[1] && pathParts[1] !== 'auth') {
      const slug = pathParts[1];
      setTenantSlug(slug);
      setIsValidTenant(true);
      
      // Mock tenant data - in real app, this would fetch from API
      setTenantData({
        id: '1',
        name: `${slug.charAt(0).toUpperCase() + slug.slice(1)} School`,
        slug: slug
      });
    } else {
      // Check if we have a stored tenant slug
      const storedSlug = localStorage.getItem('tenantSlug');
      if (storedSlug) {
        setTenantSlug(storedSlug);
        setIsValidTenant(true);
        setTenantData({
          id: '1',
          name: `${storedSlug.charAt(0).toUpperCase() + storedSlug.slice(1)} School`,
          slug: storedSlug
        });
      }
    }
  }, [location.pathname]);

  const clearTenant = () => {
    setTenantSlug(null);
    setIsValidTenant(false);
    setTenantData(null);
    localStorage.removeItem('tenantSlug');
  };

  const value: TenantContextType = {
    tenantSlug,
    isValidTenant,
    tenantData,
    isLoading,
    setIsValidTenant,
    setTenantSlug,
    clearTenant,
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
};

export const useTenant = () => useContext(TenantContext);
