import React from "react";
import { Typography, Box, useTheme } from "@mui/material";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  return (
    <Box>
      <Typography
        variant="h2"
        color={theme.palette.secondary[100]}
        fontWeight="bold"
        sx={{ mb: "5px " }}
      >
        {title}
      </Typography>
      {/* theme.palette.secondary[300] */}
      <Typography
        variant="h6"
        color={"#800080"}
        fontWeight="bold"
        fontStyle={"italic"}
      >
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
