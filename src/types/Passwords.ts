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
  shared: boolean;
  sharedRecordId?: string;
};
