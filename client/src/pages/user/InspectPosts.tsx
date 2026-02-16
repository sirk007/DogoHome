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
import { fetchPosts } from "@api/post.api";
import type { Post } from "@models/post.types";

const InspectPosts: React.FC = () => {
  const [tabIndex, setTabIndex] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);

  const tabLabels = ["ALL", "FOUND", "LOST", "SIGHTING"];

  // Fetch posts once on mount
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const lostData = await fetchPosts("LOST");
        const foundData = await fetchPosts("FOUND");
        const sightingData = await fetchPosts("SIGHTING");

        setPosts([
          ...lostData.listOfPosts,
          ...foundData.listOfPosts,
          ...sightingData.listOfPosts,
        ]);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    loadPosts();
  }, []);

  // Filter posts based on selected tab
  const displayedPosts =
    tabLabels[tabIndex] === "ALL"
      ? posts
      : posts.filter((p) => p.type === tabLabels[tabIndex]);

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
          <Tab label="All" />
          <Tab label="Found" />
          <Tab label="Lost" />
          <Tab label="Reported" />
        </Tabs>

        <Stack spacing={2}>
          {displayedPosts.map((post) => (
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
          {/* Pass the current tab to MapView */}
          <MapView
            filterType={
              tabLabels[tabIndex] as "ALL" | "LOST" | "FOUND" | "SIGHTING"
            }
          />
        </Box>
      </Box>
    </Box>
  );
};

export default InspectPosts;
