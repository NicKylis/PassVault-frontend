export type PasswordEntity = {
  id: string;
  title: string;
  username: string;
  password: string;
  website?: string;
  favorite: boolean;
  category: "Social Media" | "Email" | "ECommerce" | "Banking" | "Other";
  passwordStrength: "Weak" | "Good" | "Strong";
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  lastUsedAt?: Date;
};

// Define type for creating new password (POST request)
export type PasswordCreate = Omit<
  PasswordEntity,
  "id" | "createdAt" | "updatedAt"
>;
