import React, { useState } from "react";
import {
  //LightModeOutlined,
  Menu as MenuIcon,
  ArrowDropDownOutlined,
  SettingsOutlined,
  Lock,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  AppBar,
  Box,
  Typography,
  Button,
  IconButton,
  Toolbar,
  useTheme,
  MenuItem,
  Menu,
} from "@mui/material";
import FlexBetween from "./FlexBetween";
import { useDispatch } from "react-redux";
import { setOpenLogin, logOut } from "../state/authSlice"; //setMode,
import profileImage from "assets/profile.jpeg";
import { useNavigate } from "react-router-dom";

const NavBar = ({ user, isSidebarOpen, setIsSidebarOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleLogout = () => {
    setAnchorEl(null);
    localStorage.removeItem("userDetails");
    dispatch(logOut());
    navigate("/dashboard");
  };
  const handleChangePassword = () => {
    setAnchorEl(null);
    navigate(`/changepassword/${user.login_id}`);
  };

  return (
    // <AppBar sx={{}},> will update backgroud color and shadowing of top menu bar ,
    // background: "#f0f0f0" for light color
    <AppBar
      sx={{
        position: "static",
        boxShadow: "snow",
        minHeight: "50px",
        maxHeight: "50px",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* LEFT SIDE */}
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon />
          </IconButton>
          <FlexBetween borderRadius="9px" gap="3rem" p="0.1rem 1.5rem">
            <Typography variant="h2" fontWeight="bold">
              iKart
            </Typography>
          </FlexBetween>

          {/* Search Text Box Start */}

          <Box
            display="flex"
            backgroundColor="#fffffff2"
            borderRadius="10px"
            marginBottom="6px"
          >
            {/*                     <InputBase type='text' sx={{ml:2,flex:1}} color="navy" placeholder="Search" 
                        onChange={(event) => {setSearchInput(event.target.value)
                        }}
                    /> */}

            <IconButton type="button" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>

          {/* End earch Text Box Start */}
        </FlexBetween>

        {/* RIGHT SIDE */}
        <FlexBetween gap="1.5rem">
          <IconButton>
            <SettingsOutlined />
          </IconButton>
          <FlexBetween>
            {!user ? (
              <Button
                color="inherit"
                startIcon={<Lock />}
                onClick={() => dispatch(setOpenLogin({ openLogin: true }))}
              >
                Login
              </Button>
            ) : (
              <>
                <Button
                  onClick={handleClick}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textTransform: "none",
                    gap: "1rem",
                  }}
                >
                  <Box
                    component="img"
                    alt="profile"
                    src={profileImage}
                    height="32px"
                    width="32px"
                    borderRadius="50%"
                    sx={{ objectFit: "cover" }}
                  />
                  <Box textAlign="left">
                    <Typography
                      fontWeight="bold"
                      fontSize="0.75rem"
                      sx={{ color: theme.palette.secondary[100] }}
                    >
                      {user.full_name}
                    </Typography>
                    <Typography
                      fontSize="0.65rem"
                      sx={{ color: theme.palette.secondary[200] }}
                    >
                      {user.user_phone}
                    </Typography>
                  </Box>
                  <ArrowDropDownOutlined
                    sx={{
                      color: theme.palette.secondary[300],
                      fontSize: "25px",
                    }}
                  />
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={isOpen}
                  onClose={handleLogout}
                  anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                  {/* <MenuItem>
                  <a onClick={() => navigate(`/changepassword/${user.login_id}`)}>Change Password</a>
                </MenuItem> */}
                  <MenuItem onClick={handleChangePassword}>
                    Change Password
                  </MenuItem>

                  <MenuItem onClick={handleLogout}>Log Out</MenuItem>
                </Menu>
              </>
            )}
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
