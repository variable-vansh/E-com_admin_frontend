import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
} from "@mui/material";
import { Link } from "react-router-dom";
import {
  Dashboard,
  People,
  Category,
  ShoppingCart,
  Inventory,
  Receipt,
  Campaign,
} from "@mui/icons-material";

import AgricultureIcon from "@mui/icons-material/Agriculture";

const drawerWidth = 240;

const Sidebar = () => {
  const menuItems = [
    { text: "Orders", icon: <Receipt />, path: "/" },
    { text: "Promotion", icon: <Campaign />, path: "/promos" },
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Grains", icon: <AgricultureIcon />, path: "/grains" },
    { text: "Categories", icon: <Category />, path: "/categories" },
    { text: "Products", icon: <ShoppingCart />, path: "/products" },
    { text: "Inventory", icon: <Inventory />, path: "/inventory" },
    { text: "Users", icon: <People />, path: "/users" },
  ];

  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <ListItemButton component={Link} to={item.path} key={item.text}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
