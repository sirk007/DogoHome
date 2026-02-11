import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import type { ShelterProfile } from "../../types/shelter.types";
import { fetchPublicShelters } from "../../api/shelter.api";
import { IrishCounties, type IrishCounty } from "../../types/counties.types";

const UserExplore: React.FC = () => {
  const [county, setCounty] = useState<IrishCounty | "">("");
  const [shelters, setShelters] = useState<ShelterProfile[]>([]);

  // Fetch shelters whenever county changes
  useEffect(() => {
    if (!county) return;
    // We assume your backend uses numeric IDs; adjust if necessary
    const countyIndex = IrishCounties.indexOf(county) + 1;
    fetchPublicShelters(countyIndex).then(setShelters);
  }, [county]);

  return (
    <Box sx={{ display: "flex", height: "100vh", width: "100%" }}>
      {/* Left: Filters + Shelters List */}
      <Box
        sx={{
          width: "50%",
          p: 3,
          overflowY: "auto",
          bgcolor: "rgba(0,0,0,0.05)",
        }}
      >
        <Typography variant="h5" gutterBottom>
          Filter Shelters
        </Typography>

        {/* County Filter */}
        <FormControl fullWidth margin="normal">
          <InputLabel>County</InputLabel>
          <Select
            value={county}
            onChange={(e) => setCounty(e.target.value as IrishCounty)}
            label="County"
          >
            {IrishCounties.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Shelter List */}
        <Box sx={{ mt: 3 }}>
          {shelters.length === 0 && county && (
            <Typography>No shelters found in this county.</Typography>
          )}

          {shelters.map((s) => (
            <Box
              key={s.id}
              sx={{
                p: 2,
                mb: 2,
                border: "1px solid gray",
                borderRadius: 1,
              }}
            >
              <Typography fontWeight="bold">{s.shelterName}</Typography>
              {s.phoneNumber && <Typography>📞 {s.phoneNumber}</Typography>}
              <Button
                variant="contained"
                sx={{ mt: 1 }}
                onClick={() => alert(`Go to ${s.shelterName} page`)}
              >
                Access
              </Button>
            </Box>
          ))}
        </Box>
      </Box>
      {/* Right: Map placeholder */}
      <Box
        sx={{
          width: "50%",
          borderRight: 1,
          borderColor: "divider",
          bgcolor: "rgba(0,0,0,0.05)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h6" color="textSecondary">
          Map Placeholder
        </Typography>
      </Box>
    </Box>
  );
};

export default UserExplore;
