import { Routes, Route, Navigate } from "react-router-dom";
import { routes, authRoutes } from "./routeConfig";
import Dashboard from "../pages/Dashboard";
import Users from "../pages/Users";
import Categories from "../pages/Categories";
import Products from "../pages/Products";
import Grains from "../pages/Grains";
import Inventory from "../pages/Inventory";
import Orders from "../pages/Orders";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import NotFound from "../pages/NotFound";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Layout from "../components/layout/Layout";
import authService from "../services/authService";

// Component mapping
const componentMap = {
  Dashboard,
  Users,
  Categories,
  Products,
  Grains,
  Inventory,
  Orders,
  Login,
  Signup,
};

const AppRouter = () => {
  const isLoggedIn = authService.isLoggedIn();
  return (
    <Routes>
      {" "}
      {/* Auth routes (login/signup) */}
      {authRoutes.map((route) => {
        const Component = componentMap[route.component];
        return (
          <Route
            key={route.path}
            path={route.path}
            element={isLoggedIn ? <Navigate to="/" replace /> : <Component />}
          />
        );
      })}
      {/* Protected routes with layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Orders />} />
        {routes
          .filter((route) => route.path !== "/")
          .map((route) => {
            const Component = componentMap[route.component];
            return (
              <Route
                key={route.path}
                path={route.path.substring(1)}
                element={<Component />}
              />
            );
          })}
      </Route>
      {/* Catch-all route for 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
