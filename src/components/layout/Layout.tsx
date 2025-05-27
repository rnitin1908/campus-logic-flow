
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Header } from './Header';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as Sonner } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';

export function Layout({ children }: { children?: React.ReactNode }) {
  console.log('Layout rendering with children:', !!children, children);
  const {user} = useAuth();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-auto p-6 transition-all">
          <div className="page-transition mx-auto max-w-7xl">
            {/* Always render the content, either passed children or from the Outlet */}
            {user?.role === 'super_admin' ? (children || <Outlet />) : <Outlet /> }
            {/* {children || <Outlet />} */}
          </div>
        </main>
      </div>
      <Toaster />
      <Sonner />
    </div>
  );
}
