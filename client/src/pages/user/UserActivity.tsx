/** Purpose: Everything user has done.

Features inside My Activity
 - Tabs
    - My Sightings
    - My Posts
 - Status indicators:
    - Pending
    - Resolved
 - Edit / Delete own posts
 - View post on map

 DOES NOT BELONG HERE
 - Browsing other users content
 - Searching for animals
 */
import React from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";

const UserActivity: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          px: 3,
          py: 2,
        }}
      >
        <Typography variant="h4" gutterBottom>
          My Activity
        </Typography>

        <Typography variant="subtitle1" color="text.secondary">
          Everything you’ve posted or reported.
        </Typography>
      </Box>

      {/* Tabs */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          px: 3,
        }}
      >
        <Tabs value={0}>
          <Tab label="My Sightings" />
          <Tab label="My Posts" />
        </Tabs>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          overflow: "hidden",
        }}
      >
        {/* Activity list */}
        <Box
          sx={{
            flex: 1,
            p: 3,
            overflowY: "auto",
          }}
        >
          {/* Status filters */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Status
            </Typography>

            {/* Status chips / toggles go here */}
            {/* Pending | Resolved */}
          </Box>

          {/* User cards list */}
          <Box>
            {/* My Sightings cards */}
            {/* My Posts cards */}
            {/* Each card supports:
                - Status indicator
                - Edit / Delete
                - View on map
            */}
          </Box>
        </Box>

        {/* Optional map preview */}
        <Box
          sx={{
            width: "35%",
            borderLeft: 1,
            borderColor: "divider",
            display: { xs: "none", md: "block" },
          }}
        >
          {/* Map showing selected post */}
        </Box>
      </Box>
    </Box>
  );
};

export default UserActivity;
