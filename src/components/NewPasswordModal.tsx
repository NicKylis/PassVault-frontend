import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { PasswordEntity } from "@/types/Passwords";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { usePasswords } from "@/context/PasswordContext";

// Zod schema
const passwordSchema = z.object({
  title: z.string().min(1, "Title is required"),
  username: z.string().min(1, "Username/Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  website: z
    .string()
    .optional()
    .refine((val) => !val || /^https?:\/\/.+\..+/.test(val), {
      message: "Enter a valid URL (https://example.com)",
    }),
  category: z.enum(["Email", "Social Media", "Banking", "ECommerce", "Other"]),
  notes: z.string().optional(),
  favorite: z.boolean(),
  passwordStrength: z.enum(["Weak", "Good", "Strong"]),
  shared: z.boolean(),
});

export type PasswordFormData = z.infer<typeof passwordSchema>;

// Component
interface NewPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingPassword?: PasswordEntity | null;
}

export const NewPasswordModal = ({
  isOpen,
  onClose,
  editingPassword,
}: NewPasswordModalProps) => {
  const form = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      title: "",
      username: "",
      password: "",
      website: "",
      favorite: false,
      passwordStrength: "Weak",
      category: "Other",
      notes: "",
      shared: false,
    },
  });

  const { addPassword } = usePasswords();

  useEffect(() => {
    form.reset(
      editingPassword
        ? {
            title: editingPassword.title,
            username: editingPassword.username,
            password: editingPassword.password,
            website: editingPassword.website,
            category: editingPassword.category,
            favorite: editingPassword.favorite,
            passwordStrength:
              editingPassword.passwordStrength === "Good"
                ? "Weak"
                : editingPassword.passwordStrength,
            notes: editingPassword.notes || "",
            shared: editingPassword.shared || false,
          }
        : {
            title: "",
            username: "",
            password: "",
            website: "",
            category: "Other",
            favorite: false,
            passwordStrength: "Weak",
            notes: "",
            shared: false,
          }
    );
  }, [editingPassword, isOpen, form]);

  // Generate password
  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    form.setValue(
      "password",
      Array.from({ length: 16 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join(""),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: PasswordFormData) => {
    try {
      if (editingPassword) {
        // await updatePassword(editingPassword.id, data);
        toast.success("Password updated!");
      } else {
        await addPassword(data);
        toast.success("Password added!");
      }

      form.reset();
      onClose();
    } catch (err) {
      console.error("Failed to save password:", err);
      toast.error("Something went wrong.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="Add or edit a password"
        className="bg-primary-foreground text-black max-w-md mx-4 max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle className="text-black">
            {editingPassword ? "Edit Password" : "Add New Password"}
            <DialogDescription className="text-muted-foreground mt-2">
              {editingPassword
                ? "Update your password details below."
                : "Fill in the details below to add a new password."}
            </DialogDescription>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Google Account"
                      className="bg-primary-foreground border-ring"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., https://google.com"
                      className="bg-primary-foreground border-ring"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username/Email *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="your@email.com"
                      className="bg-primary-foreground border-ring"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password *</FormLabel>
                  <div className="flex space-x-2">
                    <FormControl>
                      <Input
                        type="text"
                        placeholder=""
                        className="bg-primary-foreground border-ring flex-1 min-w-0"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={generatePassword}
                      className="shrink-0"
                      size="sm"
                    >
                      <Zap className="w-4 h-4" />
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="bg-primary-foreground border-ring text-muted-foreground">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-primary-foreground border-ring text-muted-foreground">
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Social Media">Social Media</SelectItem>
                      <SelectItem value="Banking">Banking</SelectItem>
                      <SelectItem value="ECommerce">ECommerce</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional notes..."
                      className="bg-primary-foreground border-ring"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-ring cursor-pointer"
              >
                Cancel
              </Button>
              <Button type="submit" className="cursor-pointer">
                {editingPassword ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
