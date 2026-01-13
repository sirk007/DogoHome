import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Stack,
  Typography,
  Alert,
} from "@mui/material";
import { useAuthContext } from "../../context/AuthContext";
import { createAnimal } from "../../api/authShelterAnimals";

/**
 * ----------------------------
 * AnimalForm Component
 * ----------------------------
 * Form for shelters to add a new animal.
 * Handles:
 * - Form state
 * - File uploads
 * - API request to create animal
 * - Success/error feedback
 * - Optional callback to refresh list
 */
interface AnimalFormData {
  animal: string; // Type of animal (Dog, Cat, etc.)
  animalName: string;
  animalAge: string;
  animalHealth: string;
  animalDescription?: string;
  picture?: File | null;
}

interface Props {
  onAnimalCreated?: () => void; // Callback to refresh AnimalList
}

const AnimalForm: React.FC<Props> = ({ onAnimalCreated }) => {
  const { authState } = useAuthContext(); // Ensure shelter is logged in
  const [formData, setFormData] = useState<AnimalFormData>({
    animal: "",
    animalName: "",
    animalAge: "",
    animalHealth: "",
    animalDescription: "",
    picture: null,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handle input changes
   * - Handles both text fields and file upload
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "picture" && files)
      setFormData((prev) => ({ ...prev, picture: files[0] }));
    else setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Handle form submission
   * - Validates shelter auth
   * - Sends POST request to backend
   * - Displays success/error messages
   * - Resets form
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure user is a logged-in shelter
    if (!authState.token || authState.userType !== "Shelter") {
      setError("You must be logged in as a shelter to add animals.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      await createAnimal(formData, authState.token);
      setSuccess("Animal added successfully!");
      // Reset form
      setFormData({
        animal: "",
        animalName: "",
        animalAge: "",
        animalHealth: "",
        animalDescription: "",
        picture: null,
      });
      // Optional callback to refresh AnimalList
      onAnimalCreated?.();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to add animal");
    } finally {
      setLoading(false);
    }
  };
  // -----------------------------
  // Render
  // -----------------------------
  return (
    <Box sx={{ mb: 4 }}>
      {/* ------------------- Heading ------------------- */}
      <Typography variant="h6" mb={2}>
        Add a New Animal
      </Typography>

      {/* ------------------- Feedback ------------------- */}
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

      {/* ------------------- Form ------------------- */}
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          {/* Animal Type */}
          <TextField
            label="Animal Type"
            name="animal"
            value={formData.animal}
            onChange={handleChange}
            required
          />

          {/* Name */}
          <TextField
            label="Name"
            name="animalName"
            value={formData.animalName}
            onChange={handleChange}
            required
          />

          {/* Age */}
          <TextField
            label="Age"
            name="animalAge"
            value={formData.animalAge}
            onChange={handleChange}
            required
          />

          {/* Health Status */}
          <TextField
            label="Health Status"
            name="animalHealth"
            value={formData.animalHealth}
            onChange={handleChange}
            required
          />

          {/* Optional Description */}
          <TextField
            label="Description"
            name="animalDescription"
            value={formData.animalDescription}
            onChange={handleChange}
            multiline
            rows={3}
          />

          {/* Picture Upload */}
          <Button variant="contained" component="label">
            Upload Picture
            <input
              type="file"
              name="picture"
              hidden
              accept="image/*"
              onChange={handleChange}
            />
          </Button>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Animal"}
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default AnimalForm;
