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
import Navbar from "../../components/layout/Navbar";

/**
 * --------------------------------------------
 * UserRegistrationPage
 * --------------------------------------------
 * Handles user registration flow:
 * - Collects username, email, age, password, confirmPassword
 * - Basic client-side validation (password match)
 * - Sends POST request to /users endpoint
 * - Displays success or error alerts
 * - Redirects to login page after successful registration
 */
interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  age: string;
}

const UserRegistrationPage: React.FC = () => {
  // -----------------------------
  // Local form state
  // -----------------------------
  const [formData, setFormData] = useState<FormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    age: "",
  });

  // -----------------------------
  // Local UI state
  // -----------------------------
  const [error, setError] = useState<string | null>(null); // stores errors
  const [success, setSuccess] = useState<string | null>(null); // stores success message

  const navigate = useNavigate(); // redirect after successful registration

  // -----------------------------
  // Handle input change
  // -----------------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // -----------------------------
  // Handle form submit
  // -----------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // -----------------------------
    // Client-side validation
    // -----------------------------
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    try {
      // -----------------------------
      // Send POST request to backend
      // -----------------------------
      const res = await fetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      // Handle API response
      if (!res.ok) {
        setError(data.error || "Registration Failed");
      } else {
        setSuccess("User registered successfully!");
        // Redirect to login after 1.5 seconds delay
        setTimeout(() => navigate("/login/user"), 1500);
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
    // Navbar wraps the page
    // -----------------------------
    // Provides consistent navigation across the app.
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
            <Typography variant="h5" gutterBottom>
              User Registration
            </Typography>
          </Box>

          {/*-----------------------------
            // Error / Success Alerts
            // ----------------------------- */}
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

              {/* Age */}
              <TextField
                label="Age"
                name="age"
                type="text"
                value={formData.age}
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
            // Redirect link for existing users
            // ----------------------------- */}
          <Box mt={3} textAlign="center">
            <Typography variant="body2">
              Already have an account?
              <Link to="/login">Login here</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Navbar>
  );
};

export default UserRegistrationPage;
