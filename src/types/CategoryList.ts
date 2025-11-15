import { Mail, Users, DollarSign, ShoppingBag, Tag } from "lucide-react";

export const CategoryList = [
  {
    title: "Email",
    url: "/email",
    icon: Mail,
  },
  {
    title: "Social Media",
    url: "/social-media",
    icon: Users,
  },
  {
    title: "Banking",
    url: "/banking",
    icon: DollarSign,
  },
  {
    title: "ECommerce",
    url: "/ecommerce",
    icon: ShoppingBag,
  },
  {
    title: "Other",
    url: "/other",
    icon: Tag,
  },
];

export const CategoryMap = Object.fromEntries(
  CategoryList.map((category) => [category.title, category])
);
