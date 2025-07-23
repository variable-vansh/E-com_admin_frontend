import { Routes, Route } from "react-router-dom";
import { routes } from "./routeConfig";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Categories from "../pages/Categories";
import Products from "../pages/Products";
import Inventory from "../pages/Inventory";
import Orders from "../pages/Orders";
import NotFound from "../pages/NotFound";

// Component mapping
const componentMap = {
  Dashboard,
  Users,
  Categories,
  Products,
  Inventory,
  Orders,
};

const AppRouter = () => {
  return (
    <Routes>
      {routes.map((route) => {
        const Component = componentMap[route.component];
        return (
          <Route key={route.path} path={route.path} element={<Component />} />
        );
      })}
      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
