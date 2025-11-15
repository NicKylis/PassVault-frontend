import PasswordCard from "@/components/PasswordCard";
import { usePasswords } from "@/context/PasswordContext";
import { useSearchParams } from "react-router-dom";

const CategoryPage = () => {
  const { passwords } = usePasswords();
  const [searchParams] = useSearchParams();

  const category = searchParams.get("category"); // e.g., "social-media"
  const filter = searchParams.get("filter"); // e.g., "favorites"

  let filtered = passwords;

  if (filter === "favorites") {
    filtered = filtered.filter((p) => p.favorite);
  } else if (category) {
    filtered = filtered.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Page title logic
  const noPasswordsMessage =
    filtered.length === 0
      ? filter === "favorites"
        ? "No favorite passwords"
        : category
        ? `No ${category.charAt(0).toUpperCase() + category.slice(1)} passwords`
        : "No passwords available"
      : null;

  return (
    <div className="p-6 space-y-4">
      {filtered.length === 0 ? (
        <p className="text-gray-500 flex items-center justify-center">
          {noPasswordsMessage}
        </p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {filtered.map((p) => (
            <PasswordCard key={p.id} {...p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
