import React from "react";
import { Box, Typography, Link, Stack, IconButton } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";

const Footer: React.FC = () => {
  return (
    /**
     * Root footer container
     * - Uses MUI Box for styling
     * - Adapts automatically to light/dark theme
     */
    <Box
      component="footer"
      sx={{
        py: 4, // Vertical padding
        mt: 6, // Space above footer
        bgcolor: "background.paper",
        borderTop: 1, // Top border for separation
        borderColor: "divider",
      }}
    >
      {/*
        Main layout container
        - Stack gives easy flexbox control
        - Column on mobile, row on desktop
        - Constrained width for readability
      */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        maxWidth="lg"
        mx="auto"
        px={2}
      >
        {/*
          LEFT SECTION
          - Dynamic year avoids manual updates
          - Uses secondary text color for subtlety
        */}
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} DogoHome. All rights reserved.
        </Typography>

        {/*
          CENTER SECTION
          - Legal links
          - Stack keeps spacing consistent
        */}
        <Stack direction="row" spacing={2}>
          <Link href="/privacy" underline="hover" color="inherit">
            Privacy Policy
          </Link>
          <Link href="/terms" underline="hover" color="inherit">
            Terms of Service
          </Link>
        </Stack>

        {/*
          RIGHT SECTION
          - Social media icons
          - IconButton improves accessibility & hover effects
        */}
        <Stack direction="row" spacing={1}>
          <IconButton
            aria-label="Twitter"
            href="https://twitter.com"
            size="small"
          >
            <TwitterIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="Instagram"
            href="https://instagram.com"
            size="small"
          >
            <InstagramIcon fontSize="small" />
          </IconButton>
          <IconButton
            aria-label="Facebook"
            href="https://facebook.com"
            size="small"
          >
            <FacebookIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Footer;
