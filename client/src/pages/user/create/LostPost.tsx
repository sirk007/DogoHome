import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { createPost } from "@api/post.api";
import type { PostCreationAttributes } from "@models/post.types";
import MapSelector from "@components/maps/MapSelector";

const LostPost: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<PostCreationAttributes>({
    title: "",
    postText: "",
    type: "LOST",
    latitude: undefined,
    longitude: undefined,
  });

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!formData.title || !formData.postText) {
      setError("Title and description are required.");
      return;
    }

    if (formData.latitude === undefined || formData.longitude === undefined) {
      setError("Please select the location on the map.");
      return;
    }

    try {
      // 🔥 Send plain JSON object
      await createPost({
        title: formData.title,
        postText: formData.postText,
        type: "LOST",
        latitude: formData.latitude,
        longitude: formData.longitude,
      });

      setSuccess("Lost pet post created successfully!");
      setTimeout(() => navigate("/user/posts"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create post");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography variant="h5" textAlign="center" mb={3}>
          Report Lost Pet
        </Typography>

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

        <Box component="form" onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <TextField
              label="Description"
              name="postText"
              value={formData.postText}
              onChange={handleChange}
              multiline
              rows={4}
              required
            />

            {/* Map selector */}
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Select Location on Map
              </Typography>

              <MapSelector
                onSelect={(lat, lng) =>
                  setFormData((prev) => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng,
                  }))
                }
              />

              {/* ✅ Proper undefined check (fixes 0,0 bug) */}
              {formData.latitude !== undefined &&
                formData.longitude !== undefined && (
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Selected: {formData.latitude.toFixed(5)},{" "}
                    {formData.longitude.toFixed(5)}
                  </Typography>
                )}
            </Box>

            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
};

export default LostPost;
