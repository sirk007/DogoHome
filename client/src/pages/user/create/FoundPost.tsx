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

/**
 * ==============================
 * FoundPost
 * ------------------------------
 * Form for users to report a found pet. Similar to LostPost but with type preset to "FOUND".
 *
 * Flow:
 * 1. Capture user input.
 * 2. Maintain reactive form state.
 * 3. Validate input on submit.
 * 4. Call API to create post.
 * 5. Navigate on success.
 * ==============================
 */
const FoundPost: React.FC = () => {
  /**
   * ============================================
   * NAVIGATION HOOK
   * --------------------------------------------
   * Enables redirect after successful creation.
   */
  const navigate = useNavigate();
  // ============================================

  /**
   * ============================================
   * REACTIVE FORM STATE
   * --------------------------------------------
   * Stores all input required to create a post.
   * Coordinates remain undefined until selected.
   */
  const [formData, setFormData] = useState<PostCreationAttributes>({
    title: "",
    postText: "",
    type: "FOUND",
    latitude: undefined,
    longitude: undefined,
  });
  // ============================================

  /**
   * ============================================
   * FEEDBACK STATE
   * --------------------------------------------
   * Controls error and success messaging.
   */
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * ============================================
   * INPUT HANDLER
   * --------------------------------------------
   * Updates form state on text input changes.
   * Pure state derivation. No side effects.
   */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // ============================================

  /**
   * ============================================
   * SUBMISSION HANDLER
   * --------------------------------------------
   * Validation Gate:
   * - Ensure title & description exist
   * - Ensure location is selected
   *
   * On success:
   * - Persist post
   * - Display confirmation
   * - Navigate after short delay
   */

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Required fields validation
    if (!formData.title || !formData.postText) {
      setError("Title and description are required.");
      return;
    }
    // Location validation
    if (formData.latitude === undefined || formData.longitude === undefined) {
      setError("Please select the location on the map.");
      return;
    }

    try {
      /**
       * ============================================
       * ASYNC CONVERGENCE
       * --------------------------------------------
       * Persist form data to backend.
       */
      await createPost({
        title: formData.title,
        postText: formData.postText,
        type: "FOUND",
        latitude: formData.latitude,
        longitude: formData.longitude,
      });

      setSuccess("Found pet post created successfully!");

      // Controlled navigation side-effect
      setTimeout(() => navigate("/user/posts"), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to create post");
    }
  };
  // ============================================

  return (
    /**
     * ============================================
     * REPRESENTATION LAYER
     * --------------------------------------------
     * Renders form inputs, map selector,
     * validation feedback, and submission control.
     * ============================================
     */
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Typography variant="h5" textAlign="center" mb={3}>
          Report Found Pet
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

            {/* ============================================
                LOCATION SELECTION
                --------------------------------------------
                Integrates MapSelector to capture spatial input.
                Updates latitude & longitude in form state.
                ============================================ */}
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

export default FoundPost;
