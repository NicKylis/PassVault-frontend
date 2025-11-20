import {
  GaugeCircle,
  Star,
  Layers,
  Link as Linker,
  Sparkles,
  Phone,
  Settings,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  useLocation,
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import { CategoryList } from "@/types/CategoryList";
import logo from "/logo.png";
import { type ElementType } from "react";
import { useAuth } from "@/hooks/useAuth";
import axios from "axios";

type SidebarItem = {
  title: string;
  url: string;
  icon: ElementType;
  action?: boolean;
};

const items = [
  { title: "Dashboard", url: "/", icon: GaugeCircle },
  { title: "Favorites", url: "/view-all?filter=favorites", icon: Star },
  { title: "View All", url: "/view-all", icon: Layers },
  { title: "Shared Passwords", url: "/view-all?filter=shared", icon: Linker },
];

const accountItems = [
  { title: "Upgrade", url: "/upgrade", icon: Sparkles },
  { title: "Contact Us", url: "/contact", icon: Phone },
  { title: "Account Settings", url: "/settings", icon: Settings },
  { title: "Logout", url: "", icon: LogOut, action: true },
];

export function AppSidebar() {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const activeCategory = searchParams.get("category");
  const filter = searchParams.get("filter");

  // Helper for active state
  const isItemActive = (item: SidebarItem) => {
    if (item.url === "/view-all")
      return Boolean(
        location.pathname === item.url && !activeCategory && !filter
      );
    if (item.title === "Favorites") return Boolean(filter === "favorites");
    return Boolean(item.url && location.pathname === item.url);
  };

  const handleLogout = () => {
    delete axios.defaults.headers.common["Authorization"];
    logout();
    navigate("/login", { replace: true });
  };

  // Render menu items
  const renderMenuItems = (menu: SidebarItem[]) =>
    menu.map((item) => (
      <SidebarMenuItem key={item.title}>
        {item.action ? (
          <SidebarMenuButton
            asChild
            isActive={isItemActive(item)}
            className="flex items-center gap-2 w-full text-left"
          >
            {item.title === "Logout" ? (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 w-full cursor-pointer text-left"
              >
                <item.icon />
                <span>{item.title}</span>
              </button>
            ) : (
              <button
                type="button"
                className="flex items-center gap-2 w-full cursor-pointer"
              >
                <item.icon />
                <span>{item.title}</span>
              </button>
            )}
          </SidebarMenuButton>
        ) : (
          <SidebarMenuButton asChild isActive={isItemActive(item)}>
            <Link to={item.url} className="flex items-center gap-2 w-full">
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        )}
      </SidebarMenuItem>
    ));

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <Link to="/">
            <div className="flex items-center gap-2 px-4 py-2">
              <div className="flex h-10 w-10 items-center justify-center">
                <img src={logo} alt="Logo" className="h-10 w-10" />
              </div>
              <div className="grid flex-1 text-left text-lg leading-tight">
                <span className="truncate font-semibold">
                  <span className="text-primary">Pass</span>
                  <span>Vault</span>
                </span>
              </div>
            </div>
          </Link>
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenuItems(items)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {CategoryList.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={activeCategory === item.title.toLowerCase()}
                    >
                      <Link
                        to={`/view-all?category=${item.title.toLowerCase()}`}
                        className="flex items-center gap-2 w-full"
                      >
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>{renderMenuItems(accountItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
