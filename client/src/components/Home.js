import { Typography, Box, useTheme } from "@mui/material";

const Home = () => {
  const theme = useTheme();
  return (
    <Box m="1.5rem 2.5rem">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography
          variant="h2"
          color={theme.palette.secondary[100]}
          fontWeight="bold"
          sx={{ mb: "5px " }}
        >
          Home Page
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;
