import {
  HomeIcon,
  LayoutDashboard,
  Menu,
  Settings,
  UsersIcon,
  UserSquare,
  BookOpen
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { isSuperAdmin } from "@/lib/utils";
import { supabaseService } from "@/lib/services";

interface MenuItem {
  icon: React.ReactNode;
  text: string;
  path: string;
}

const Sidebar = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setShowSidebar(window.innerWidth >= 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const menuItems = [
    { icon: <HomeIcon />, text: "Dashboard", path: "/dashboard" },
    { icon: <UsersIcon />, text: "Students", path: "/students" },
    { icon: <UserSquare />, text: "Staff", path: "/staff" },
    { icon: <BookOpen />, text: "Academic Records", path: "/academics" },
  ];

  const adminMenuItems = [
    { icon: <LayoutDashboard />, text: "Admin Dashboard", path: "/admin" },
    { icon: <Settings />, text: "Settings", path: "/admin/settings" },
  ];

  const renderMenuItems = (items: MenuItem[]) => {
    return items.map((item) => (
      <li key={item.text}>
        <NavLink
          to={item.path}
          className={({ isActive }) =>
            `flex items-center gap-3 p-2 rounded-md hover:bg-secondary ${
              isActive ? "bg-secondary font-semibold" : ""
            }`
          }
        >
          {item.icon}
          {item.text}
        </NavLink>
      </li>
    ));
  };

  return (
    <>
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-64">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-muted" />
              <span className="font-bold">Acme Inc</span>
            </div>
            <Separator className="my-4" />
            <nav className="flex flex-col space-y-1">
              <ul className="space-y-0.5">
                {renderMenuItems(menuItems)}
                {isSuperAdmin(supabaseService.getCurrentUser()?.role) && renderMenuItems(adminMenuItems)}
              </ul>
            </nav>
          </SheetContent>
        </Sheet>
      ) : (
        <aside
          className={`fixed left-0 top-0 z-20 h-full w-64 border-r bg-background py-4 transition-transform ${
            showSidebar ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0`}
        >
          <div className="flex items-center space-x-2 px-4">
            <div className="h-8 w-8 rounded-md bg-muted" />
            <span className="font-bold">Acme Inc</span>
          </div>
          <Separator className="my-4" />
          <nav className="flex flex-col space-y-1">
            <ul className="space-y-0.5 px-4">
              {renderMenuItems(menuItems)}
              {isSuperAdmin(supabaseService.getCurrentUser()?.role) && renderMenuItems(adminMenuItems)}
            </ul>
          </nav>
        </aside>
      )}
    </>
  );
};

export default Sidebar;
