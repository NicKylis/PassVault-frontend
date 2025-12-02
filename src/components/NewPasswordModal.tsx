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

  const { addPassword, editPassword } = usePasswords();

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
    const generated = Array.from({ length: 16 }, () =>
      chars.charAt(Math.floor(Math.random() * chars.length))
    ).join("");
    form.setValue("password", generated, { shouldValidate: true });
    return generated;
  };

  const evaluateStrength = (value: string) => {
    if (!value) return "Weak";

    let score = 0;

    // Basic scoring logic
    if (value.length >= 8) score++;
    if (/[A-Z]/.test(value)) score++;
    if (/[0-9]/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++; // special characters

    if (score <= 1) return "Weak";
    if (score <= 3) return "Good";
    return "Strong";
  };
  const passwordStrength = form.watch("passwordStrength");

  const onSubmit = async (data: PasswordFormData) => {
    try {
      if (editingPassword) {
        await editPassword(editingPassword.id, data);
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
        data-testid="new-password-modal"
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
                      data-testid="title-input"
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
                      data-testid="website-input"
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
                      data-testid="username-input"
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
                        data-testid="password-input"
                        placeholder=""
                        className="bg-primary-foreground border-ring flex-1 min-w-0"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e); // update form value
                          form.setValue(
                            "passwordStrength",
                            evaluateStrength(e.target.value)
                          );
                        }}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      onClick={() => {
                        const generated = generatePassword();
                        field.onChange({ target: { value: generated } }); // update input
                        form.setValue(
                          "passwordStrength",
                          evaluateStrength(generated)
                        );
                      }}
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

            <div className="mt-1 text-sm font-medium">
              Strength: {passwordStrength}
            </div>

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
                      data-testid="notes-input"
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
              <Button
                type="submit"
                data-testid="save-password-btn"
                className="cursor-pointer"
              >
                {editingPassword ? "Update" : "Save"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
