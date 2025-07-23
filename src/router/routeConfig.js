// Route configuration
export const routes = [
  {
    path: "/",
    name: "Dashboard",
    icon: "Dashboard",
    component: "Dashboard",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "Dashboard",
    component: "Dashboard",
    hidden: true, // Don't show in navigation
  },
  {
    path: "/users",
    name: "Users",
    icon: "People",
    component: "Users",
  },
  {
    path: "/categories",
    name: "Categories",
    icon: "Category",
    component: "Categories",
  },
  {
    path: "/products",
    name: "Products",
    icon: "Inventory",
    component: "Products",
  },
  {
    path: "/inventory",
    name: "Inventory",
    icon: "Storage",
    component: "Inventory",
  },
  {
    path: "/orders",
    name: "Orders",
    icon: "ShoppingCart",
    component: "Orders",
  },
];

// Get navigation routes (excluding hidden ones)
export const getNavigationRoutes = () => {
  return routes.filter((route) => !route.hidden);
};

// Get route by path
export const getRouteByPath = (path) => {
  return routes.find((route) => route.path === path);
};
