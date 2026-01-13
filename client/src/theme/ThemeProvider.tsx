import {
  createTheme,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import React, { createContext, useContext, useMemo, useState } from 'react';

/**
 * --------------------------------------------
 * Mode Type
 * --------------------------------------------
 * Defines the two possible theme modes: light or dark.
 */
type Mode = 'light' | 'dark';

/**
 * --------------------------------------------
 * ThemeContextValue
 * --------------------------------------------
 * Defines what the Theme Context provides to consumers:
 * - mode: current theme mode (light/dark)
 * - toggleTheme: function to switch between light and dark
 */
interface ThemeContextValue {
  mode: Mode;
  toggleTheme: () => void;
}

/**
 * --------------------------------------------
 * ThemeModeContext
 * --------------------------------------------
 * React context that holds current theme mode and toggle function.
 * Initialized with null to enforce using a custom hook for safe consumption.
 */
const ThemeModeContext = createContext<ThemeContextValue | null>(null);

/**
 * --------------------------------------------
 * useThemeMode Hook
 * --------------------------------------------
 * Custom hook for consuming ThemeModeContext safely.
 * Throws an error if used outside the AppThemeProvider.
 */
export const useThemeMode = () => {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within AppThemeProvider');
  return ctx;
};

/**
 * --------------------------------------------
 * getInitialMode
 * --------------------------------------------
 * Determines the initial theme mode based on localStorage.
 * If a value exists ('light' or 'dark'), use it; otherwise default to 'light'.
 */
const getInitialMode = (): Mode => {
  const stored = localStorage.getItem('theme');
  return stored === 'dark' || stored === 'light' ? stored : 'light';
};

/**
 * --------------------------------------------
 * AppThemeProvider
 * --------------------------------------------
 * Wraps the app to provide theme context and Material UI theming.
 *
 * Responsibilities:
 * 1. Stores current theme mode in state
 * 2. Provides toggleTheme function to switch modes
 * 3. Persists theme choice in localStorage
 * 4. Generates MUI theme using createTheme with custom palette for light/dark
 * 5. Wraps children with MUI ThemeProvider and CssBaseline for global styles
 */
export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // -----------------------------
  // State: current theme mode
  // -----------------------------
  const [mode, setMode] = useState<Mode>(getInitialMode);

  // -----------------------------
  // toggleTheme function
  // -----------------------------
  const toggleTheme = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    localStorage.setItem('theme', next);
  };
  // -----------------------------
  // MUI theme memoization
  // -----------------------------
  // Memoize the theme object to avoid unnecessary recalculation on every render
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,

          // -----------------------------
          // Custom light palette
          // -----------------------------
          ...(mode === 'light'
            ? {
                background: {
                  default: '#f5f7fa',
                  paper: '#ffffff',
                },
                text: {
                  primary: '#1f2933',
                  secondary: '#4b5563',
                },
                primary: {
                  main: '#2563eb',
                },
                secondary: {
                  main: '#64748b',
                },
                divider: '#e5e7eb',
              }
            // -----------------------------
            // Custom dark palette
            // -----------------------------
            : {
                background: {
                  default: '#0f172a',
                  paper: '#111827',
                },
                text: {
                  primary: '#f9fafb',
                  secondary: '#9ca3af',
                },
                primary: {
                  main: '#60a5fa',
                },
                secondary: {
                  main: '#94a3b8',
                },
                divider: '#1f2937',
              }),
        },
      }),
    [mode]
  );

  return (
    // -----------------------------
    // Provide theme context
    // -----------------------------
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};