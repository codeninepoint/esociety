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
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, bgcolor: '#f8fafc' }}>
        <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
          Welcome to eSociety
        </Typography>
        <Typography variant="body1" color="error.main">
          Please sign in to continue.
        </Typography>
      </Box>
    );
  }

  // authenticated: don't render anything (redirect happens)
  return null;
}