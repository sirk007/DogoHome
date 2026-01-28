import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Stack,
  Button,
  Alert,
} from "@mui/material";
import { useAuthContext } from "../../context/AuthContext";
import { fetchShelterProfile } from "../../api/shelter.api";
import type { ShelterProfile as ShelterProfileType } from "../../types/shelter.types";

export default function ShelterProfile() {
  const { authState } = useAuthContext();

  // ────────────────────────────────────────────────────────────────
  // IMMEDIATE LOGS – these run on every render (should appear first)
  // ────────────────────────────────────────────────────────────────
  console.log(
    "%c[ShelterProfile] COMPONENT MOUNTED / RE-RENDERED",
    "background: #0066cc; color: white; padding: 4px 8px; font-weight: bold;",
  );
  console.log(
    "[ShelterProfile] authState on render:",
    JSON.stringify(authState, null, 2),
  );
  console.log(
    "[ShelterProfile] token on render →",
    authState.token
      ? "PRESENT (length: " + authState.token.length + ")"
      : "MISSING / undefined",
  );

  const [profile, setProfile] = useState<ShelterProfileType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log(
      "%c[ShelterProfile] useEffect EXECUTED",
      "background: #00aa00; color: white; padding: 4px 8px;",
    );
    console.log(
      "[ShelterProfile] useEffect – token present?",
      !!authState.token,
    );

    if (!authState.token) {
      console.warn("[ShelterProfile] No token detected inside effect");
      setError("No authentication token available right now.");
      setProfile(null);
      return;
    }

    setLoading(true);
    setError(null);

    console.log("[ShelterProfile] Starting fetchShelterProfile...");

    fetchShelterProfile(authState.token)
      .then((data) => {
        console.log("[ShelterProfile] Fetch SUCCESS:", data);
        setProfile(data);
      })
      .catch((err: any) => {
        console.error("[ShelterProfile] Fetch FAILED:", err);
        const msg =
          err.response?.data?.error || err.message || "Failed to load profile";
        setError(msg);
        setProfile(null);
      })
      .finally(() => {
        console.log("[ShelterProfile] Fetch finished");
        setLoading(false);
      });
  }, [authState.token]);

  return (
    <Box sx={{ p: 4, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" fontWeight={600} gutterBottom>
        Shelter Profile (Diagnostic Mode)
      </Typography>

      {/* Show current auth state right on the page */}
      <Alert severity={authState.token ? "success" : "warning"} sx={{ mb: 3 }}>
        <strong>Auth state on this render:</strong>
        <br />
        Token: {authState.token ? "present" : "missing"}
        <br />
        Status: {authState.status ? "logged in" : "not logged in"}
        <br />
        UserType: {authState.userType || "none"}
        <br />
        Username: {authState.username || "—"}
      </Alert>

      <Button
        variant="contained"
        onClick={() => {
          console.log("[ShelterProfile] Manual refresh clicked");
          setError(null);
          setProfile(null);
          // Force re-run by changing a dummy state or just call the logic
          if (authState.token) {
            setLoading(true);
            fetchShelterProfile(authState.token)
              .then(setProfile)
              .catch((e) => setError(e.message || "Manual fetch failed"))
              .finally(() => setLoading(false));
          }
        }}
        disabled={loading || !authState.token}
        sx={{ mb: 3 }}
      >
        {loading ? "Loading..." : "Manual Refresh"}
      </Button>

      {loading && (
        <Box textAlign="center" my={4}>
          <CircularProgress />
          <Typography mt={2}>Loading profile...</Typography>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {profile && (
        <Paper sx={{ p: 3 }}>
          <Stack spacing={1.5}>
            <Typography>
              <strong>ID:</strong> {profile.id}
            </Typography>
            <Typography>
              <strong>Username:</strong> {profile.username}
            </Typography>
            <Typography>
              <strong>Shelter Name:</strong> {profile.shelterName}
            </Typography>
            <Typography>
              <strong>Email:</strong> {profile.email}
            </Typography>
            <Typography>
              <strong>County ID:</strong> {profile.countyId}
            </Typography>
            <Typography>
              <strong>Address:</strong> {profile.address}
            </Typography>
            <Typography>
              <strong>Phone:</strong> {profile.phoneNumber}
            </Typography>
            <Typography>
              <strong>User Type:</strong> {profile.userType}
            </Typography>
          </Stack>
        </Paper>
      )}

      {!loading && !error && !profile && (
        <Typography color="text.secondary">
          No profile data loaded yet.
        </Typography>
      )}
    </Box>
  );
}
