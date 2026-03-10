import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Stack,
  Autocomplete,
  TextField,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import type { ShelterProfile } from "../../types/shelter.types";
import { fetchPublicShelters } from "../../api/shelter.api";
import { IrishCounties, type IrishCounty } from "../../types/counties.types";

const UserExplore: React.FC = () => {
  const navigate = useNavigate();
  const [county, setCounty] = useState<IrishCounty | "">("");
  const [shelters, setShelters] = useState<ShelterProfile[]>([]);

  // Fetch shelters whenever county changes
  useEffect(() => {
    if (!county) return;
    const countyIndex = IrishCounties.indexOf(county) + 1;
    fetchPublicShelters(countyIndex).then(setShelters);
  }, [county]);

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" mb={3} textAlign="center">
        Explore Shelters
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
        }}
      >
        {/* LEFT: Filters + Shelter List */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", md: "0 0 45%" },
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxHeight: { md: "80vh" },
            overflowY: "auto",
          }}
        >
          {/* COUNTY FILTER (searchable) */}
          <Autocomplete<IrishCounty>
            value={county || null}
            onChange={(event, newValue) => setCounty(newValue || "")}
            options={IrishCounties}
            fullWidth
            clearOnEscape
            autoHighlight
            renderInput={(params) => <TextField {...params} label="County" />}
          />

          {/* SHELTER LIST */}
          <Stack spacing={2}>
            {shelters.length === 0 && county && (
              <Typography>No shelters found in this county.</Typography>
            )}

            {shelters.map((s) => (
              <Card key={s.id} variant="outlined" sx={{ borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6">{s.shelterName}</Typography>
                  {s.phoneNumber && (
                    <Typography variant="body2" color="text.secondary">
                      📞 {s.phoneNumber}
                    </Typography>
                  )}
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ mt: 1 }}
                    onClick={() => navigate(`/user/shelter/${s.id}`)}
                  >
                    Access
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Stack>
        </Box>

        {/* RIGHT: Map */}
        <Box
          sx={{
            flex: { xs: "1 1 100%", md: "1 1 55%" },
            minHeight: 300,
            bgcolor: "rgba(0,0,0,0.05)",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: 1,
          }}
        >
          <Typography variant="h6" color="text.secondary">
            Map Placeholder
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default UserExplore;
