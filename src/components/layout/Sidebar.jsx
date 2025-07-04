import React from "react";
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
} from "@mui/icons-material";

const drawerWidth = 240;

const Sidebar = () => {
  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/" },
    { text: "Users", icon: <People />, path: "/users" },
    { text: "Categories", icon: <Category />, path: "/categories" },
    { text: "Products", icon: <ShoppingCart />, path: "/products" },
    { text: "Inventory", icon: <Inventory />, path: "/inventory" },
    { text: "Orders", icon: <Receipt />, path: "/orders" },
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
