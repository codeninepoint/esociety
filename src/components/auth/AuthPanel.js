"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function AuthPanel() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
      {loading ? (
        <Typography sx={{ color: '#94a3b8', fontSize: 13 }}>Loading...</Typography>
      ) : session ? (
        <Button 
          variant="outlined" 
          size="small"
          sx={{ 
            color: '#94a3b8', 
            borderColor: 'rgba(148, 163, 184, 0.3)',
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            padding: '6px 14px',
            borderRadius: '8px',
            transition: 'all 0.2s ease',
            '&:hover': { 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              borderColor: '#ef4444',
              color: '#ef4444'
            } 
          }} 
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          Sign out
        </Button>
      ) : (
        <Button 
          variant="contained" 
          size="small"
          sx={{ 
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            color: '#fff', 
            fontSize: 11,
            fontWeight: 600,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            padding: '8px 16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.35)',
            '&:hover': { 
              background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            } 
          }} 
          onClick={() => signIn("keycloak")}
        >
          Sign in
        </Button>
      )}
    </Box>
  );
}
