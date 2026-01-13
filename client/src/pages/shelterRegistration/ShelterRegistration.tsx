import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";

/**
 * --------------------------------------------
 * ShelterRegistrationPage Component
 * --------------------------------------------
 * Handles shelter registration:
 * - Collects username, email, password, confirmPassword
 * - Shelter-specific info: shelterName, county, address, phoneNumber
 * - Fetches counties from backend for dropdown
 * - Basic client-side validation (password match)
 * - Sends POST request to /shelters endpoint
 * - Displays success/error alerts
 * - Redirects to login after success
 */
interface County {
  id: number;
  countyName: string;
}

const ShelterRegistrationPage: React.FC = () => {
  // -----------------------------
  // Local form state
  // -----------------------------
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    shelterName: "",
    countyId: "",
    address: "",
    phoneNumber: "",
  });

  // -----------------------------
  // Counties for dropdown
  // -----------------------------
  const [counties, setCounties] = useState<County[]>([]);

  // -----------------------------
  // UI feedback state
  // -----------------------------
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  // -----------------------------
  // Fetch counties from backend
  // -----------------------------
  useEffect(() => {
    fetch("/counties")
      .then((res) => res.json())
      .then((data) => setCounties(data))
      .catch((err) => console.error(err));
  }, []);

  // -----------------------------
  // Handle input changes
  // -----------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const { name, value } = e.target;

    // Convert countyId to number for backend
    setFormData((prev) => ({
      ...prev,
      [name]: name === "countyId" ? Number(value) : value,
    }));
  };

  // -----------------------------
  // Handle form submission
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("/shelters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (!res.ok) setError(data.error || "Registration failed");
      else {
        setSuccess("Shelter registered successfully!");
        // Redirect to shelter login after 1.5s
        setTimeout(() => navigate("/login/shelter"), 1500);
      }
    } catch (err) {
      console.error(err);
      setError("Internal server error");
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    // -----------------------------
    // Navbar wrapper
    // -----------------------------
    // Provides consistent navigation/header
    <Navbar>
      {/*-----------------------------
      // Centered container
      // ----------------------------- */}
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        {/* Paper elevates the form visually */}
        <Paper elevation={4} sx={{ p: 4 }}>
          {/*-----------------------------
          // Form Header
          // ----------------------------- */}
          <Box textAlign="center" mb={3}>
            <Typography variant="h5">Shelter Registration</Typography>
          </Box>

          {/*------------------------------
          // Error / Success Alerts
          // -----------------------------*/}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {success}
            </Alert>
          )}

          {/*-----------------------------
          // Registration Form
          // ----------------------------- */}
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {/* Username */}
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                fullWidth
              />

              {/* Email */}
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
              />

              {/* Shelter Name */}
              <TextField
                label="Shelter Name"
                name="shelterName"
                value={formData.shelterName}
                onChange={handleChange}
                required
                fullWidth
              />

              {/* County dropdown */}
              <FormControl fullWidth required>
                <InputLabel>County</InputLabel>
                <Select
                  name="countyId"
                  value={formData.countyId}
                  onChange={handleChange}
                >
                  {counties.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.countyName}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Address */}
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                fullWidth
              />

              {/* Phone Number */}
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                fullWidth
              />

              {/* Password */}
              <TextField
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
              />

              {/* Confirm Password */}
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                fullWidth
              />
              {/* Submit button */}
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2 }}
              >
                Register
              </Button>
            </Stack>
          </Box>

          {/*-----------------------------
          // Redirect link for existing shelters
          // ----------------------------- */}
          <Box mt={3} textAlign="center">
            <Typography variant="body2">
              Already have an account?{" "}
              <Link to="/login/shelter">Login here</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Navbar>
  );
};

export default ShelterRegistrationPage;
