
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { USER_ROLES } from '@/lib/services/supabase/utils';
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
import { AuthProvider } from '@/contexts/AuthContext';
import RoleBasedRoute from '@/components/auth/RoleBasedRoute';

// Add the import for our pages
import Academics from './pages/Academics';
import Attendance from './pages/Attendance';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route path="/admin/*" element={
            <RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]}>
              <AdminRoutes />
            </RoleBasedRoute>
          } />

          <Route path="/dashboard" element={
            <RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN, USER_ROLES.TEACHER]}>
              <Layout>
                <Dashboard />
              </Layout>
            </RoleBasedRoute>
          } />
          
          <Route path="/students" element={
            <RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN, USER_ROLES.TEACHER]}>
              <Layout>
                <Students />
              </Layout>
            </RoleBasedRoute>
          } />
          
          <Route path="/staff" element={
            <RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN, USER_ROLES.TEACHER]}>
              <Layout>
                <Staff />
              </Layout>
            </RoleBasedRoute>
          } />

          <Route path="/academics" element={
            <RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT]}>
              <Layout>
                <Academics />
              </Layout>
            </RoleBasedRoute>
          } />

          <Route path="/attendance" element={
            <RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN, USER_ROLES.TEACHER]}>
              <Layout>
                <Attendance />
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

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
