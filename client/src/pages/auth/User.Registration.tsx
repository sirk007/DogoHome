/**
 * --------------------------------------------
 * UserRegistrationPage
 * --------------------------------------------
 * Handles user registration:
 * - Collects User account details: username, email, password, address, preferences
 * - Sends POST request to backend /register endpoint
 * - Displays success or error messages to the user
 * - Redirects to user login page after successful registration
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
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import type { UserCreationAttributes } from "../../types/user.types";
import { registerUser } from "../../api/user.api";

const UserRegistrationPage: React.FC = () => {
  const navigate = useNavigate();

  // -----------------------------
  // Local form state
  // -----------------------------
  // Tracks all input values that will be sent to the backend
  const [formData, setFormData] = useState<UserCreationAttributes>({
    username: "",
    password: "",
    email: "",
    age: 0,
    activityLevel: "Medium",
    petExperienceLevel: "None",
    maxDogSize: "Medium",
    hasGarden: false,
    hasOtherPets: false,
    hasKids: false,
    preferredEnergyLevel: undefined,
    preferredAgeRangeMin: undefined,
    preferredAgeRangeMax: undefined,
  });

  // -----------------------------
  // UI feedback state
  // -----------------------------
  // confirmPassword is only used to verify user input locally
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null); // stores errors
  const [success, setSuccess] = useState<string | null>(null); // stores success message

  // -----------------------------
  // Handle input change
  // -----------------------------
  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "number" ? Number(value) : value === "" ? undefined : value,
    }));
  };

  const handleCheckbox =
    (key: keyof UserCreationAttributes) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setFormData((prev) => ({ ...prev, [key]: e.target.checked }));

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
      await registerUser(formData);
      // Show success message
      setSuccess("Account created successfully!");
      // Redicrect to shelter login after 1.5 seconds
      setTimeout(() => navigate("/login/user"), 1500);
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
          {/* Form title */}
          <Typography variant="h5" textAlign="center" mb={3}>
            User Registration
          </Typography>

          {/* Error / Success Alerts */}
          {error && <Alert severity="error">{error}</Alert>}
          {success && <Alert severity="success">{success}</Alert>}

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit} mt={2}>
            <Stack spacing={2}>
              <TextField
                label="Username"
                name="username"
                required
                onChange={handleTextChange}
              />
              <TextField
                label="Password"
                type="password"
                name="password"
                required
                onChange={handleTextChange}
              />
              <TextField
                label="Confirm Password"
                type="password"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                required
                onChange={handleTextChange}
              />
              <TextField
                label="Age"
                name="age"
                type="number"
                required
                onChange={handleTextChange}
              />

              <TextField
                select
                label="Activity Level"
                name="activityLevel"
                value={formData.activityLevel}
                onChange={handleTextChange}
              >
                {["Low", "Medium", "High"].map((v) => (
                  <MenuItem key={v} value={v}>
                    {v}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Pet Experience"
                name="petExperienceLevel"
                value={formData.petExperienceLevel}
                onChange={handleTextChange}
              >
                {["None", "Beginner", "Experience"].map((v) => (
                  <MenuItem key={v} value={v}>
                    {v}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="Max Dog Size"
                name="maxDogSize"
                value={formData.maxDogSize}
                onChange={handleTextChange}
              >
                {["Small", "Medium", "Large"].map((v) => (
                  <MenuItem key={v} value={v}>
                    {v}
                  </MenuItem>
                ))}
              </TextField>

              <FormControlLabel
                control={<Checkbox onChange={handleCheckbox("hasGarden")} />}
                label="Has Garden"
              />
              <FormControlLabel
                control={<Checkbox onChange={handleCheckbox("hasOtherPets")} />}
                label="Has Other Pets"
              />
              <FormControlLabel
                control={<Checkbox onChange={handleCheckbox("hasKids")} />}
                label="Has Kids"
              />

              <Button type="submit" variant="contained">
                Register
              </Button>
            </Stack>
          </Box>

          <Box mt={3} textAlign="center">
            <Typography variant="body2">
              Already have an account? <Link to="/login/user">Login</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Navbar>
  );
};

export default UserRegistrationPage;
