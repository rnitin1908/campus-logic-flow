import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { USER_ROLES } from '@/lib/services/supabase/utils';
import { Layout } from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import Students from '@/pages/Students';
import Staff from '@/pages/Staff';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import Unauthorized from '@/pages/auth/Unauthorized';
import NotFound from '@/pages/NotFound';
import Index from '@/pages/Index';
import AdminRoutes from '@/pages/admin/AdminRoutes';
import AdminPortal from '@/pages/admissions/AdminPortal';
import ParentPortal from '@/pages/admissions/ParentPortal';

// Add the import for our new Academics page
import Academics from './pages/Academics';
 

const RoleBasedRoute = ({ allowedRoles, children }: { allowedRoles: string[], children: React.ReactNode }) => {
  const { user } = useAuth();

  if (!user) {
    // Redirect to login if not authenticated
    return <Navigate to="/auth/login" />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to unauthorized page if role is not allowed
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

function App() {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/register" element={<Register />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route element={<RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]} />}>
            <Route path="/admin/*" element={<AdminRoutes />} />
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN, USER_ROLES.TEACHER]} />}>
            <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
            <Route path="/students" element={<Layout><Students /></Layout>} />
            <Route path="/staff" element={<Layout><Staff /></Layout>} />
          </Route>

          {/* Add the new Academics route */}
          <Route element={<RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN, USER_ROLES.TEACHER, USER_ROLES.STUDENT]} />}>
            <Route path="/academics" element={<Layout><Academics /></Layout>} />
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]} />}>
            <Route path="/admissions/admin" element={<Layout><AdminPortal /></Layout>} />
          </Route>

          <Route element={<RoleBasedRoute allowedRoles={[USER_ROLES.PARENT]} />}>
            <Route path="/admissions/parent" element={<Layout><ParentPortal /></Layout>} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App;
