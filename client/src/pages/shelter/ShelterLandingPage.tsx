import React from "react";
import Navbar from "../../components/layout/Navbar";
import { Typography } from "@mui/material";

/**
 * --------------------------------------------
 * ShelterLandingPage Component
 * --------------------------------------------
 * Simple dashboard page for logged-in shelters.
 * - Wrapped in Navbar for consistent layout/navigation
 * - Displays a welcome title and basic instructions
 */

const ShelterLandingPage: React.FC = () => {
  return (
    <Navbar>
      {/* 1. Dashboard Title */}
      <Typography variant="h4" gutterBottom>
        Shelter Dashboard
      </Typography>

      {/* 2. Instructions / Info */}
      <Typography>
        Use the menu to manage animals, add new ones, or update your profile.
      </Typography>
    </Navbar>
  );
};

export default ShelterLandingPage;
