import React from 'react';
import { Box, Typography, Link, Stack, IconButton } from '@mui/material';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        mt: 6,
        bgcolor: 'background.paper',
        borderTop: 1,
        borderColor: 'divider',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
        maxWidth="lg"
        mx="auto"
        px={2}
      >
        {/* Left: Copyright */}
        <Typography variant="body2" color="text.secondary">
          &copy; {new Date().getFullYear()} DogoHome. All rights reserved.
        </Typography>

        {/* Center: Legal Links */}
        <Stack direction="row" spacing={2}>
          <Link href="/privacy" underline="hover" color="inherit">
            Privacy Policy
          </Link>
          <Link href="/terms" underline="hover" color="inherit">
            Terms of Service
          </Link>
        </Stack>

        {/* Right: Social Icons */}
        <Stack direction="row" spacing={1}>
          <IconButton aria-label="Twitter" href="https://twitter.com" size="small">
            <TwitterIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="Instagram" href="https://instagram.com" size="small">
            <InstagramIcon fontSize="small" />
          </IconButton>
          <IconButton aria-label="Facebook" href="https://facebook.com" size="small">
            <FacebookIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default Footer;