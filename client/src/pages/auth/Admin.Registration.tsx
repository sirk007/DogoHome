/**
 * --------------------------------------------
 * AdminRegistrationPage
 * --------------------------------------------
 * Handles admin registration:
 * - Collects admin account details: username, email, password
 * - Sends POST request to backend /register endpoint
 * - Displays success or error messages to the admin user
 * - Redirects to admin login page after successful registration
 */

import React, { useState } from "react";
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Alert,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import type { AdminCreationAttributes } from "../../types/admin.types";
import { registerAdmin } from "../../api/admin.api";

const AdminRegistrationPage: React.FC = () => {
  const navigate = useNavigate();

  // -----------------------------
  // Local form state
  // -----------------------------
  // Tracks all input values that will be sent to the backend
  const [formData, setFormData] = useState<AdminCreationAttributes>({
    username: "",
    password: "",
    email: "",
  });

  // -----------------------------
  // UI feedback state (frontend only)
  // -----------------------------
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // -----------------------------
  // Handlers for input changes
  // -----------------------------
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // -----------------------------
  // Form submission handler
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError(null);
    setSuccess(null);

    // Validate passwords match before sending request
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      // Send registration data to backend
      await registerAdmin(formData);

      // Show success message
      setSuccess("Admin registered successfully!");

      // Redirect to admin login page
      setTimeout(() => navigate("/login/admin"), 1500);
    } catch (err: any) {
      // Display backend error or generic fallback
      setError(err?.response?.data?.error || "Registration failed");
    }
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Box textAlign="center" mb={3}>
          <Typography variant="h5">Admin Registration</Typography>
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

            {/* Submit Button */}
            <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
              Register
            </Button>
          </Stack>
        </Box>

        {/* Login Redirect */}
        <Box mt={3} textAlign="center">
          <Typography variant="body2">
            Already have an account? <Link to="/login/admin">Login here</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default AdminRegistrationPage;
