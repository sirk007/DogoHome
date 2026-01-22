/**
 * --------------------------------------------
 * ShelterRegistrationPage
 * --------------------------------------------
 * Handles shelter registration:
 * - Collects shelter account details: username, email, password, address, phone, county
 * - Sends POST request to backend /register endpoint
 * - Displays success or error messages to the user
 * - Redirects to shelter login page after successful registration
 */

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
import Navbar from "../../components/layout/Navbar";
import type { ShelterCreationAttributes } from "../../types/shelter.types";
import { registerShelter } from "../../api/shelter.api";
import { IrishCounties } from "../../types/counties.types";
import type { SelectChangeEvent } from "@mui/material";

const ShelterRegistrationPage: React.FC = () => {
  const navigate = useNavigate();

  // -----------------------------
  // Local form state
  // -----------------------------
  // Tracks all input values that will be sent to the backend
  const [formData, setFormData] = useState<ShelterCreationAttributes>({
    username: "",
    password: "",
    email: "",
    shelterName: "",
    countyId: 1, // Default to first county
    address: "",
    phoneNumber: "",
  });

  // -----------------------------
  // UI feedback state (frontend only)
  // -----------------------------
  // confirmPassword is only used to verify user input locally
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // -----------------------------
  // Handlers for input changes
  // -----------------------------

  // Handles changes for text-based inputs (username, email, address, etc.)
  // Updates the corresponding field in `formData`
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handles changes for select/dropdown inputs (county)
  // Converts value to number because backend expects numeric countyId
  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target;
    if (!name) return;

    setFormData((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  // -----------------------------
  // Form submission handler
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Check passwords match before sending API request
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Send registration data to backend
      await registerShelter(formData);

      // Show success message
      setSuccess("Shelter registered successfully!");

      // Redicrect to shelter login after 1.5 seconds
      setTimeout(() => navigate("/login/shelter"), 1500);
    } catch (err: any) {
      // Display error returned from backed or generic feedback
      setError(err?.response?.data?.error || "Registration failed");
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <Navbar>
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Paper elevation={4} sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            {/* Form title */}
            <Typography variant="h5">Shelter Registration</Typography>
          </Box>

          {/* Error / Success Alerts */}
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

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit} mt={2}>
            <Stack spacing={2}>
              {/* Username */}
              <TextField
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleTextChange}
                required
                fullWidth
              />

              {/* Password */}
              <TextField
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleTextChange}
                required
                fullWidth
              />

              {/* Confirm Password */}
              <TextField
                label="Confirm Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                fullWidth
              />

              {/* Email */}
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleTextChange}
                required
                fullWidth
              />

              {/* Shelter Name */}
              <TextField
                label="Shelter Name"
                name="shelterName"
                value={formData.shelterName}
                onChange={handleTextChange}
                required
                fullWidth
              />

              {/* County */}
              <FormControl fullWidth required>
                <InputLabel>County</InputLabel>
                <Select
                  name="countyId"
                  value={formData.countyId}
                  onChange={handleSelectChange}
                >
                  {IrishCounties.map((county, idx) => (
                    <MenuItem key={county} value={idx + 1}>
                      {county}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Address */}
              <TextField
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleTextChange}
                required
                fullWidth
              />

              {/* Phone Number */}
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleTextChange}
                required
                fullWidth
              />

              {/* Submit Button */}
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

          {/* Login Redirect Link */}
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
