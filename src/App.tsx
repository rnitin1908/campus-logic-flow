
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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
import { AuthProvider } from '@/contexts/AuthContext';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';

// Add the import for our pages
import Academics from './pages/Academics';
import Attendance from './pages/Attendance';

// Import tenant related pages
import RegisterTenant from './pages/tenant/RegisterTenant';
import SchoolConfiguration from './pages/tenant/SchoolConfiguration';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes - no layout */}
          <Route path="/" element={<Index />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/auth/setup-admin" element={<SetupAdmin />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/register-school" element={<RegisterTenant />} />
          
          {/* Protected routes with Layout */}
          <Route path="/dashboard" element={
            <RoleBasedRoute moduleName="DASHBOARD">
              <Layout>
                <Dashboard />
              </Layout>
            </RoleBasedRoute>
          } />
          
          <Route path="/students" element={
            <RoleBasedRoute moduleName="STUDENT_MANAGEMENT">
              <Layout>
                <Students />
              </Layout>
            </RoleBasedRoute>
          } />
          
          <Route path="/staff" element={
            <RoleBasedRoute moduleName="TEACHER_MANAGEMENT">
              <Layout>
                <Staff />
              </Layout>
            </RoleBasedRoute>
          } />

          <Route path="/academics" element={
            <RoleBasedRoute moduleName="CLASS_SUBJECT">
              <Layout>
                <Academics />
              </Layout>
            </RoleBasedRoute>
          } />

          <Route path="/attendance" element={
            <RoleBasedRoute moduleName="ATTENDANCE">
              <Layout>
                <Attendance />
              </Layout>
            </RoleBasedRoute>
          } />

          <Route path="/admin/*" element={
            <RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
              <Layout>
                <AdminRoutes />
              </Layout>
            </RoleBasedRoute>
          } />

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
          
          <Route path="/library" element={
            <RoleBasedRoute moduleName="LIBRARY_MANAGEMENT">
              <Layout>
                <div>Library Management (placeholder)</div>
              </Layout>
            </RoleBasedRoute>
          } />
          
          <Route path="/finance/fees" element={
            <RoleBasedRoute moduleName="FEES_MANAGEMENT">
              <Layout>
                <div>Fees Management (placeholder)</div>
              </Layout>
            </RoleBasedRoute>
          } />
          
          <Route path="/transport" element={
            <RoleBasedRoute moduleName="TRANSPORT">
              <Layout>
                <div>Transport Management (placeholder)</div>
              </Layout>
            </RoleBasedRoute>
          } />
          
          <Route path="/analytics" element={
            <RoleBasedRoute moduleName="ANALYTICS">
              <Layout>
                <div>Analytics & Reports (placeholder)</div>
              </Layout>
            </RoleBasedRoute>
          } />

          {/* School-specific routes with Layout */}
          <Route path="/schools/:schoolCode/*" element={
            <Layout>
              <Routes>
                <Route path="dashboard" element={
                  <RoleBasedRoute moduleName="DASHBOARD">
                    <Dashboard />
                  </RoleBasedRoute>
                } />
                <Route path="students" element={
                  <RoleBasedRoute moduleName="STUDENT_MANAGEMENT">
                    <Students />
                  </RoleBasedRoute>
                } />
                <Route path="academics" element={
                  <RoleBasedRoute moduleName="CLASS_SUBJECT">
                    <Academics />
                  </RoleBasedRoute>
                } />
                <Route path="attendance" element={
                  <RoleBasedRoute moduleName="ATTENDANCE">
                    <Attendance />
                  </RoleBasedRoute>
                } />
                <Route path="configuration" element={
                  <RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
                    <SchoolConfiguration />
                  </RoleBasedRoute>
                } />
              </Routes>
            </Layout>
          } />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
