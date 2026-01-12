import React from 'react';
import Navbar from '../../../components/navbar/Navbar';
import { Typography, Box, Paper, Button } from '@mui/material';
import { useAuthContext } from '../../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const UserLandingPage: React.FC = () => {
  const { authState, setAuthState } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('accessToken');
    setAuthState({ username: '', id: 0, userType: '', status: false });
    navigate('/');
  };

  return (
    <Navbar>
      <Box sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          Welcome, {authState.username} 👋
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 3,
            mt: 2,
          }}
        >
          {/* Example dashboard cards */}
          <Paper sx={{ flex: '1 1 300px', p: 3, minWidth: 250 }}>
            <Typography variant="h6">My Profile</Typography>
            <Button variant="contained" size="small">
              Edit Profile
            </Button>
          </Paper>
          <Paper sx={{ flex: '1 1 300px', p: 3, minWidth: 250 }}>
            <Typography variant="h6">My Posts</Typography>
            <Button variant="contained" size="small">
              View Posts
            </Button>
          </Paper>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Button
            variant="outlined"
            color="error"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Navbar>
  );
};

export default UserLandingPage;