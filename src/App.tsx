
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { AuthProvider, ROLES } from "./contexts/AuthContext";
import RoleBasedRoute from "./components/auth/RoleBasedRoute";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Staff from "./pages/Staff";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Define role-based route configurations
const superAdminRoutes = [ROLES.SUPER_ADMIN];
const adminRoutes = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN];
const teacherRoutes = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER];
const studentRoutes = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.STUDENT];
const parentRoutes = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TEACHER, ROLES.PARENT];
const accountantRoutes = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.ACCOUNTANT];
const librarianRoutes = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.LIBRARIAN];
const receptionistRoutes = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.RECEPTIONIST];
const transportRoutes = [ROLES.SUPER_ADMIN, ROLES.SCHOOL_ADMIN, ROLES.TRANSPORT_MANAGER];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* App Routes with Layout */}
            <Route element={
              <RoleBasedRoute allowedRoles={[...Object.values(ROLES)]}>
                <Layout />
              </RoleBasedRoute>
            }>
              {/* Dashboard accessible to all authenticated users */}
              <Route path="/" element={<Dashboard />} />
              
              {/* Student management - accessible to admins and teachers */}
              <Route path="/students" element={
                <RoleBasedRoute allowedRoles={[...adminRoutes, ...teacherRoutes]}>
                  <Students />
                </RoleBasedRoute>
              } />
              
              {/* Staff management - accessible to admins only */}
              <Route path="/staff" element={
                <RoleBasedRoute allowedRoles={adminRoutes}>
                  <Staff />
                </RoleBasedRoute>
              } />
              
              {/* Place-holder routes with appropriate role restrictions */}
              <Route path="/attendance" element={
                <RoleBasedRoute allowedRoles={[...adminRoutes, ...teacherRoutes]}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Attendance</h1>
                    <p className="text-muted-foreground">Track student attendance across courses and events.</p>
                  </div>
                </RoleBasedRoute>
              } />
              
              <Route path="/grades" element={
                <RoleBasedRoute allowedRoles={[...adminRoutes, ...teacherRoutes]}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Grades</h1>
                    <p className="text-muted-foreground">Manage and review student academic performance.</p>
                  </div>
                </RoleBasedRoute>
              } />
              
              <Route path="/courses" element={
                <RoleBasedRoute allowedRoles={[...adminRoutes, ...teacherRoutes]}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Courses</h1>
                    <p className="text-muted-foreground">Create and manage academic courses and curricula.</p>
                  </div>
                </RoleBasedRoute>
              } />
              
              <Route path="/timetable" element={
                <RoleBasedRoute allowedRoles={[...adminRoutes, ...teacherRoutes, ...studentRoutes, ...parentRoutes]}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Timetable</h1>
                    <p className="text-muted-foreground">Schedule and view class timetables.</p>
                  </div>
                </RoleBasedRoute>
              } />
              
              <Route path="/library" element={
                <RoleBasedRoute allowedRoles={[...adminRoutes, ...librarianRoutes, ...studentRoutes, ...teacherRoutes]}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Library</h1>
                    <p className="text-muted-foreground">Manage books and library resources.</p>
                  </div>
                </RoleBasedRoute>
              } />

              <Route path="/finance" element={
                <RoleBasedRoute allowedRoles={[...adminRoutes, ...accountantRoutes]}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Finance</h1>
                    <p className="text-muted-foreground">Manage fees, invoices and financial records.</p>
                  </div>
                </RoleBasedRoute>
              } />

              <Route path="/transport" element={
                <RoleBasedRoute allowedRoles={[...adminRoutes, ...transportRoutes]}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Transport</h1>
                    <p className="text-muted-foreground">Manage school transportation and bus routes.</p>
                  </div>
                </RoleBasedRoute>
              } />

              <Route path="/admissions" element={
                <RoleBasedRoute allowedRoles={[...adminRoutes, ...receptionistRoutes]}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Admissions</h1>
                    <p className="text-muted-foreground">Handle admissions and inquiries.</p>
                  </div>
                </RoleBasedRoute>
              } />
              
              <Route path="/settings" element={
                <RoleBasedRoute allowedRoles={adminRoutes}>
                  <div className="p-6">
                    <h1 className="text-3xl font-bold">Settings</h1>
                    <p className="text-muted-foreground">Manage your account and system preferences.</p>
                  </div>
                </RoleBasedRoute>
              } />
            </Route>

            {/* 404 and redirects */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
