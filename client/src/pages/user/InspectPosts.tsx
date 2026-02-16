import React, { useState, useEffect } from "react";
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
import { fetchPosts } from "@api/post.api"; // use your API
import type { Post } from "@models/post.types";

const InspectPosts: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);

  const tabLabels = ["FOUND", "LOST", "SIGHTING"];

  // Fetch posts for all types on mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const foundData = await fetchPosts("FOUND");
        const lostData = await fetchPosts("LOST");
        const sightingData = await fetchPosts("SIGHTING");

        // merge all posts
        setPosts([
          ...foundData.listOfPosts,
          ...lostData.listOfPosts,
          ...sightingData.listOfPosts,
        ]);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    loadPosts();
  }, []);

  // Filter posts based on selected tab
  const filteredPosts = posts.filter(
    (post) => post.type === tabLabels[tabIndex],
  );

  return (
    <Box sx={{ display: "flex", width: "100%", height: "100vh" }}>
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
          flexShrink: 0,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Recent Posts
        </Typography>

        <Tabs
          value={tabIndex}
          onChange={(e, newIndex) => setTabIndex(newIndex)}
          sx={{
            minHeight: 36,
            "& .MuiTab-root": { minHeight: 36, textTransform: "none" },
            mb: 2,
          }}
        >
          <Tab label="Found" />
          <Tab label="Lost" />
          <Tab label="Reported" />
        </Tabs>

        <Stack spacing={2}>
          {filteredPosts.map((post) => (
            <Card key={post.id} variant="outlined">
              <CardContent>
                <Typography variant="h6">{post.title}</Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  {post.postText}
                </Typography>
                <Stack direction="row" spacing={1}>
                  {post.latitude && post.longitude && (
                    <Chip label="Location" size="small" />
                  )}
                  <Chip
                    label={new Date(post.createdAt).toLocaleString()}
                    size="small"
                    variant="outlined"
                  />
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
          height: "100%",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Map View
        </Typography>

        <Box sx={{ flexGrow: 1, minHeight: 0 }}>
          <MapView />
        </Box>
      </Box>
    </Box>
  );
};

export default InspectPosts;
