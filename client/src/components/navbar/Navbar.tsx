import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  onSignInClick?: () => void; // <-- handler for opening sign-in modal
}

const drawerWidth = 240;

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const { authState, setAuthState } = useAuthContext();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // >= md shows top navbar
  const { mode, toggleTheme } = useThemeMode();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleLogout = () => {
    if (authState.userType === 'Shelter') sessionStorage.removeItem('accessShelterToken');
    else sessionStorage.removeItem('accessToken');

    setAuthState({ username: '', id: 0, userType: '', status: false });
    navigate('/');
  };

  // Navigation links based on role
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

  // Drawer content for mobile
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
      <Box>
        <List>
          {authState.status
            ? navLinks.map((link) => (
                <ListItemButton key={link.path} onClick={() => navigate(link.path)}>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              ))
            : [
                <ListItemButton key="sign-in" onClick={() => navigate('/')}>
                  <ListItemText primary="Sign In" />
                </ListItemButton>,
                <ListItemButton key="register-user" onClick={() => navigate('/registration')}>
                  <ListItemText primary="Register User" />
                </ListItemButton>,
                <ListItemButton key="register-shelter" onClick={() => navigate('/shelter/registration')}>
                  <ListItemText primary="Register Shelter" />
                </ListItemButton>,
              ]}
        </List>
      </Box>

      {authState.status && (
        <Box sx={{ mb: 1 }}>
          <List>
            <ListItemButton onClick={handleLogout}>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <CssBaseline />

      {/* Desktop Top Navbar */}
      {isDesktop && (
        <AppBar position="static">
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h5">DogoHome 🐶</Typography>

              {authState.status &&
                navLinks.map((link) => (
                  <Button key={link.path} color="inherit" onClick={() => navigate(link.path)}>
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
                  <Typography>Welcome, {authState.username} 🏠🐾</Typography>
                  <Button color="inherit" onClick={handleLogout}>
                    Logout
                  </Button>
                </>
              ) : (
                <Button variant="contained" onClick={() => navigate('/')}>
                  Sign In
                </Button>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Mobile Navbar */}
      {!isDesktop && (
        <AppBar position="fixed">
          <Toolbar>
            <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              DogoHome 🐶
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Mobile Drawer */}
      {!isDesktop && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth } }}
        >
          {drawer}
        </Drawer>
      )}

      {/* Page content */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: !isDesktop ? 7 : 0 }}>
        {children}
      </Box>
    </Box>
  );
};

export default Navbar;