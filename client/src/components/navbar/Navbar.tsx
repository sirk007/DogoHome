import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { useAuthContext } from '../../context/AuthContext';
import { useThemeMode } from '../../theme/ThemeProvider';

interface NavbarProps {
  children?: React.ReactNode;
  onSignInClick?: () => void; // 🔑 modal trigger from parent
}

const drawerWidth = 240;

const Navbar: React.FC<NavbarProps> = ({ children, onSignInClick }) => {
  const { authState, setAuthState } = useAuthContext();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const { mode, toggleTheme } = useThemeMode();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);

  const handleLogout = () => {
    if (authState.userType === 'Shelter') {
      sessionStorage.removeItem('accessShelterToken');
    } else {
      sessionStorage.removeItem('accessToken');
    }

    setAuthState({ username: '', id: 0, userType: '', status: false });
    navigate('/');
  };

  /* ================= ROLE-BASED NAV ================= */

  let navLinks: { label: string; path: string }[] = [];

  if (authState.status) {
    switch (authState.userType) {
      case 'User':
        navLinks = [
          { label: 'Dashboard', path: '/user' },
          { label: 'My Posts', path: '/user/posts' },
          { label: 'Profile', path: '/user/profile' },
        ];
        break;

      case 'Shelter':
        navLinks = [
          { label: 'Dashboard', path: '/shelter' },
          { label: 'Animals', path: '/shelter/animals' },
          { label: 'Add Animal', path: '/shelter/animals/add' },
          { label: 'Profile', path: '/shelter/profile' },
        ];
        break;

      case 'Admin':
        navLinks = [
          { label: 'Dashboard', path: '/admin' },
          { label: 'Manage Users', path: '/admin/users' },
          { label: 'Reports', path: '/admin/reports' },
        ];
        break;
    }
  }

  /* ================= MOBILE DRAWER ================= */

  const drawer = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        px: 1,
      }}
    >
      <List>
        {authState.status ? (
          navLinks.map((link) => (
            <ListItemButton
              key={link.path}
              onClick={() => {
                navigate(link.path);
                setMobileOpen(false);
              }}
            >
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))
        ) : (
          <>
            <ListItemButton
              onClick={() => {
                onSignInClick?.();
                setMobileOpen(false);
              }}
            >
              <ListItemText primary="Sign In" />
            </ListItemButton>

            <ListItemButton onClick={() => navigate('/registration')}>
              <ListItemText primary="Register User" />
            </ListItemButton>

            <ListItemButton onClick={() => navigate('/shelter/registration')}>
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />

      {/* ================= DESKTOP NAVBAR ================= */}
      {isDesktop && (
        <AppBar position="static">
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5">DogoHome 🐶</Typography>

              {authState.status &&
                navLinks.map((link) => (
                  <Button
                    key={link.path}
                    color="inherit"
                    onClick={() => navigate(link.path)}
                  >
                    {link.label}
                  </Button>
                ))}
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {/* Theme toggle */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <LightModeIcon fontSize="small" />
                <Switch checked={mode === 'dark'} onChange={toggleTheme} />
                <DarkModeIcon fontSize="small" />
              </Box>

              {authState.status ? (
                <>
                  <Typography>
                    Welcome, {authState.username}
                  </Typography>
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="contained" onClick={onSignInClick}>
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
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ ml: 2 }}>
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
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {/* ================= PAGE CONTENT ================= */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: !isDesktop ? 7 : 0 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Navbar;