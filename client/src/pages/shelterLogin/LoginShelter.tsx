import React, { useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import { loginShelter } from '../../api/authShelter';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography } from '@mui/material';

const LoginShelter: React.FC = () => {
  const { setAuthState } = useAuthContext();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const res = await loginShelter(username, password);

      const token = res.data.token;
      if (!token) throw new Error('No token returned');

      // Clear any other tokens and save this one
      sessionStorage.clear();
      sessionStorage.setItem('accessShelterToken', token);

      // Update auth state (without storing token)
      setAuthState({
        username: res.data.username,
        id: res.data.id,
        userType: 'Shelter',
        status: true,
      });

      setError('');
      navigate('/shelter');
    } catch (err: any) {
      console.error('Login failed', err);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('accessShelterToken');
    setAuthState({ username: '', id: 0, userType: '', status: false });
  };

  return (
    <Box sx={{ maxWidth: 400, margin: '2rem auto', textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Shelter Login
      </Typography>

      <TextField
        label="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        fullWidth
        sx={{ mb: 2 }}
      />

      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

      <Box>
        <Button variant="contained" onClick={handleLogin} sx={{ mr: 1 }}>
          Login
        </Button>

        <Button variant="outlined" color="error" onClick={handleLogout}>
          Logout
        </Button>
      </Box>
    </Box>
  );
};

export default LoginShelter;