"use client";

import AuthPanel from '@/components/auth/AuthPanel';
import { useSession } from "next-auth/react";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, bgcolor: '#f8fafc' }}>
        <CircularProgress color="primary" size={48} />
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Checking authentication status...
        </Typography>
      </Box>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ px: 4, py: 6, bgcolor: 'primary.main', color: 'primary.contrastText', textAlign: 'center' }}>
          <Typography variant="h2" fontWeight="bold" gutterBottom>
            Welcome to eSociety
          </Typography>
          <Typography variant="h5" gutterBottom>
            Empowering Communities, Simplifying Management
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: 600, mx: 'auto', mb: 2 }}>
            eSociety is your all-in-one platform for society management, resident engagement, and seamless communication. Discover our products and services designed to make your community thrive.
          </Typography>
          <Box sx={{ mt: 3 }}>
            <a href="/register" style={{ textDecoration: 'none' }}>
              <Box component="span" sx={{ bgcolor: 'secondary.main', color: 'secondary.contrastText', px: 4, py: 1.5, borderRadius: 2, fontWeight: 'bold', fontSize: 18, boxShadow: 2, cursor: 'pointer', transition: '0.2s', ':hover': { bgcolor: 'secondary.dark' } }}>
                Register Now
              </Box>
            </a>
          </Box>
        </Box>
        <Box sx={{ px: 4, py: 6, maxWidth: 900, mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" color="primary.main" fontWeight="bold" gutterBottom>About Us</Typography>
            <Typography variant="body1" color="text.secondary">
              eSociety is built for modern communities. Our platform offers tools for society management, event planning, resident communication, billing, and more. We help societies run efficiently and transparently.
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" color="primary.main" fontWeight="bold" gutterBottom>Products & Services</Typography>
            <ul style={{ paddingLeft: 20, color: '#555', fontSize: 16 }}>
              <li>Society Billing & Accounting</li>
              <li>Event & Facility Booking</li>
              <li>Resident Portal & Mobile App</li>
              <li>Visitor & Security Management</li>
              <li>Communication & Announcements</li>
              <li>Document Storage & Sharing</li>
            </ul>
          </Box>
        </Box>
        <Box sx={{ px: 4, py: 6, maxWidth: 900, mx: 'auto', display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 6 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" color="primary.main" fontWeight="bold" gutterBottom>Terms & Conditions</Typography>
            <Typography variant="body2" color="text.secondary">
              By registering, you agree to our terms of service and privacy policy. We value your data privacy and security. Please read our terms before proceeding.
            </Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h4" color="primary.main" fontWeight="bold" gutterBottom>Contact Us</Typography>
            <Typography variant="body2" color="text.secondary">
              Have questions or need support? Reach out to us at <a href="mailto:support@esociety.com" style={{ color: '#1976d2' }}>support@esociety.com</a> or call +1-800-ESOCIETY.
            </Typography>
          </Box>
        </Box>
        <Box sx={{ textAlign: 'center', py: 3, bgcolor: 'grey.100', color: 'text.secondary', fontSize: 14 }}>
          &copy; {new Date().getFullYear()} eSociety. All rights reserved.
        </Box>
      </Box>
    );
  }

  // authenticated: don't render anything (redirect happens)
  return null;
}