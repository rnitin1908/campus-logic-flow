
import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { USER_ROLES } from '@/lib/constants/roles';
import { Layout } from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Students from '@/pages/Students';
import Staff from '@/pages/Staff';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import Unauthorized from '@/pages/Unauthorized';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import AdminRoutes from '@/pages/admin/AdminRoutes';
import AdminPortal from '@/pages/Admissions/AdminPortal';
import ParentPortal from '@/pages/Admissions/ParentPortal';
import SetupAdmin from '@/pages/SetupAdmin';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { TenantProvider, useTenant } from '@/contexts/TenantContext';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';

// Add the import for our pages
import Academics from './pages/Academics';
import Attendance from './pages/Attendance';

// Import tenant related pages
import RegisterTenant from './pages/tenant/RegisterTenant';
import SchoolConfiguration from './pages/tenant/SchoolConfiguration';

// Loading Spinner component for consistency
const LoadingSpinner = () => (
  <div className="flex h-screen items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
  </div>
);

// For login and register pages - no layout needed
const AuthTenantRoute = () => {
  const { tenantSlug, isLoading, isValidTenant } = useTenant();
  const navigate = useNavigate();

  // If we're still loading tenant info, show a loading spinner
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If tenant is invalid and we've finished loading, redirect to not found
  if (!isValidTenant && !isLoading && tenantSlug) {
    console.log(`Tenant invalid, redirecting from AuthTenantRoute: ${tenantSlug}`);
    navigate('/not-found', { replace: true });
    return null;
  }

  // For auth routes, we don't need a layout
  return <Outlet />;
};

// TenantRoute component for dashboard and other protected pages
const TenantRoute = () => {
  const { tenantSlug, isLoading, isValidTenant } = useTenant();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If we're at the root tenant path (e.g., /dps), redirect to dashboard
    console.log('User TenantRoute - Tenant info:', { 
      tenantSlug,
      location
    });
    if (!tenantSlug) return;
    
    if (tenantSlug && location.pathname === `/${tenantSlug}`) {
      console.log(`At tenant root path, redirecting to dashboard: ${tenantSlug}`);
      navigate(`/${tenantSlug}/dashboard`, { replace: true });
    }
  }, [tenantSlug, location.pathname, navigate]);
  
  // useEffect(() => {
  //   if (tenantSlug) {
  //     setValidTenant(true); // validate and update isValidTenant
  //   }
  // }, [tenantSlug]);

  // If we're still loading tenant info, show a loading spinner
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // If tenant is invalid and we've finished loading, redirect to not found
  console.log('=====User TenantRoute - Tenant info:', { 
    isValidTenant,
    isLoading,
    tenantSlug,
    isAuthenticated,
    user
  });
  if (!isValidTenant && !isLoading && !tenantSlug) {
    console.log(`Tenant invalid, redirecting from TenantRoute: ${tenantSlug}`);
    navigate('/not-found', { replace: true });
    return null;
  }
  
  // For authenticated users, ensure they're accessing the correct tenant
  if (isAuthenticated && user?.tenantSlug && tenantSlug !== user.tenantSlug) {
    console.log(`User from ${user.tenantSlug} trying to access ${tenantSlug}, redirecting`);
    navigate(`/${user.tenantSlug}/dashboard`, { replace: true });
    return null;
  }

  // If tenant is valid, render Layout with Outlet to enable nested routes
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
};

// Wrapper components for consistent role-based access control
// We'll now separate Layout from content wrappers to fix rendering issues
const DashboardProtected = () => (
  <RoleBasedRoute moduleName="DASHBOARD">
    <Dashboard />
  </RoleBasedRoute>
);

const StudentsProtected = () => (
  <RoleBasedRoute moduleName="STUDENT_MANAGEMENT">
    <Students />
  </RoleBasedRoute>
);

const StaffProtected = () => (
  <RoleBasedRoute moduleName="TEACHER_MANAGEMENT">
    <Staff />
  </RoleBasedRoute>
);

const AcademicsProtected = () => (
  <RoleBasedRoute moduleName="CLASS_SUBJECT">
    <Academics />
  </RoleBasedRoute>
);

const AttendanceProtected = () => (
  <RoleBasedRoute moduleName="ATTENDANCE">
    <Attendance />
  </RoleBasedRoute>
);

const ConfigurationProtected = () => (
  <RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
    <SchoolConfiguration />
  </RoleBasedRoute>
);

const LibraryProtected = () => (
  <RoleBasedRoute moduleName="LIBRARY_MANAGEMENT">
    <div>Library Management (placeholder)</div>
  </RoleBasedRoute>
);

const FinanceProtected = () => (
  <RoleBasedRoute moduleName="FEES_MANAGEMENT">
    <div>Fees Management (placeholder)</div>
  </RoleBasedRoute>
);

const TransportProtected = () => (
  <RoleBasedRoute moduleName="TRANSPORT">
    <div>Transport Management (placeholder)</div>
  </RoleBasedRoute>
);

const AnalyticsProtected = () => (
  <RoleBasedRoute moduleName="ANALYTICS">
    <div>Analytics & Reports (placeholder)</div>
  </RoleBasedRoute>
);

// Combined wrapper components that include Layout
const DashboardWrapper = () => (
  <Layout>
    <DashboardProtected />
  </Layout>
);

const StudentsWrapper = () => (
  <Layout>
    <StudentsProtected />
  </Layout>
);

const StaffWrapper = () => (
  <Layout>
    <StaffProtected />
  </Layout>
);

const AcademicsWrapper = () => (
  <Layout>
    <AcademicsProtected />
  </Layout>
);

const AttendanceWrapper = () => (
  <Layout>
    <AttendanceProtected />
  </Layout>
);

const ConfigurationWrapper = () => (
  <Layout>
    <ConfigurationProtected />
  </Layout>
);

const LibraryWrapper = () => (
  <Layout>
    <LibraryProtected />
  </Layout>
);

const FinanceWrapper = () => (
  <Layout>
    <FinanceProtected />
  </Layout>
);

const TransportWrapper = () => (
  <Layout>
    <TransportProtected />
  </Layout>
);

const AnalyticsWrapper = () => (
  <Layout>
    <AnalyticsProtected />
  </Layout>
);

// Root redirector to route users to appropriate dashboard based on role and tenant
const RootRedirector = () => {
  const navigate = useNavigate();
  const { tenantSlug } = useTenant();
  const { user, isAuthenticated } = useAuth();
  console.log('Root redirector - User info:', { 
    isAuthenticated, 
    user
  });
  
  useEffect(() => {
    // Check if user is super_admin first
    const isSuperAdmin = user?.role === USER_ROLES.SUPER_ADMIN;
    
    console.log('Root redirector - User info:', { 
      isAuthenticated, 
      role: user?.role,
      tenantSlug: user?.tenantSlug || tenantSlug 
    });
    
    // Case 1: Super admin users always go to the main dashboard
    if (isAuthenticated && isSuperAdmin) {
      console.log('Root redirector: Super admin detected, navigating to global dashboard');
      navigate('/dashboard', { replace: true });
      return;
    }
    
    // Case 2: Authenticated user with tenant info
    if (isAuthenticated && user?.tenantSlug) {
      console.log(`Root redirector: Using tenant from user data: ${user.tenantSlug}`);
      navigate(`/${user.tenantSlug}/dashboard`, { replace: true });
      return;
    }
    
    // Case 3: Tenant from context (URL parameter)
    if (tenantSlug) {
      console.log(`Root redirector: Using tenant from context: ${tenantSlug}`);
      
      // If authenticated, go to dashboard, otherwise login
      if (isAuthenticated) {
        navigate(`/${tenantSlug}/dashboard`, { replace: true });
      } else {
        navigate(`/${tenantSlug}/login`, { replace: true });
      }
      return;
    }
    
    // Case 4: Try to get from localStorage
    const storedTenantSlug = localStorage.getItem('tenantSlug');
    if (storedTenantSlug) {
      console.log(`Root redirector: Using stored tenant: ${storedTenantSlug}`);
      
      // If authenticated, go to dashboard, otherwise login
      if (isAuthenticated) {
        navigate(`/${storedTenantSlug}/dashboard`, { replace: true });
      } else {
        navigate(`/${storedTenantSlug}/login`, { replace: true });
      }
      return;
    }
    
    // Case 5: Not authenticated or no tenant context available
    // Default to global login for new users
    console.log('Root redirector: No tenant context found, going to auth/login');
    navigate('/auth/login', { replace: true });
  }, [navigate, tenantSlug, user, isAuthenticated]);
  
  return <LoadingSpinner />;
};

function App() {
  return (
    <BrowserRouter>
      <TenantProvider>
        <AuthProvider>
          <Routes>
            {/* Public routes - No tenant context */}
            <Route path="/" element={<RootRedirector />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="/register-school" element={<RegisterTenant />} />
            
            {/* Direct auth routes (no tenant) */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/setup-admin" element={<SetupAdmin />} />

            {/* Global Admin Routes */}
            <Route path="/admin/*" element={
              <RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <AdminRoutes />
              </RoleBasedRoute>
            } />

            {/* Global Module Routes - if tenant is stored, these will eventually redirect */}
            <Route path="/dashboard" element={<DashboardWrapper />} />
            <Route path="/students" element={<StudentsWrapper />} />
            <Route path="/staff" element={<StaffWrapper />} />
            <Route path="/academics" element={<AcademicsWrapper />} />
            <Route path="/attendance" element={<AttendanceWrapper />} />
            <Route path="/configuration" element={<ConfigurationWrapper />} />
            <Route path="/library" element={<LibraryWrapper />} />
            <Route path="/finance/fees" element={<FinanceWrapper />} />
            <Route path="/transport" element={<TransportWrapper />} />
            <Route path="/analytics" element={<AnalyticsWrapper />} />

            {/* Admissions */}
            <Route path="/admissions/admin" element={
              <RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                <Layout>
                  <AdminPortal />
                </Layout>
              </RoleBasedRoute>
            } />

            <Route path="/admissions/parent" element={
              <RoleBasedRoute allowedRoles={[USER_ROLES.PARENT]}>
                <Layout>
                  <ParentPortal />
                </Layout>
              </RoleBasedRoute>
            } />

            {/* School-specific routes using proper nesting with Outlet */}
            <Route path="/schools/:schoolCode" element={<Layout />}>
              <Route path="dashboard" element={<DashboardProtected />} />
              <Route path="students" element={<StudentsProtected />} />
              <Route path="academics" element={<AcademicsProtected />} />
              <Route path="attendance" element={<AttendanceProtected />} />
              <Route path="configuration" element={<ConfigurationProtected />} />
              <Route path="library" element={<LibraryProtected />} />
              <Route path="finance/fees" element={<FinanceProtected />} />
              <Route path="transport" element={<TransportProtected />} />
              <Route path="analytics" element={<AnalyticsProtected />} />
              {/* Add other school-specific routes */}
            </Route>

            {/* Tenant-based path routing with validation */}
            {/* Auth routes (login/register) without layout */}
            <Route path=":tenantSlug" element={<AuthTenantRoute />}>            
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
            </Route>
            
            {/* Tenant application routes with layout */}
            <Route path=":tenantSlug" element={<TenantRoute />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<DashboardProtected />} />
              <Route path="students" element={<StudentsProtected />} />
              <Route path="staff" element={<StaffProtected />} />
              <Route path="academics" element={<AcademicsProtected />} />
              <Route path="attendance" element={<AttendanceProtected />} />
              <Route path="configuration" element={<ConfigurationProtected />} />
              <Route path="library" element={<LibraryProtected />} />
              <Route path="finance/fees" element={<FinanceProtected />} />
              <Route path="transport" element={<TransportProtected />} />
              <Route path="analytics" element={<AnalyticsProtected />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </TenantProvider>
    </BrowserRouter>
  );
}

export default App;
