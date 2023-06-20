import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ChevronRightOutlined,
  HomeOutlined,
  ShoppingCartOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  PublicOutlined,
  PointOfSaleOutlined,
  HowToReg,
  AdminPanelSettingsOutlined,
  StorageOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";

const navItems = [
  {
    text: "Dashboard",
    icon: <HomeOutlined sx={{ color: "navy" }} />,
  },
  {
    text: "Client Facing",
    icon: null,
  },
  {
    icon: <ShoppingCartOutlined sx={{ color: "navy" }} />,
    text: "Programs",
  },
  { icon: <Groups2Outlined sx={{ color: "navy" }} />, text: "Projects" },
  { icon: <ReceiptLongOutlined sx={{ color: "navy" }} />, text: "Pipelines" },
  { icon: <PublicOutlined sx={{ color: "navy" }} />, text: "Tasks" },
  { icon: <PointOfSaleOutlined sx={{ color: "navy" }} />, text: "Connections" },
  { icon: <HowToReg sx={{ color: "navy" }} />, text: "Users" },
  {
    text: "Management",
    icon: null,
  },
  {
    text: "UserAccess",
    icon: <AdminPanelSettingsOutlined sx={{ color: "navy" }} />,
  },
  // {
  //   text: "Performance",
  //   icon: <TrendingUpOutlined sx={{ color: "navy" }}/>,
  // },
  { icon: <StorageOutlined sx={{ color: "navy" }} />, text: "configuration" },

  { icon: <HowToReg sx={{ color: "navy" }} />, text: "configuration_details" },
  {
    icon: <StorageOutlined sx={{ color: "navy" }} />,
    text: "configuration_options",
  },
];

const Sidebar = ({
  user,
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    setActive(pathname.substring(1).split("/")[0]);
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.secondary[200],
              backgroundColor: theme.palette.background.alt,
              boxSixing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            {/* m="1.5rem 2rem 2rem 3rem" */}
            <Box m="1.5rem 2rem 1rem 3rem">
              <FlexBetween color={theme.palette.secondary.main}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  {/* color={"#031530!important"} */}
                  <Typography
                    variant="h4"
                    fontWeight="bold"
                    color={"#031530!important"}
                  >
                    Menu
                  </Typography>
                </Box>
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon }) => {
                if (!icon) {
                  return (
                    /* Left Menu Prarent List Items header text color */
                    <Typography
                      key={text}
                      sx={{
                        m: "1.25rem 0 1rem 3rem",
                        fontSize: "16px",
                        color: "#074cb3",
                        fontWeight: "600",
                        fontStyle: "italic",
                      }}
                    >
                      {text}
                    </Typography>
                  );
                }

                // need to String Split, to find the text to match with menu text

                let lcText = text.toLowerCase();
                if (text.includes("/")) {
                  lcText = text.split("/")(0).toLowerCase();
                }
                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate(`/${lcText}`);
                        setActive(lcText);
                      }}
                      sx={{
                        backgroundColor:
                          active === lcText
                            ? theme.palette.secondary[300]
                            : "transparent",
                        color:
                          active === lcText
                            ? theme.palette.primary[600]
                            : theme.palette.secondary[100],
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color:
                            active === lcText
                              ? theme.palette.primary[600]
                              : theme.palette.secondary[200],
                        }}
                      >
                        {icon}
                      </ListItemIcon>

                      <ListItemText primary={text} />
                      {active === lcText && (
                        <ChevronRightOutlined sx={{ ml: "auto" }} />
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>

          {/*             <Box position="absolute" bottom="2rem">
              <Divider />
              <FlexBetween textTransform="none" gap="1rem" m="1.5rem 2rem 0 3rem">
                <Box
                  component="img"
                  alt="profile"
                  src={profileImage}
                  height="40px"
                  width="40px"
                  borderRadius="50%"
                  sx={{ objectFit: "cover" }}
                />
                <Box textAlign="left">
                  <Typography
                    fontWeight="bold"
                    fontSize="0.8rem"
                    sx={{ color: theme.palette.secondary[100] }}
                  >
                    {user.full_name}
                  </Typography>
                  <Typography
                    fontSize="0.6rem"
                    sx={{ color: theme.palette.secondary[200] }}
                  >
                    {user.user_phone}
                  </Typography>
                </Box>
                <SettingsOutlined
                  sx={{
                    color: theme.palette.secondary[300],
                    fontSize: "25px ",
                  }}
                />
              </FlexBetween>
            </Box> */}
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
