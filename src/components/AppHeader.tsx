import { Link, useNavigate } from "react-router-dom";
import { Bell, Globe, Bot, LogOut } from "lucide-react";
import Searchbar from "./Searchbar";
import { useContext } from "react";
import { SearchContext } from "@/pages/Layout";
import { SidebarTrigger } from "./ui/sidebar";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const AppHeader = () => {
  const { setQuery } = useContext(SearchContext);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="flex flex-col md:flex-row items-start md:items-center justify-between py-2 px-4 md:py-3 md:px-6 bg-white border-b border-gray-200 gap-4">
      {/* Top row on mobile / left side on desktop */}
      <div className="flex w-full md:w-auto items-center justify-between md:justify-start gap-2">
        <SidebarTrigger className="p-2 hover:bg-gray-100 rounded-full" />

        {/* Mobile: */}
        <div className="flex md:hidden items-center space-x-4">
          <Link
            to="/notifications"
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Bell className="h-4 w-4 text-gray-700" />
          </Link>
          <Link to="/settings" className="p-2 hover:bg-gray-100 rounded-full">
            <Globe className="h-4 w-4 text-gray-700" />
          </Link>
          <Link to="/help" className="p-2 hover:bg-gray-100 rounded-full">
            <Bot className="h-4 w-4 text-gray-700" />
          </Link>
        </div>
      </div>

      {/* Full-width searchbar on mobile / inline on Desktop */}
      <div className="w-full md:w-auto md:flex-1">
        <Searchbar onSearch={setQuery} />
      </div>

      {/* Desktop Buttons */}
      <div className="hidden md:flex items-center space-x-4 ml-4">
        <Link
          to="/notifications"
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <Bell className="h-6 w-6 text-gray-700" />
        </Link>
        <Link to="/lang" className="p-2 hover:bg-gray-100 rounded-full">
          <Globe className="h-6 w-6 text-gray-700" />
        </Link>
        <Link to="/help" className="p-2 hover:bg-gray-100 rounded-full">
          <Bot className="h-6 w-6 text-gray-700" />
        </Link>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full bg-gray-200 hover:bg-gray-300 text-sm font-semibold text-gray-700"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="flex flex-col space-y-1 p-2">
              <p className="text-sm font-medium text-gray-900">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-600">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AppHeader;
