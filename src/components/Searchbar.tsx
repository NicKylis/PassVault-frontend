import { useState } from "react";
import { X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchbarProps {
  onSearch: (query: string) => void;
}

const Searchbar = ({ onSearch }: SearchbarProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Trigger search on input change or Enter key
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    onSearch("");
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchQuery.trim());
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
