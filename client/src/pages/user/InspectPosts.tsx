import React from "react";
import MapView from "../../components/maps/MapView";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Tabs,
  Tab,
} from "@mui/material";

// Dummy posts
const mockPosts = [
  {
    id: 1,
    title: "Dog spotted near Phoenix Park",
    description: "Medium-sized brown dog wandering near the main entrance.",
    location: "Dublin",
    time: "30 mins ago",
  },
  {
    id: 2,
    title: "Injured cat by roadside",
    description: "Small black cat hiding under a car, looks injured.",
    location: "Kildare",
    time: "2 hours ago",
  },
  {
    id: 3,
    title: "Loose puppy in housing estate",
    description: "Very friendly puppy, no collar.",
    location: "Meath",
    time: "Yesterday",
  },
];

const InspectPosts: React.FC = () => {
  return (
    <Box
      sx={{
        display: "flex",
        width: "100%",
        height: "100vh", // Full viewport
      }}
    >
      {/* LEFT PANEL */}
      <Box
        sx={{
          width: "50%",
          borderRight: 1,
          borderColor: "divider",
          p: 2,
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
          flexShrink: 0, // prevent collapsing
        }}
      >
        <Typography variant="h5" gutterBottom>
          Recent Sightings
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Tabs
            value={0}
            sx={{
              minHeight: 36,
              "& .MuiTab-root": { minHeight: 36, textTransform: "none" },
            }}
          >
            <Tab label="Found" />
            <Tab label="Lost" />
            <Tab label="Reported" />
          </Tabs>
        </Box>

        <Stack spacing={2}>
          {mockPosts.map((post) => (
            <Card key={post.id} variant="outlined">
              <CardContent>
                <Typography variant="h6">{post.title}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {post.description}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <Chip label={post.location} size="small" />
                  <Chip label={post.time} size="small" variant="outlined" />
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>

      {/* RIGHT PANEL */}
      <Box
        sx={{
          width: "50%",
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: "100%", // take full height
        }}
      >
        <Typography variant="h5" gutterBottom>
          Map View
        </Typography>

        {/* Map fills remaining space */}
        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
          <MapView />
        </Box>
      </Box>
    </Box>
  );
};

export default InspectPosts;
