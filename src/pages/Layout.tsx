import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { useState, createContext } from "react";

export const SearchContext = createContext<{
  query: string;
  setQuery: (q: string) => void;
}>({ query: "", setQuery: () => {} });

const Layout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="app-container">
      <SidebarProvider>
        <SearchContext.Provider
          value={{ query: searchQuery, setQuery: setSearchQuery }}
        >
          <div className="min-h-screen w-screen bg-[#F8F9FF] flex">
            <AppSidebar />
            <main className="flex-1 flex flex-col min-w-0">
              <AppHeader />
              <Outlet />
            </main>
          </div>
        </SearchContext.Provider>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
