import { useEffect } from "react";
import {
  useForm,
  Controller,
  type UseFormRegisterReturn,
} from "react-hook-form";
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
import { Input as ShadcnInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Zap } from "lucide-react";
import React from "react";
import { toast } from "sonner";

// Forward ref wrapper for Input
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  (props, ref) => <ShadcnInput ref={ref} {...props} />
);
Input.displayName = "Input";

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
  category: z.enum(["Social Media", "Email", "Banking", "ECommerce", "Other"]),
  notes: z.string().optional(),
  favorite: z.boolean(),
  passwordStrength: z.enum(["Weak", "Good", "Strong"]),
});

export type PasswordFormData = z.infer<typeof passwordSchema>;

// Component
interface NewPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (password: PasswordFormData) => void;
  editingPassword?: PasswordEntity | null;
}

export const NewPasswordModal = ({
  isOpen,
  onClose,
  onSave,
  editingPassword,
}: NewPasswordModalProps) => {
  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<PasswordFormData>({
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
    },
  });

  useEffect(() => {
    reset(
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
          }
    );
  }, [editingPassword, isOpen, reset]);

  // Generate password
  const generatePassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    setValue(
      "password",
      Array.from({ length: 16 }, () =>
        chars.charAt(Math.floor(Math.random() * chars.length))
      ).join(""),
      { shouldValidate: true }
    );
  };

  const onSubmit = async (data: PasswordFormData) => {
    try {
      await onSave(data);
      onClose();
      toast.success("Password saved successfully!");
    } catch {
      toast.error("Error in saving password.");
    }
  };

  const renderField = (
    id: string,
    label: string,
    registerProps: UseFormRegisterReturn,
    error?: string,
    type = "text",
    placeholder = "",
    extra?: React.ReactNode
  ) => (
    <div>
      <Label htmlFor={id} className="pb-2">
        {label}
      </Label>
      <div className="flex space-x-2">
        <Input
          id={id}
          type={type}
          {...registerProps}
          className="bg-primary-foreground border-ring flex-1 min-w-0"
          placeholder={placeholder}
        />
        {extra}
      </div>
      {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
    </div>
  );

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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {renderField(
            "title",
            "Title *",
            register("title"),
            errors.title?.message,
            "text",
            "e.g., Google Account"
          )}

          {renderField(
            "website",
            "Website",
            register("website"),
            errors.website?.message,
            "text",
            "e.g., https://google.com"
          )}

          {renderField(
            "username",
            "Username/Email *",
            register("username"),
            errors.username?.message,
            "text",
            "your@email.com"
          )}

          {renderField(
            "password",
            "Password *",
            register("password"),
            errors.password?.message,
            "text",
            "",
            <Button
              type="button"
              onClick={generatePassword}
              className="bg-blue-600 hover:bg-blue-700 shrink-0"
              size="sm"
            >
              <Zap className="w-4 h-4" />
            </Button>
          )}

          <div>
            <Label htmlFor="category" className="pb-2">
              Category
            </Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="bg-primary-foreground border-ring text-muted-foreground">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-primary-foreground border-ring text-muted-foreground">
                    <SelectItem value="Social Media">Social Media</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Banking">Banking</SelectItem>
                    <SelectItem value="ECommerce">ECommerce</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-red-600 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="notes" className="pb-2">
              Notes
            </Label>
            <Textarea
              id="notes"
              {...register("notes")}
              className="bg-primary-foreground border-ring"
              placeholder="Additional notes..."
              rows={3}
            />
            {errors.notes && (
              <p className="text-red-600 text-sm mt-1">
                {errors.notes.message}
              </p>
            )}
          </div>

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
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer"
            >
              {editingPassword ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
