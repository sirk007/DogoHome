import React, { createContext, useContext, useMemo, useState } from "react";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  GlobalStyles,
} from "@mui/material";

import DayBackground from "../assets/DayBackground.png";
import NightBackground from "../assets/NightBackground.png";

/** -----------------------------
 * Define allowed theme modes
 * ----------------------------- */
type Mode = "light" | "dark";

/** -----------------------------
 * Define the shape of the Theme Context
 * Provides current mode + toggle function
 * ----------------------------- */
interface ThemeContextValue {
  mode: Mode;
  toggleTheme: () => void;
}

/** -----------------------------
 * Create Theme Context
 * Start as null to force use via hook
 * ----------------------------- */
const ThemeModeContext = createContext<ThemeContextValue | null>(null);

/** -----------------------------
 * Hook to consume ThemeModeContext
 * Throws error if used outside provider
 * ----------------------------- */
export const useThemeMode = () => {
  const ctx = useContext(ThemeModeContext);
  if (!ctx)
    throw new Error("useThemeMode must be used within AppThemeProvider");
  return ctx;
};

/** -----------------------------
 * Get initial mode from localStorage
 * Defaults to "light"
 * ----------------------------- */
const getInitialMode = (): Mode => {
  const stored = localStorage.getItem("theme");
  return stored === "dark" || stored === "light" ? stored : "light";
};

/** -----------------------------
 * AppThemeProvider
 * Wrap your app with this to provide:
 * - Theme context (mode + toggle)
 * - MUI ThemeProvider
 * - Global body styles with background images
 * ----------------------------- */
export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // -----------------------------
  // Theme mode state
  // -----------------------------
  const [mode, setMode] = useState<Mode>(getInitialMode);

  // -----------------------------
  // Toggle function for switching theme
  // -----------------------------
  const toggleTheme = () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    localStorage.setItem("theme", next);
  };

  // -----------------------------
  // Create MUI theme
  // Use a minimal neutral palette
  // Include semi-transparent overlays for readability
  // -----------------------------
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            default: mode === "light" ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.5)",
            paper: mode === "light" ? "rgba(0,0,0,0.2)" : "rgba(0,0,0,0.5)",
          },
          text: {
            primary: mode === "light" ? "#000" : "#f9fafb",
            secondary: mode === "light" ? "#333" : "#ccc",
          },
          primary: { main: mode === "light" ? "#000" : "#fff" },
          secondary: { main: mode === "light" ? "#000" : "#fff" },
          divider:
            mode === "light" ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
        },
        typography: {
          fontFamily: "'Roboto', sans-serif",
        },
      }),
    [mode],
  );

  // -----------------------------
  // Set Day/Night background image
  // -----------------------------
  const backgroundImage = `url(${mode === "light" ? DayBackground : NightBackground})`;

  // -----------------------------
  // Return the provider with:
  // - Theme context
  // - MUI ThemeProvider
  // - CssBaseline for default styles
  // - GlobalStyles for background
  // -----------------------------
  return (
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: {
              backgroundImage,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              minHeight: "100vh",
              transition: "background 0.5s ease-in-out, color 0.3s ease",
            },
            "#root": {
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
            },
          }}
        />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
