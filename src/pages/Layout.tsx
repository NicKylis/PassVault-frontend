import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import AppHeader from "@/components/AppHeader";
import { useState, createContext } from "react";
import { usePasswords } from "@/context/PasswordContext";
import type { PasswordEntity } from "@/types/Passwords";
import PasswordCard from "@/components/PasswordCard";

export const SearchContext = createContext<{
  query: string;
  setQuery: (q: string) => void;
  results: PasswordEntity[];
}>({ query: "", setQuery: () => {}, results: [] });

const Layout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { passwords } = usePasswords();

  // Compute global search results (applies only the header search logic)
  const results = searchQuery
    ? passwords.filter(
        (p) =>
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : passwords;

  return (
    <div className="app-container">
      <SidebarProvider>
        <SearchContext.Provider
          value={{ query: searchQuery, setQuery: setSearchQuery, results }}
        >
          <div className="min-h-screen w-screen bg-[#F8F9FF] flex">
            <AppSidebar />
            <main className="flex-1 flex flex-col min-w-0">
              <AppHeader />

              {/* Global search results: when a header query exists show a unified
                  search results view across the app. This replaces per-page
                  search logic (Dashboard/CategoryPage) and ensures search works everywhere. */}
              {searchQuery ? (
                <div className="flex-1 pt-4 px-3 md:px-6">
                  <h1 className="text-2xl mb-4">Search Results</h1>
                  {results.length === 0 ? (
                    <div className="text-center text-muted-foreground">
                      No results found.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {results.map((item) => (
                        <PasswordCard key={item.id} {...item} />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Outlet />
              )}
            </main>
          </div>
        </SearchContext.Provider>
      </SidebarProvider>
    </div>
  );
};

export default Layout;
