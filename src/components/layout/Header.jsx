import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { LogoutOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.removeToken();
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          E-commerce Admin
        </Typography>
        <Box>
          <Button
            color="inherit"
            startIcon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
