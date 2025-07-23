# Router Documentation

## Overview

The router system provides a centralized way to manage application routes, navigation, and route-related utilities.

## Structure

```
src/router/
├── index.js          # Main exports
├── AppRouter.jsx     # Main router component
├── routeConfig.js    # Route configuration
└── routerUtils.js    # Navigation utilities and hooks
```

## Files

### `AppRouter.jsx`

Main router component that renders all application routes using React Router.

### `routeConfig.js`

Contains route configuration with metadata:

- `routes`: Array of all route objects
- `getNavigationRoutes()`: Returns routes for navigation (excludes hidden routes)
- `getRouteByPath(path)`: Get route object by path

Route object structure:

```javascript
{
  path: "/users",
  name: "Users",
  icon: "People",
  component: "Users",
  hidden: false // optional
}
```

### `routerUtils.js`

Utility functions and hooks for navigation:

#### Hooks

- `useCurrentRoute()`: Get current route information
- `useAppNavigation()`: Navigation helper methods

#### Functions

- `isActiveRoute(currentPath, targetPath)`: Check if route is active
- `generateBreadcrumbs(pathname)`: Generate breadcrumbs for current route

## Usage Examples

### Basic Navigation

```jsx
import { useAppNavigation } from "../router";

const MyComponent = () => {
  const { goToUsers, goBack } = useAppNavigation();

  return (
    <div>
      <button onClick={goToUsers}>Go to Users</button>
      <button onClick={goBack}>Go Back</button>
    </div>
  );
};
```

### Current Route Information

```jsx
import { useCurrentRoute } from "../router";

const PageHeader = () => {
  const { title, icon } = useCurrentRoute();

  return (
    <h1>
      <Icon>{icon}</Icon>
      {title}
    </h1>
  );
};
```

### Navigation Menu

```jsx
import { getNavigationRoutes, isActiveRoute } from "../router";
import { useLocation } from "react-router-dom";

const NavigationMenu = () => {
  const location = useLocation();
  const routes = getNavigationRoutes();

  return (
    <nav>
      {routes.map((route) => (
        <NavLink
          key={route.path}
          to={route.path}
          className={
            isActiveRoute(location.pathname, route.path) ? "active" : ""
          }
        >
          {route.name}
        </NavLink>
      ))}
    </nav>
  );
};
```

### Adding New Routes

1. Add to `routeConfig.js`:

```javascript
{
  path: "/new-page",
  name: "New Page",
  icon: "NewIcon",
  component: "NewPage",
}
```

2. Add component to `AppRouter.jsx` componentMap:

```javascript
import NewPage from "../pages/NewPage";

const componentMap = {
  // ... existing components
  NewPage,
};
```

3. Add navigation method to `routerUtils.js` (optional):

```javascript
const goToNewPage = () => {
  navigate("/new-page");
};
```

## Benefits

1. **Centralized Route Management**: All routes defined in one place
2. **Type Safety**: Route configuration provides structure
3. **Reusable Navigation**: Helper hooks and functions
4. **Metadata Support**: Routes include names, icons, etc.
5. **Easy to Extend**: Simple to add new routes and features
6. **404 Handling**: Proper NotFound page
7. **Navigation Utilities**: Breadcrumbs, active route detection

## Integration with Sidebar/Navigation

The router configuration can be used to automatically generate navigation menus:

```jsx
import { getNavigationRoutes } from "../router";

const Sidebar = () => {
  const navigationRoutes = getNavigationRoutes();

  return (
    <aside>
      {navigationRoutes.map((route) => (
        <SidebarItem key={route.path} route={route} />
      ))}
    </aside>
  );
};
```
