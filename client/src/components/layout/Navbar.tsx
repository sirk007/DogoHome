import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Button,
  CssBaseline,
  Typography,
  IconButton,
  Toolbar,
  AppBar,
  Switch,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { useAuthContext } from "../../context/AuthContext";
import { useThemeMode } from "../../theme/ThemeProvider";
import { useModalContext } from "../../context/ModalContext";

const drawerWidth = 240;

const Navbar: React.FC = () => {
  const { authState, setAuthState, loading } = useAuthContext();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { mode, toggleTheme } = useThemeMode();
  const { openLogin } = useModalContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const handleLogout = () => {
    if (authState.userType === "Shelter")
      sessionStorage.removeItem("accessShelterToken");
    else sessionStorage.removeItem("accessToken");

    setAuthState({ username: "", id: 0, userType: "", status: false });
    navigate("/");
  };

  if (loading || !authState.status) return null; // Don't render navbar until auth is checked

  // Role-based links
  let navLinks: { label: string; path: string }[] = [];
  switch (authState.userType) {
    case "User":
      navLinks = [
        { label: "Dashboard", path: "/user" },
        { label: "My Posts", path: "/user/posts" },
        { label: "Profile", path: "/user/profile" },
      ];
      break;
    case "Shelter":
      navLinks = [
        { label: "Dashboard", path: "/shelter" },
        { label: "Animals", path: "/shelter/animals/add" },
        { label: "Adoptions", path: "/shelter/profile" },
        { label: "Appointments", path: "/shelter/profile" },
        { label: "Volunteers", path: "/shelter/profile" },
        { label: "Donations", path: "/shelter/profile" },
        { label: "Reports", path: "/shelter/profile" },
        { label: "Settings", path: "/shelter/profile" },
      ];
      break;
    case "Admin":
      navLinks = [
        { label: "Dashboard", path: "/admin" },
        { label: "Manage Users", path: "/admin/users" },
        { label: "Reports", path: "/admin/reports" },
      ];
      break;
  }

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "space-between",
        px: 1,
      }}
    >
      <List>
        {navLinks.map((link) => (
          <ListItemButton key={link.path} component={Link} to={link.path}>
            <ListItemText primary={link.label} />
          </ListItemButton>
        ))}
      </List>
      <List>
        <ListItemButton onClick={handleLogout}>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Desktop permanent sidebar */}
      {isDesktop && (
        <Drawer
          variant="permanent"
          anchor="left"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography
              variant="h5"
              component={Link}
              to="/"
              sx={{ textDecoration: "none", color: "inherit" }}
            >
              DogoHome 🐶
            </Typography>
          </Box>
          {drawerContent}
          <Box sx={{ p: 2 }}>
            <LightModeIcon fontSize="small" />
            <Switch checked={mode === "dark"} onChange={toggleTheme} />
            <DarkModeIcon fontSize="small" />
          </Box>
        </Drawer>
      )}

      {/* Mobile AppBar + temporary drawer */}
      {!isDesktop && (
        <>
          <AppBar position="fixed">
            <Toolbar>
              <IconButton
                color="inherit"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{ ml: 2, textDecoration: "none", color: "inherit" }}
              >
                DogoHome 🐶
              </Typography>
            </Toolbar>
          </AppBar>

          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
          >
            {drawerContent}
          </Drawer>
        </>
      )}
    </Box>
  );
};

export default Navbar;
