import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import axios from "axios";
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
import { useAuth } from "@/hooks/useAuth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export const LoginPage = () => {
  const [register, setRegister] = useState(false); // New state for registration
  const navigate = useNavigate();
  const { isAuthenticated, loading: authLoading, login } = useAuth();

  // Zod schema
  const loginSchema = register
    ? z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
      })
    : z.object({
        email: z.string().email("Please enter a valid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
      });

  type LoginFormData = z.infer<typeof loginSchema> & { name?: string };
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, authLoading, navigate]);

  const onSubmit = async (data: LoginFormData & { name?: string }) => {
    try {
      if (register) {
        // Registration
        await api.post("/register", {
          name: data.name,
          email: data.email,
          password: data.password,
        });
        toast.success("Registered successfully! Please login.");
        setRegister(false); // Switch to login form
      } else {
        // Login
        await login(data.email, data.password);
        toast.success("Login successful!");
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error(err);
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.error || "Operation failed");
      } else {
        toast.error("Operation failed. Please try again.");
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">PassVault</h1>
          <p className="text-muted-foreground mt-2">
            Secure password management
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {register && (
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        className="bg-gray-50 border-gray-300 focus:bg-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="you@example.com"
                      type="email"
                      className="bg-gray-50 border-gray-300 focus:bg-white"
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
                  <FormLabel className="text-gray-700">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your password"
                      type="password"
                      className="bg-gray-50 border-gray-300 focus:bg-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-primary text-white font-semibold py-2"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting
                ? register
                  ? "Registering..."
                  : "Logging in..."
                : register
                ? "Register"
                : "Login"}
            </Button>
          </form>
        </Form>

        <div>
          <p className="mt-6 text-center">
            {register ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={() => setRegister(!register)}
              className="text-primary hover:underline font-medium cursor-pointer"
            >
              {register ? "Login here" : "Register here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
