import { useState, useEffect, useContext } from "react";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SearchContext } from "@/pages/Layout";

const Searchbar = () => {
  const { query, setQuery } = useContext(SearchContext);
  const [searchQuery, setSearchQuery] = useState(query || "");
  // No navigation: search filters in-place on the current page

  // Keep local input in sync when global query changes (e.g., from other components)
  useEffect(() => {
    setSearchQuery(query || "");
  }, [query]);

  // Trigger search on input change or Enter key
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const v = event.target.value;
    setSearchQuery(v);
    // Live-update global query so search filters in-place across all pages immediately
    setQuery(v.trim());
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setQuery("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = searchQuery.trim();
    setQuery(trimmed);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full md:w-auto relative flex items-center"
      autoComplete="off"
    >
      <Input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        placeholder="Search by title or category"
        className="focus:outline-none text-sm pr-10"
        aria-label="Search passwords"
      />
      {searchQuery && (
        <X
          onClick={handleClearSearch}
          className="h-5 w-5 absolute right-8 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer"
          aria-label="Clear search"
        />
      )}
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cusrsor-pointer cursor-pointer"
        aria-label="Submit search"
      >
        <Search className="h-5 w-5" />
      </button>
    </form>
  );
};

export default Searchbar;
