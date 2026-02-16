import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Box } from "@mui/material";
import L from "leaflet";
import { fetchPosts } from "@api/post.api";
import type { Post } from "@models/post.types";
import CheckGreen from "@assets/CheckGreen.png";
import CheckRed from "@assets/CheckRed.png";

interface PostsResponse {
  listOfPosts: Post[];
  likedPosts: any[];
}

// --- Custom marker icons ---
const redIcon = new L.Icon({
  iconUrl: CheckRed,
  iconSize: [30, 50],
  iconAnchor: [15, 50],
  popupAnchor: [0, -50],
});

const greenIcon = new L.Icon({
  iconUrl: CheckGreen,
  iconSize: [30, 50],
  iconAnchor: [15, 50],
  popupAnchor: [0, -50],
});

const MapView: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const lostData: PostsResponse = await fetchPosts("LOST");
        const foundData: PostsResponse = await fetchPosts("FOUND");
        // Merge LOST + FOUND
        setPosts([...lostData.listOfPosts, ...foundData.listOfPosts]);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    loadPosts();
  }, []);

  return (
    <Box
      sx={{
        height: "100%",
        width: "100%",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <MapContainer
        center={[53.35, -6.26]} // Dublin default
        zoom={8}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {posts
          .filter(
            (post) =>
              post.latitude !== undefined &&
              post.latitude !== null &&
              post.longitude !== undefined &&
              post.longitude !== null,
          )
          .map((post) => (
            <Marker
              key={post.id}
              position={[post.latitude!, post.longitude!]}
              icon={post.type === "LOST" ? redIcon : greenIcon}
            >
              <Popup>
                <strong>{post.title}</strong>
                <br />
                {post.postText}
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </Box>
  );
};

export default MapView;
