import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Box } from "@mui/material";
import L from "leaflet";

/**
 * ============================================
 * COMPONENT CONTRACT
 * --------------------------------------------
 * Defines the external interface of the MapSelector component.
 *
 * - onSelect: callback triggered when user selects a location on the map.
 * - initialPosition: optional starting map center.
 *
 * Serves as the boundary between this component and its consumers.
 */

interface MapSelectorProps {
  onSelect: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
}
// ============================================

/**
 * ============================================
 * EVENT CAPTURE LAYER
 * --------------------------------------------
 * Subscribes to map click events.
 *
 * on click:
 * - Extract latitude & longitude from event
 * - Propagate coordinates upstream.
 *
 * No rendering responsibility.
 * Pure event interception and propagation.
 * ============================================
 */
const MapClickHandler: React.FC<{
  onSelect: (lat: number, lng: number) => void;
}> = ({ onSelect }) => {
  useMapEvents({
    click(e) {
      onSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

/**
 * ============================================
 * MapSelector Component
 * ---------------------------------------------
 * Interactive map allowing users to select a location.
 *
 * Responsibilities:
 * 1. Capture user click events to determine selected location.
 * 2. Update local marker state.
 * 3. Propagate coordinates upstream.
 * 4. Project marker at selected location.
 */
const MapSelector: React.FC<MapSelectorProps> = ({
  onSelect,
  initialPosition = [53.35, -6.26],
}) => {
  /**
   * ============================================
   * REACTIVE SELECTION STATE
   * ---------------------------------------------
   * Stores the currently selected marker coordinates.
   * Null until user interaction occurs.
   */
  const [marker, setMarker] = useState<[number, number] | null>(null);
  // ============================================

  /**
   * ============================================
   * SELECTION HANDLER
   * ---------------------------------------------
   * Converge point for click events.
   *
   * - Updates local marker state
   * - Notifies parent through onSelect callback
   */
  const handleSelect = (lat: number, lng: number) => {
    setMarker([lat, lng]);
    onSelect(lat, lng);
  };
  // ============================================

  return (
    /**
     * ============================================
     * REPRESENTATION LAYER
     * ---------------------------------------------
     * Defines the container and map engine.
     * Renders marker if a selection exists.
     */
    <Box
      sx={{ height: 300, width: "100%", borderRadius: 2, overflow: "hidden" }}
    >
      <MapContainer
        center={initialPosition}
        zoom={8}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Event capture layer to handle map clicks */}
        <MapClickHandler onSelect={handleSelect} />

        {/*
         * ============================================
         * MARKET PROJECTION
         * ---------------------------------------------
         * If a marker state exists, project it onto the map.
         * Each marker is rendered at the selected coordinates.
         */}
        {marker && (
          <Marker
            position={marker}
            icon={L.icon({
              iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
              iconSize: [32, 32],
            })}
          />
        )}
      </MapContainer>
    </Box>
  );
};

export default MapSelector;
