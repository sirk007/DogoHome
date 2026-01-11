import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import LoginUser from '../userLogin/LoginUser';
import LoginShelter from '../shelterLogin/LoginShelter';
import { useThemeMode } from '../../theme/ThemeProvider';

import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Card,
  CardContent,
  CardActions,
  Modal,
  Divider,
  Switch,
} from '@mui/material';

import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

const LandingPage: React.FC = () => {
  const { mode, toggleTheme } = useThemeMode();

  const [signInOpen, setSignInOpen] = useState(false);
  const [loginType, setLoginType] = useState<'User' | 'Shelter'>('User');

  const randomDogs = [
    { id: 1, name: 'Buddy', shelter: 'Happy Tails' },
    { id: 2, name: 'Lucy', shelter: 'Paws & Co.' },
    { id: 3, name: 'Max', shelter: 'Furry Friends' },
    { id: 4, name: 'Bella', shelter: 'Safe Paws' },
    { id: 5, name: 'Charlie', shelter: 'Kind Hearts' },
    { id: 6, name: 'Daisy', shelter: 'Good Dogs Shelter' },
  ];

  return (
    <>
      {/* ================= HEADER (FULL WIDTH) ================= */}
      <Box sx={{ width: '100%', py: 3, bgcolor: 'background.default' }}>
        <Container
          maxWidth={false}
          sx={{
            mx: 'auto',
            px: 2,
            maxWidth: {
              xs: 600,
              sm: 900,
              md: 1200,
              lg: 1536,
            },
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h4">DogoHome 🐶</Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              {/* Theme toggle */}
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <LightModeIcon fontSize="small" />
                <Switch
                  checked={mode === 'dark'}
                  onChange={toggleTheme}
                  inputProps={{ 'aria-label': 'toggle dark mode' }}
                />
                <DarkModeIcon fontSize="small" />
              </Stack>

              <Button variant="contained" onClick={() => setSignInOpen(true)}>
                Sign In
              </Button>
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* ================= DOGS SECTION (FULL WIDTH) ================= */}
      <Box sx={{ width: '100%', py: { xs: 4, md: 6 }, bgcolor: 'background.default' }}>
        <Container
          maxWidth={false}
          sx={{
            mx: 'auto',
            px: 2,
            maxWidth: {
              xs: 600,
              sm: 900,
              md: 1200,
              lg: 1536,
            },
          }}
        >
          <Typography variant="h4" textAlign="center" gutterBottom>
            Meet Some Dogs Looking for a Home
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 2,
              justifyContent: 'center',
            }}
          >
            {randomDogs.map(dog => (
              <Card
                key={dog.id}
                sx={{
                  width: {
                    xs: '100%',
                    sm: 260,
                    md: 280,
                    lg: 300,
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6">{dog.name}</Typography>
                  <Typography variant="body2">
                    Shelter: {dog.shelter}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" variant="outlined">
                    View More
                  </Button>
                </CardActions>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ================= SIGN IN MODAL ================= */}
      <Modal open={signInOpen} onClose={() => setSignInOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: 400 },
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" textAlign="center" gutterBottom>
            Sign In
          </Typography>

          <Stack direction="row" spacing={2} justifyContent="center" mb={2}>
            <Button
              variant={loginType === 'User' ? 'contained' : 'outlined'}
              onClick={() => setLoginType('User')}
            >
              User
            </Button>

            <Button
              variant={loginType === 'Shelter' ? 'contained' : 'outlined'}
              onClick={() => setLoginType('Shelter')}
            >
              Shelter
            </Button>
          </Stack>

          <Divider sx={{ mb: 2 }} />

          {loginType === 'User' && <LoginUser />}
          {loginType === 'Shelter' && <LoginShelter />}

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
        </Box>
      </Modal>
    </>
  );
};

export default LandingPage;