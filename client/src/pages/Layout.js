import React, { useState, useEffect } from "react";
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectCurrentToken, selectCurrentUser } from "state/authSlice";
import NavBar from "components/NavBar";
import Sidebar from "components/Sidebar";
import Login from "components/Login";
import Home from "components/Home";

const Layout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px");

  const user = useSelector(selectCurrentUser);
  const token = useSelector(selectCurrentToken);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(user ? true : false);
  }, [user]);

  return (
    <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
      {token ? (
        <>
          <Sidebar
            user={user}
            isNonMobile={isNonMobile}
            drawerWidth="250px"
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <Box flexGrow={1}>
            <Login />
            <NavBar
              user={user}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />
            <Outlet />
          </Box>
        </>
      ) : (
        <Box flexGrow={1}>
          <Login />
          <NavBar
            user={user}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          <Home />
        </Box>
      )}
    </Box>
  );
};

export default Layout;
