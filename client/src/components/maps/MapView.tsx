import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { Box } from "@mui/material";

const MapView: React.FC = () => {
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
        center={[53.35, -6.26]} // Dublin
        zoom={8}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    </Box>
  );
};

export default MapView;
