"use client";
import { useSession, SessionProvider } from "next-auth/react";
import AuthPanel from '@/components/auth/AuthPanel';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AppLayout from './AppLayout';

function AuthGateInner({ children }) {
  const { status } = useSession();

  if (status === "loading") {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6">Loading authentication...</Typography>
      </Box>
    );
  }

  if (status === "unauthenticated") {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
        <Typography variant="h5" color="error.main">Please sign in to continue</Typography>
        <AuthPanel />
      </Box>
    );
  }

  // Authenticated
  return <AppLayout>{children}</AppLayout>;
}

export default function AuthGate({ children }) {
  return (
    <SessionProvider>
      <AuthGateInner>{children}</AuthGateInner>
    </SessionProvider>
  );
}
