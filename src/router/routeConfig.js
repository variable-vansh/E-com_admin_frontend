// Route configuration
export const routes = [
  {
    path: "/",
    name: "Orders",
    icon: "ShoppingCart",
    component: "Orders",
  },
  {
    path: "/promos",
    name: "Promos",
    icon: "Campaign",
    component: "Promos",
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "Dashboard",
    component: "Dashboard",
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
    path: "/coupons",
    name: "Coupons",
    icon: "LocalOffer",
    component: "Coupons",
  },
  {
    path: "/grains",
    name: "Grains",
    icon: "Grain",
    component: "Grains",
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
    hidden: true, // Don't show in navigation (duplicate)
  },
];

// Auth routes (not protected)
export const authRoutes = [
  {
    path: "/login",
    component: "Login",
  },
  {
    path: "/signup",
    component: "Signup",
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
