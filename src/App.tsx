
import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { AuthProvider } from '@/contexts/AuthContext';
import { TenantProvider } from '@/contexts/TenantContext';
import { Layout } from '@/components/layout/Layout';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Students from '@/pages/Students';
import Staff from '@/pages/Staff';
import Academics from '@/pages/Academics';
import Attendance from '@/pages/Attendance';
import Login from '@/pages/Auth/Login';
import Register from '@/pages/Auth/Register';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';
import SetupAdmin from '@/pages/SetupAdmin';
import AdminRoutes from '@/pages/admin/AdminRoutes';
import ParentPortal from '@/pages/Admissions/ParentPortal';
import AdminPortal from '@/pages/Admissions/AdminPortal';
import RegisterTenant from '@/pages/tenant/RegisterTenant';
import SchoolConfiguration from '@/pages/tenant/SchoolConfiguration';
import ClassManagement from '@/pages/ClassManagement';
import SchoolConfiguration2 from '@/pages/SchoolConfiguration';
import AcademicYearSetup from '@/pages/AcademicYearSetup';
import CreateUsers from '@/pages/Admin/CreateUsers';
import { useAuth } from '@/contexts/AuthContext';
import { useTenant } from '@/contexts/TenantContext';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';
import UserManagement from '@/pages/UserManagement';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Component to handle tenant-specific routes
function TenantRoutes() {
  const { user } = useAuth();
  const { tenantSlug } = useTenant();

  return (
    <Routes>
      {/* Index route */}
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
      
      {/* User Management Routes */}
      <Route 
        path="/users" 
        element={
          <RoleBasedRoute allowedRoles={['super_admin', 'school_admin']}>
            <UserManagement />
          </RoleBasedRoute>
        } 
      />
      
      {/* School Configuration Routes */}
      <Route 
        path="/school-configuration" 
        element={
          <RoleBasedRoute allowedRoles={['super_admin', 'school_admin']}>
            <SchoolConfiguration2 />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/class-management" 
        element={
          <RoleBasedRoute allowedRoles={['super_admin', 'school_admin']}>
            <ClassManagement />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/academic-year" 
        element={
          <RoleBasedRoute allowedRoles={['super_admin', 'school_admin']}>
            <AcademicYearSetup />
          </RoleBasedRoute>
        } 
      />
      
      {/* Student Management Routes */}
      <Route 
        path="/students" 
        element={
          <RoleBasedRoute allowedRoles={['super_admin', 'school_admin', 'teacher', 'receptionist']}>
            <Students />
          </RoleBasedRoute>
        } 
      />
      
      {/* Staff Management Routes */}
      <Route 
        path="/staff" 
        element={
          <RoleBasedRoute allowedRoles={['super_admin', 'school_admin']}>
            <Staff />
          </RoleBasedRoute>
        } 
      />
      
      {/* Academic Routes */}
      <Route 
        path="/academics" 
        element={
          <RoleBasedRoute allowedRoles={['super_admin', 'school_admin', 'teacher', 'student', 'parent']}>
            <Academics />
          </RoleBasedRoute>
        } 
      />
      
      {/* Attendance Routes */}
      <Route 
        path="/attendance" 
        element={
          <RoleBasedRoute allowedRoles={['super_admin', 'school_admin', 'teacher']}>
            <Attendance />
          </RoleBasedRoute>
        } 
      />
      
      {/* Admin Routes */}
      <Route 
        path="/admin/*" 
        element={
          <RoleBasedRoute allowedRoles={['super_admin']}>
            <AdminRoutes />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/create-users" 
        element={
          <RoleBasedRoute allowedRoles={['super_admin']}>
            <CreateUsers />
          </RoleBasedRoute>
        } 
      />
      
      {/* Admission Routes */}
      <Route 
        path="/admissions/parent" 
        element={
          <RoleBasedRoute allowedRoles={['parent']}>
            <ParentPortal />
          </RoleBasedRoute>
        } 
      />
      <Route 
        path="/admissions/admin" 
        element={
          <RoleBasedRoute allowedRoles={['super_admin', 'school_admin', 'receptionist']}>
            <AdminPortal />
          </RoleBasedRoute>
        } 
      />
      
      {/* Tenant Routes */}
      <Route 
        path="/configuration" 
        element={
          <RoleBasedRoute allowedRoles={['super_admin', 'school_admin']}>
            <SchoolConfiguration />
          </RoleBasedRoute>
        } 
      />
      
      {/* Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

function AppContent() {
  const { user } = useAuth();
  const { tenantSlug } = useTenant();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/register-tenant" element={<RegisterTenant />} />
      <Route path="/setup" element={<SetupAdmin />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Tenant-specific routes */}
      <Route 
        path="/:tenantSlug/*" 
        element={
          user ? (
            <Layout>
              <TenantRoutes />
            </Layout>
          ) : (
            <Navigate to="/auth/login" replace />
          )
        } 
      />

      {/* Global routes for super admin */}
      <Route 
        path="/*" 
        element={
          user ? (
            <Layout>
              <TenantRoutes />
            </Layout>
          ) : (
            <Navigate to="/auth/login" replace />
          )
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <AuthProvider>
          <div className="min-h-screen bg-background font-sans antialiased">
            <Router>
              <TenantProvider>
                <AppContent />
              </TenantProvider>
            </Router>
            <Toaster />
            <Sonner />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
