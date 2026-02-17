import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Box } from "@mui/material";
import L from "leaflet";
import { fetchPosts } from "@api/post.api";
import type { Post } from "@models/post.types";
import CheckGreen from "@assets/CheckGreen.png";
import CheckRed from "@assets/CheckRed.png";
import CheckBlue from "@assets/CheckBlue.png";

/**
 * ============================================
 * DATA CONTRACT
 * --------------------------------------------
 * Defines the strucutre returned by the backend
 * when fetching posts. Serves as the boundary
 * between frontend and backend data models.
 */
interface PostsResponse {
  listOfPosts: Post[];
  likedPosts: any[];
}
// ============================================

/**
 * ============================================
 * STATIC LOGIC PRIMITIVES (Visual Identity)
 * ---------------------------------------------
 * Marker icons mapped to post types.
 * Created once at module load and re-used.
 */

// LOST -> Red marker
const redIcon = new L.Icon({
  iconUrl: CheckRed,
  iconSize: [30, 50],
  iconAnchor: [15, 50],
  popupAnchor: [0, -50],
});

// FOUND -> Green marker
const greenIcon = new L.Icon({
  iconUrl: CheckGreen,
  iconSize: [30, 50],
  iconAnchor: [15, 50],
  popupAnchor: [0, -50],
});

// SIGHTING -> Blue marker
const blueIcon = new L.Icon({
  iconUrl: CheckBlue,
  iconSize: [30, 50],
  iconAnchor: [15, 50],
  popupAnchor: [0, -50],
});
// ============================================

/**
 * ============================================
 * TYPE -> VISUAL RESOLUTION TABLE
 * --------------------------------------------
 * Maps post types to their marker icons.
 * Avoids conditional logic during render.
 *
 * Acts as a constant-time lookup table for visual representation.
 */
const iconMap: Record<string, L.Icon> = {
  LOST: redIcon,
  FOUND: greenIcon,
  SIGHTING: blueIcon,
};

interface MapViewProps {
  /**
   * Runtime constraint that determines which posts to display on the map.
   * Controls the filtering logic for posts based on their type.
   */
  filterType?: "ALL" | "LOST" | "FOUND" | "SIGHTING";
}
// ============================================

/**
 * ============================================
 * MapView
 * --------------------------------------------
 * Renders posts as markers on a Leaflet map.
 *
 * Responsibilities:
 * 1. Fetch post types (async divergence)
 * 2. Merge into unified dataset (convergence)
 * 3. Apply runtime filtering constraints
 * 4. Project valid posts onto the map surface.
 * ============================================
 */

const MapView: React.FC<MapViewProps> = ({ filterType = "ALL" }) => {
  /**
   * ============================================
   * REACTIVE MEMORY SURFACE
   * --------------------------------------------
   * Stores the merged post dataset after asynchronous fetching.
   * Initially empty until asynchronous resolution occurs.
   */
  const [posts, setPosts] = useState<Post[]>([]);
  // ============================================

  /**
   * ============================================
   * MOUNT PHASE -> DATA FETCH
   * ---------------------------------------------
   * Executes once.
   *
   * Three independent data streams are requested:
   * - LOST
   * - FOUND
   * - SIGHTING
   *
   * These streams resolve asynchronously and may complete in any order.
   */
  useEffect(() => {
    const loadPosts = async () => {
      try {
        // Divergent async requests for each post type
        const lostData: PostsResponse = await fetchPosts("LOST");
        const foundData: PostsResponse = await fetchPosts("FOUND");
        const sightingData: PostsResponse = await fetchPosts("SIGHTING");

        /**
         * ============================================
         * CONVERGENCE POINT
         * ---------------------------------------------
         * Combine all post types into a single dataset for rendering.
         * Triggers re-render once all data has been fetched and merged.
         */
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

  /**
   * ============================================
   * RUNTIME FILTER
   * ---------------------------------------------
   * If filterType === "ALL" -> return full dataset
   * Else -> filter posts by type
   *
   * Pure derivation. No mutation.
   */
  const displayedPosts =
    filterType === "ALL" ? posts : posts.filter((p) => p.type === filterType);

  return (
    /**
     * ===========================================
     * REPRESENTATION LAYER
     * -------------------------------------------
     * Defines visual container and map engine.
     * ============================================
     */

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

        {/**
         * ============================================
         * DATA SANITIZATION CHECKPOINT
         * ---------------------------------------------
         * Removes non-geolocated posts from the dataset before projection.
         * Prevents invalid coordinate injection.
         * This is a safety measure to ensure that only posts with valid latitude and longitude are rendered on the map.
         * ============================================
         */}
        {displayedPosts
          .filter((post) => post.latitude != null && post.longitude != null)
          /**
           * ===========================================
           * MARKER PROJECTION
           * -------------------------------------------
           * Each valid post becomes:
           * - A marker on the map at the specified coordinates
           * - With an icon determined by its type (LOST, FOUND, SIGHTING)
           * - A popup that displays the post's title and text when clicked.
           *
           * Markers are derived, stateless, and ephemeral instances that exist solely for visual representation.
           */
          .map((post) => (
            <Marker
              key={post.id}
              position={[post.latitude!, post.longitude!]}
              icon={iconMap[post.type]}
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
