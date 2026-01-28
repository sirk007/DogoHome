// ShelterProfileTest.tsx
import React from "react";
import { Box, Typography, Alert } from "@mui/material";

export default function ShelterProfileTest() {
  console.log(
    "%c[ShelterProfileTest] THIS COMPONENT IS ACTUALLY MOUNTING",
    "background: lime; color: black; font-size: 16px; padding: 8px;",
  );

  return (
    <Box sx={{ p: 6, bgcolor: "lightgreen", minHeight: "50vh" }}>
      <Alert severity="success" sx={{ mb: 4 }}>
        <Typography variant="h4">
          SUCCESS: This is the NEW test component
        </Typography>
      </Alert>

      <Typography variant="h5" gutterBottom>
        If you see this bright green box + lime console message,
      </Typography>
      <Typography variant="h6">
        then the route is working — the problem was in the original file or its
        import.
      </Typography>

      <Typography variant="body1" sx={{ mt: 4 }}>
        Original ShelterProfile.tsx is NOT being used right now.
      </Typography>
    </Box>
  );
}
