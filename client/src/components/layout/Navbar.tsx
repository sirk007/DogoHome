import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Button,
  CssBaseline,
  useTheme,
  useMediaQuery,
  Switch,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";

import { useAuthContext } from "../../context/AuthContext";
import { useThemeMode } from "../../theme/ThemeProvider";
import { useModalContext } from "../../context/ModalContext";

const drawerWidth = 240;

const Navbar: React.FC = () => {
  const { authState, setAuthState } = useAuthContext();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const { mode, toggleTheme } = useThemeMode();
  const { openLogin } = useModalContext();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const handleLogout = () => {
    if (authState.userType === "Shelter") {
      sessionStorage.removeItem("accessShelterToken");
    } else {
      sessionStorage.removeItem("accessToken");
    }
    setAuthState({ username: "", id: 0, userType: "", status: false });
    navigate("/");
  };

  /* ================= ROLE-BASED NAV LINKS ================= */
  let navLinks: { label: string; path: string }[] = [];

  if (authState.status) {
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
          { label: "Animals", path: "/shelter/animals" },
          { label: "Profile", path: "/shelter/profile" },
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
  }

  /* ================= DRAWER CONTENT ================= */
  const drawer = (
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
        {authState.status ? (
          navLinks.map((link) => (
            <ListItemButton
              key={link.path}
              component={Link}
              to={link.path}
              onClick={() => setMobileOpen(false)}
            >
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))
        ) : (
          <>
            <ListItemButton
              onClick={() => {
                openLogin("User");
                setMobileOpen(false);
              }}
            >
              <ListItemText primary="Sign In" />
            </ListItemButton>

            <ListItemButton component={Link} to="/registration">
              <ListItemText primary="Register User" />
            </ListItemButton>

            <ListItemButton component={Link} to="/shelter/registration">
              <ListItemText primary="Register Shelter" />
            </ListItemButton>
          </>
        )}
      </List>

      {authState.status && (
        <List>
          <ListItemButton onClick={handleLogout}>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </List>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      <CssBaseline />

      {/* ================= DESKTOP NAVBAR ================= */}
      {isDesktop && (
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: "space-between" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Typography
                variant="h5"
                sx={{ cursor: "pointer" }}
                component={Link}
                to="/"
              >
                DogoHome 🐶
              </Typography>
              {authState.status &&
                navLinks.map((link) => (
                  <Button
                    key={link.path}
                    color="inherit"
                    component={Link}
                    to={link.path}
                  >
                    {link.label}
                  </Button>
                ))}
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Theme toggle */}
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                <LightModeIcon fontSize="small" />
                <Switch checked={mode === "dark"} onChange={toggleTheme} />
                <DarkModeIcon fontSize="small" />
              </Box>

              {authState.status ? (
                <>
                  <Typography>Welcome, {authState.username}</Typography>
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="contained" onClick={() => openLogin("User")}>
                  Sign In
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* ================= MOBILE APPBAR ================= */}
      {!isDesktop && (
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
              sx={{ ml: 2, cursor: "pointer" }}
              component={Link}
              to="/"
            >
              DogoHome 🐶
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* ================= MOBILE DRAWER ================= */}
      {!isDesktop && (
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
          {drawer}
        </Drawer>
      )}
    </Box>
  );
};

export default Navbar;
