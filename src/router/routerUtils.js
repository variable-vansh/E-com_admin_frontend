import { useLocation, useNavigate } from "react-router-dom";
import { getRouteByPath } from "./routeConfig";

// Custom hook to get current route information
export const useCurrentRoute = () => {
  const location = useLocation();
  const currentRoute = getRouteByPath(location.pathname);

  return {
    pathname: location.pathname,
    route: currentRoute,
    title: currentRoute?.name || "Unknown Page",
    icon: currentRoute?.icon,
  };
};

// Custom hook for navigation with helper methods
export const useAppNavigation = () => {
  const navigate = useNavigate();

  const goToRoute = (path) => {
    navigate(path);
  };

  const goToDashboard = () => {
    navigate("/");
  };

  const goToUsers = () => {
    navigate("/users");
  };

  const goToCategories = () => {
    navigate("/categories");
  };

  const goToProducts = () => {
    navigate("/products");
  };

  const goToInventory = () => {
    navigate("/inventory");
  };

  const goToOrders = () => {
    navigate("/orders");
  };

  const goBack = () => {
    navigate(-1);
  };

  return {
    goToRoute,
    goToDashboard,
    goToUsers,
    goToCategories,
    goToProducts,
    goToInventory,
    goToOrders,
    goBack,
  };
};

// Helper function to check if a path is active
export const isActiveRoute = (currentPath, targetPath) => {
  if (targetPath === "/") {
    return currentPath === "/" || currentPath === "/dashboard";
  }
  return currentPath === targetPath;
};

// Generate breadcrumbs for the current route
export const generateBreadcrumbs = (pathname) => {
  const breadcrumbs = [{ name: "Home", path: "/" }];

  if (pathname !== "/" && pathname !== "/dashboard") {
    const route = getRouteByPath(pathname);
    if (route) {
      breadcrumbs.push({ name: route.name, path: route.path });
    }
  }

  return breadcrumbs;
};
