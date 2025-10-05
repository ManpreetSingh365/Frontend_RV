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
  Map
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
} as const;

// ---------- ROLE-BASED ITEMS ----------
export const getSidebarItems = (role: string, username?: string) => {
  // Common sections for all roles
  const common = [
    {
      title: "MAIN",
      items: [
        { name: "Dashboard", icon: "dashboard", path: `/${role}/panel/` },
        { name: "Map", icon: "map", path: "/map" },
      ],
    },
  ];

  // Fleet-related menu (admin & manager only)
  const fleetManagement = {
    title: "FLEET MANAGEMENT",
    items: [
      { name: "Users", icon: "user", path: `/${role}/panel/users` },
      {
        name: `User: ${username}`,
        icon: "user",
        path: `/${role}/panel/users/${username}`,
      },
      { name: "Vehicles", icon: "truck", path: `/${role}/panel/vehicle` },
      { name: "Reports", icon: "chart", path: `/${role}/panel/report` },
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

  // Role-based visibility
  switch (role) {
    case "admin":
      return [...common, fleetManagement, analytics, system];
    case "manager":
      return [...common, fleetManagement, system];
    case "driver":
      return [
        ...common,
        {
          title: "MY DASHBOARD",
          items: [
            {
              name: "My Vehicles",
              icon: "truck",
              path: `/${role}/panel/vehicle`,
            },
            {
              name: "My Reports",
              icon: "chart",
              path: `/${role}/panel/report`,
            },
          ],
        },
        system,
      ];
    default:
      return [...common, system];
  }
};
