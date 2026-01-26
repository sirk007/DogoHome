import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { useAuthContext } from "../../context/AuthContext";
import { fetchShelterProfile } from "../../api/shelter.api";
import type { ShelterProfile } from "../../types/shelter.types";

const ShelterProfile: React.FC = () => {
  const { authState, loading: authLoading, logout } = useAuthContext();
  const [profile, setProfile] = useState<ShelterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);

        const data = await fetchShelterProfile(authState.token!);
        setProfile(data);
        setError("");
      } catch (err: any) {
        console.error("Error fetching shelter profile:", err);

        setError(
          err.response?.data?.error || "Failed to fetch shelter profile.",
        );

        // Force logout if token is invalid or expired
        if (err.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    // Only fetch after auth check completes and shelter is logged in
    if (!authLoading && authState.status && authState.token) {
      fetchProfile();
    } else if (!authLoading && !authState.status) {
      setError("Please log in to view your profile.");
      setLoading(false);
    }
  }, [authState.status, authState.token, authLoading, logout]);

  if (authLoading || loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!profile) return null;

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          {profile.shelterName} Profile
        </Typography>

        <Typography>
          <strong>Username:</strong> {profile.username}
        </Typography>
        <Typography>
          <strong>Email:</strong> {profile.email}
        </Typography>
        <Typography>
          <strong>Address:</strong> {profile.address}
        </Typography>
        <Typography>
          <strong>Phone:</strong> {profile.phoneNumber}
        </Typography>
        <Typography>
          <strong>County ID:</strong> {profile.countyId}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ShelterProfile;
