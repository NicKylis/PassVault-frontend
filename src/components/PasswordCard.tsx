import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Copy,
  Star,
  Eye,
  EyeOff,
  Ellipsis,
  Meh,
  Frown,
  Smile,
  Edit,
  Link,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePasswords } from "@/context/PasswordContext";
import type { PasswordEntity } from "@/types/Passwords";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";

const PasswordCard = (password: PasswordEntity) => {
  const [visible, setVisible] = useState(true);

  const {
    toggleFavorite,
    markUsed,
    editPassword,
    sharePassword,
    deletePassword,
    removeSharedPassword,
  } = usePasswords();

  // Copy handler
  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copied to clipboard`, { duration: 2000 });
      await markUsed(password);
    } catch (err) {
      console.error(err);
      toast.error(`Failed to copy ${label}`);
    }
  };

  // Menu action handlers
  const handleEdit = async () => {
    // Example: prompt for new title (replace with modal in real app)
    const newTitle = prompt("Edit title:", password.title);
    if (newTitle) await editPassword(password.id, { title: newTitle });
  };

  const handleShare = async () => {
    const email = prompt("Enter email to share with:");
    if (email) await sharePassword(password.id, email);
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this password?")) {
      if (password.shared) await removeSharedPassword(password);
      else await deletePassword(password.id);
    }
  };

  const strengthIcon = {
    Strong: <Smile color="#7FE47E" />,
    Good: <Meh color="#FFEB3A" />,
    Weak: <Frown color="#FF718B" />,
  }[password.passwordStrength] || (
    <span className="text-gray-500">Unknown</span>
  );

  return (
    <Card className="bg-white shadow-md relative">
      <CardHeader className="h-3">
        <CardTitle>
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center gap-2">
              <span className="text-xl">{password.title}</span>
            </div>
            <div className="inline-flex items-center gap-2 relative">
              <button
                className="cursor-pointer"
                onClick={() => toggleFavorite(password)}
              >
                <Star
                  className="w-5 h-5"
                  color={password.favorite ? "#FFEB3A" : undefined}
                  fill={password.favorite ? "#FFEB3A" : "none"}
                />
              </button>

              {/* Dropdown menu */}
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-secondary"
                  >
                    <Ellipsis className="h-5 w-5" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 bg-popover z-50"
                >
                  {password.shared ? (
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="cursor-pointer"
                    >
                      <Trash2 className="mr-2 h-4 w-4 text-black" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem
                        onClick={handleEdit}
                        className="cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Edit</span>
                      </DropdownMenuItem>

                      <DropdownMenuItem
                        onClick={handleShare}
                        className="cursor-pointer"
                      >
                        <Link className="mr-2 h-4 w-4" />
                        <span>Share</span>
                      </DropdownMenuItem>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={handleDelete}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="text-md text-muted-foreground mb-1">Username:</div>
        <div className="flex items-center gap-2">
          <div className="text-md font-semibold">{password.username}</div>
          <button
            className="cursor-pointer"
            onClick={() => handleCopy(password.username, "Username")}
          >
            <Copy className="inline h-4" />
          </button>
        </div>

        <div className="text-md text-muted-foreground">Password:</div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2">
            <span className="text-md font-semibold">
              {visible
                ? "•".repeat(password.password.length)
                : password.password}
            </span>
            <button
              className="cursor-pointer"
              onClick={() => setVisible(!visible)}
            >
              {visible ? (
                <Eye className="inline h-4" />
              ) : (
                <EyeOff className="inline h-4" />
              )}
            </button>
          </span>
          <button
            className="cursor-pointer"
            onClick={() => handleCopy(password.password, "Password")}
          >
            <Copy className="inline h-4" />
          </button>
        </div>
        <div>{strengthIcon}</div>
      </CardContent>
    </Card>
  );
};

export default PasswordCard;
