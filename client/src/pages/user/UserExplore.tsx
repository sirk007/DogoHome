/* Purpose - Discovery page. Users come here to look around

 Features inside Explore:

 Toggle or tabls 
 - Animals
 - Sightings / Posts

Filter Controls:
 - County
 - Radius
 - Species
 - Age
 - Size
 - Good with kids
 - Good with other pets

Result list:
 - Animal cards or post cards (Still to be considered Grid not working)
 - Scrollable list

Map:
 - GPS-based map
 - Pins for animals or sightings
 - Clicking a pin highlights the card

Actions:
 - View animal profile
 - View post details
 - Save animal / post

DO NOT BELONG HERE:
 - User's own posts
 - Editing / deleting
 - Profile Settings
**/

import React from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";

const UserExplore: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100vh",
      }}
    >
      {/* Top Toggle / Tabs */}
      <Box
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          bgcolor: "rgba(0,0,0, 0.8)",
        }}
      >
        <Tabs value={0}>
          <Tab label="Animals" />
          <Tab label="Sightings / Posts" />
        </Tabs>
      </Box>

      {/* Main content */}
      <Box
        sx={{
          display: "flex",
          flex: 1,
          overflow: "hidden",
        }}
      >
        {/* Filters */}
        <Box
          sx={{
            width: 280,
            borderRight: 1,
            borderColor: "divider",
            bgcolor: "rgba(0,0,0, 0.2)",
            p: 2,
            overflowY: "auto",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>

          {/* Filters go here */}
          {/* County, Radius, Species, Age, Size, etc. */}
        </Box>

        {/* Results list */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            overflowY: "auto",
            bgcolor: "rgba(0,0,0, 0.4)",
          }}
        >
          <Typography variant="h6" gutterBottom>
            Results
          </Typography>

          {/* Animal cards or Post cards go here */}
          {/* Scrollable list */}
        </Box>

        {/* Map */}
        <Box
          sx={{
            width: "35%",
            borderLeft: 1,
            borderColor: "divider",
            bgcolor: "rgba(0,0,0, 0.6)",
          }}
        >
          {/* Map component goes here */}
        </Box>
      </Box>
    </Box>
  );
};

export default UserExplore;
