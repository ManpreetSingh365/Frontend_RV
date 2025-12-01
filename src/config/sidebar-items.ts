import {
  Home,
  Database,
  Truck,
  User,
  Route,
  Wrench,
  BarChart3,
  TrendingUp,
  Settings,
  HelpCircle,
  Map,
  Shield,
  Building2,
  CreditCard,
  History,
} from "lucide-react";

// ---------- ICON MAP ----------
export const iconMap = {
  dashboard: Home,
  data: Database,
  truck: Truck,
  user: User,
  route: Route,
  wrench: Wrench,
  chart: BarChart3,
  analytics: TrendingUp,
  settings: Settings,
  help: HelpCircle,
  map: Map,
  shield: Shield,
  building: Building2,
  creditCard: CreditCard,
  history: History,
} as const;

// ---------- ROLE-BASED ITEMS ----------
export const getSidebarItems = (username?: string) => {
  // Common sections for all roles
  const common = [
    {
      title: "MAIN",
      items: [
        { name: "Dashboard", icon: "dashboard", path: `/panel/` },
        { name: "Map", icon: "map", path: "/map" },
      ],
    },
  ];

  // Fleet-related menu (admin & manager only)
  const fleetManagement = {
    title: "FLEET MANAGEMENT",
    items: [
      { name: "Organizations", icon: "building", path: `/panel/organization` },
      { name: "Roles", icon: "shield", path: `/panel/roles` },
      { name: "Users", icon: "user", path: `/panel/users` },
      { name: "Vehicles", icon: "truck", path: `/panel/vehicle` },
      { name: "Subscriptions Plans", icon: "creditCard", path: `/panel/subscription` },
      { name: "Subscriptions History", icon: "history", path: `/panel/subscription-history` },
      {
        name: `User: ${username}`,
        icon: "user",
        path: `/panel/users/${username}`,
      },
      { name: "Reports", icon: "chart", path: `/panel/report` },
      { name: "Maintenance", icon: "wrench", path: "/maintenance" },
    ],
  };

  // Analytics (admin & manager)
  const analytics = {
    title: "ANALYTICS",
    items: [
      { name: "Reports", icon: "chart", path: "/reports" },
      { name: "Performance", icon: "analytics", path: "/performance" },
    ],
  };

  // System / Settings (all)
  const system = {
    title: "SYSTEM",
    items: [
      { name: "Settings", icon: "settings", path: "/settings" },
      { name: "Support", icon: "help", path: "/support" },
    ],
  };

  return [...common, fleetManagement, analytics, system];
};
