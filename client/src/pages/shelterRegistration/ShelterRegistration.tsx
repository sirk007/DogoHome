import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import Navbar from '../../components/navbar/Navbar'

interface County {
  id: number;
  countyName: string;
}

const ShelterRegistrationPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    shelterName: '',
    countyId: '',
    address: '',
    phoneNumber: '',
  });

  const [counties, setCounties] = useState<County[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch counties from backend
  useEffect(() => {
    fetch('/counties')
      .then(res => res.json())
      .then(data => setCounties(data))
      .catch(err => console.error(err));
  }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const { name, value } = e.target;

    // Convert countyId to number if needed
    setFormData(prev => ({
        ...prev,
        [name]: name === 'countyId' ? Number(value) : value,
    }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch('/shelters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) setError(data.error || "Registration failed");
      else {
        setSuccess("Shelter registered successfully!");
        setTimeout(() => navigate('/login/shelter'), 1500);
      }
    } catch (err) {
      console.error(err);
      setError("Internal server error");
    }
  };

  return (
    <Navbar>
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Paper elevation={4} sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <Typography variant="h5">Shelter Registration</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                fullWidth
              />

              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
              />

              <TextField
                label="Shelter Name"
                name="shelterName"
                value={formData.shelterName}
                onChange={handleChange}
                required
                fullWidth
              />

              <FormControl fullWidth required>
                <InputLabel>County</InputLabel>
                <Select
                  name="countyId"
                  value={formData.countyId}
                  onChange={handleChange}
                >
                  {counties.map(c => (
                    <MenuItem key={c.id} value={c.id}>{c.countyName}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                fullWidth
              />

              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                fullWidth
              />

              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
              />

              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                fullWidth
              />

              <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
                Register
              </Button>
            </Stack>
          </Box>

          <Box mt={3} textAlign="center">
            <Typography variant="body2">
              Already have an account? <Link to="/login/shelter">Login here</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Navbar>
  );
};

export default ShelterRegistrationPage;