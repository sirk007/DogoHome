import React, { useState } from 'react';
import LoginUser from '../userLogin/LoginUser';
import LoginShelter from '../shelterLogin/LoginShelter';
import { Link } from 'react-router-dom';

import { useThemeMode } from '../../theme/ThemeProvider';
import {
  Container,
  Paper,
  Box,
  Typography,
  IconButton,
  Button,
  Stack,
} from '@mui/material';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const LandingPage = () => {
  const { mode, toggleTheme } = useThemeMode();
  const [loginType, setLoginType] = useState<'User' | 'Shelter'>('User');

  return (
    <>
      {/* Header & Theme Toggle (OUTSIDE container) */}
      <Box textAlign="center" mt={4}>
        <Typography variant="h4" gutterBottom>
          Welcome to DogoHome 🐶
        </Typography>

        <IconButton onClick={toggleTheme}>
          {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>

        {/* Login Type Toggle */}
        <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
          <Button
            variant={loginType === 'User' ? 'contained' : 'outlined'}
            onClick={() => setLoginType('User')}
          >
            User Login
          </Button>

          <Button
            variant={loginType === 'Shelter' ? 'contained' : 'outlined'}
            onClick={() => setLoginType('Shelter')}
          >
            Shelter Login
          </Button>
        </Stack>
      </Box>

      {/* Login Container (ONLY auth content) */}
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper elevation={4} sx={{ p: 4 }}>
          {loginType === 'User' && <LoginUser />}
          {loginType === 'Shelter' && <LoginShelter />}

          {/* Registration Links */}
          <Box mt={3} textAlign="center">
            {loginType === 'User' && (
              <Typography variant="body2">
                Don&apos;t have an account?{' '}
                <Link to="/registration">Register as User</Link>
              </Typography>
            )}

            {loginType === 'Shelter' && (
              <Typography variant="body2">
                Don&apos;t have an account?{' '}
                <Link to="/shelter/registration">Register as Shelter</Link>
              </Typography>
            )}
          </Box>
        </Paper>
      </Container>
      
    </>
  );
};

export default LandingPage;