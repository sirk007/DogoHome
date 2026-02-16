import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { Box } from "@mui/material";
import L from "leaflet";

interface MapSelectorProps {
  onSelect: (lat: number, lng: number) => void;
  initialPosition?: [number, number];
}

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

const MapSelector: React.FC<MapSelectorProps> = ({
  onSelect,
  initialPosition = [53.35, -6.26],
}) => {
  const [marker, setMarker] = useState<[number, number] | null>(null);

  const handleSelect = (lat: number, lng: number) => {
    setMarker([lat, lng]);
    onSelect(lat, lng);
  };

  return (
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
        <MapClickHandler onSelect={handleSelect} />
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
