import {
  createTheme,
  ThemeProvider,
  CssBaseline,
} from '@mui/material';
import React, { createContext, useContext, useMemo, useState } from 'react';

type Mode = 'light' | 'dark';

interface ThemeContextValue {
  mode: Mode;
  toggleTheme: () => void;
}

const ThemeModeContext = createContext<ThemeContextValue | null>(null);

export const useThemeMode = () => {
  const ctx = useContext(ThemeModeContext);
  if (!ctx) throw new Error('useThemeMode must be used within AppThemeProvider');
  return ctx;
};

const getInitialMode = (): Mode => {
  const stored = localStorage.getItem('theme');
  return stored === 'dark' || stored === 'light' ? stored : 'light';
};

export const AppThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<Mode>(getInitialMode);

  const toggleTheme = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next);
    localStorage.setItem('theme', next);
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,

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
    <ThemeModeContext.Provider value={{ mode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};