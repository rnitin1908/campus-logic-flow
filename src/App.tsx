
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Staff from "./pages/Staff";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import NotFound from "./pages/NotFound";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = localStorage.getItem('user');
  
  if (!user) {
    return <Navigate to="/auth/login" />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth Routes */}
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            
            {/* App Routes with Layout */}
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/staff" element={<Staff />} />
              
              {/* Add placeholder routes for other modules */}
              <Route path="/attendance" element={<div className="p-6"><h1 className="text-3xl font-bold">Attendance</h1><p className="text-muted-foreground">Track student attendance across courses and events.</p></div>} />
              <Route path="/grades" element={<div className="p-6"><h1 className="text-3xl font-bold">Grades</h1><p className="text-muted-foreground">Manage and review student academic performance.</p></div>} />
              <Route path="/courses" element={<div className="p-6"><h1 className="text-3xl font-bold">Courses</h1><p className="text-muted-foreground">Create and manage academic courses and curricula.</p></div>} />
              <Route path="/timetable" element={<div className="p-6"><h1 className="text-3xl font-bold">Timetable</h1><p className="text-muted-foreground">Schedule and view class timetables.</p></div>} />
              <Route path="/settings" element={<div className="p-6"><h1 className="text-3xl font-bold">Settings</h1><p className="text-muted-foreground">Manage your account and system preferences.</p></div>} />
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
