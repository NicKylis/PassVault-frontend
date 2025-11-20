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
  Plus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { usePasswords } from "@/context/PasswordContext";
import type { PasswordEntity } from "@/types/Passwords";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const PasswordCard = (password: PasswordEntity) => {
  const [visible, setVisible] = useState(true);
  const [shareEmails, setShareEmails] = useState<Record<string, string[]>>({});

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
    const emails = (shareEmails[password.id] || [])
      .map((e) => e.trim())
      .filter(Boolean);
    if (emails.length === 0) return;

    try {
      // Call context sharePassword with array of emails
      const res = await sharePassword(password.id, emails);

      // Since your context already shows toasts for each email, here we handle dropdown behavior
      const failedEmails =
        res?.filter((r) => r.status === "failed").map((r) => r.email) || [];

      if (failedEmails.length > 0) {
        // Keep only failed emails in input
        setShareEmails((prev) => ({
          ...prev,
          [password.id]: failedEmails,
        }));

        toast.error(`Cannot share with: ${failedEmails.join(", ")}`);
      } else {
        // Success: reset emails and close menu
        setShareEmails((prev) => ({
          ...prev,
          [password.id]: [""],
        }));
        toast.success("Added users successfully!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to share password");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this password?")) {
      if (password.shared) await removeSharedPassword(password);
      else await deletePassword(password.id);
    }
  };

  const addEmailField = (id: string) => {
    setShareEmails((prev) => ({
      ...prev,
      [id]: [...(prev[id] || [""]), ""],
    }));
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
              <DropdownMenu
                onOpenChange={(open) => {
                  if (!open) {
                    setShareEmails((prev) => ({
                      ...prev,
                      [password.id]: [""],
                    }));
                  }
                }}
              >
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
                      <Trash2 className="mr-2 h-4 w-4 text-red" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem
                        onClick={handleEdit}
                        className="cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4 text-foreground" />
                        <span>Edit</span>
                      </DropdownMenuItem>

                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger className="cursor-pointer">
                          <Link className="mr-4 h-4 w-4" />
                          <span>Share</span>
                        </DropdownMenuSubTrigger>

                        <DropdownMenuPortal>
                          <DropdownMenuSubContent className="w-64 bg-popover z-50 p-3">
                            <div className="space-y-2">
                              {(shareEmails[password.id] || [""]).map(
                                (email, index) => (
                                  <Input
                                    key={index}
                                    type="email"
                                    placeholder="Enter email"
                                    value={email}
                                    onChange={(e) =>
                                      setShareEmails((prev) => ({
                                        ...prev,
                                        [password.id]: (
                                          prev[password.id] || [""]
                                        ).map((em, i) =>
                                          i === index ? e.target.value : em
                                        ),
                                      }))
                                    }
                                    className="w-full"
                                  />
                                )
                              )}

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addEmailField(password.id)}
                                className="w-full cursor-pointer"
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add more
                              </Button>

                              <Button
                                size="sm"
                                className="w-full"
                                onClick={handleShare}
                              >
                                Share
                              </Button>
                            </div>
                          </DropdownMenuSubContent>
                        </DropdownMenuPortal>
                      </DropdownMenuSub>

                      <DropdownMenuSeparator />

                      <DropdownMenuItem
                        onClick={handleDelete}
                        className="cursor-pointer text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4 text-red" />
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
