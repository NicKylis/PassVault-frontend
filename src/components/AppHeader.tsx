import { Link } from "react-router-dom";
import { Bell, Globe, Bot } from "lucide-react";
import Searchbar from "./Searchbar";
import { useContext } from "react";
import { SearchContext } from "@/pages/Layout";
import { SidebarTrigger } from "./ui/sidebar";

const AppHeader = () => {
  const { setQuery } = useContext(SearchContext);
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
      </div>
    </header>
  );
};

export default AppHeader;
