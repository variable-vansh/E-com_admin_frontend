import React from "react";
import { Box, CssBaseline } from "@mui/material";

const AuthLayout = ({ children }) => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "grey.50",
      }}
    >
      <CssBaseline />
      {children}
    </Box>
  );
};

export default AuthLayout;
