"use client";
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * This page redirects to the main accounts page.
 * The listing functionality is now consolidated in /societies/accounts
 * If a code parameter is provided, it redirects to the edit page instead.
 */
export default function BillIncomeManageRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams?.get('code');

  useEffect(() => {
    if (code) {
      // If a code is provided, redirect to the edit page
      router.replace(`/societies/accounts/bill-income?code=${encodeURIComponent(code)}`);
    } else {
      // Otherwise, redirect to the main accounts page with bill-income selected
      router.replace('/societies/accounts');
    }
  }, [code, router]);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: 200,
      gap: 2
    }}>
      <CircularProgress size={32} sx={{ color: '#6366f1' }} />
      <Typography sx={{ color: '#94a3b8' }}>Redirecting...</Typography>
    </Box>
  );
}
