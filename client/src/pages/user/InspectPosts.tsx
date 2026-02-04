import React from "react";
import { Box, Typography, Card, CardContent, Chip, Stack } from "@mui/material";

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
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* ================= LEFT: POSTS ================= */}
      <Box
        sx={{
          width: "50%",
          borderRight: "1px solid",
          borderColor: "divider",
          p: 2,
          overflowY: "auto",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Recent Sightings
        </Typography>

        <Stack spacing={2}>
          {mockPosts.map((post) => (
            <Card key={post.id} variant="outlined">
              <CardContent>
                <Typography variant="h6">{post.title}</Typography>
                <Typography variant="body2" color="text.secondary" mb={1}>
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

      {/* ================= RIGHT: MAP ================= */}
      <Box
        sx={{
          width: "50%",
          p: 2,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Map View
        </Typography>

        {/* Map placeholder */}
        <Box
          sx={{
            flexGrow: 1,
            borderRadius: 2,
            bgcolor: "grey.200",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <Typography color="text.secondary">
            GPS based map with pins (mock)
          </Typography>

          {/* Mock pins */}
          <Box
            sx={{
              position: "absolute",
              top: "30%",
              left: "40%",
              width: 12,
              height: 12,
              bgcolor: "error.main",
              borderRadius: "50%",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "55%",
              left: "60%",
              width: 12,
              height: 12,
              bgcolor: "error.main",
              borderRadius: "50%",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: "45%",
              left: "25%",
              width: 12,
              height: 12,
              bgcolor: "error.main",
              borderRadius: "50%",
            }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InspectPosts;
