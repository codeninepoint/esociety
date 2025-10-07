"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function AuthPanel() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "row", alignItems: "center", gap: 3 }}>
      {/* <Typography variant="h6" fontWeight="bold">Authentication</Typography> */}
      {loading ? (
        <Typography>Loading...</Typography>
      ) : session ? (
        <>
          <Typography>Signed in as {session.user?.name || session.user?.email}</Typography>
          <Button variant="contained" sx={{ backgroundColor: '#2563eb', color: '#fff', '&:hover': { backgroundColor: '#174ea6' } }} onClick={() => signOut()}>
            Sign out
          </Button>
        </>
      ) : (
  <Button variant="contained" sx={{ backgroundColor: '#2563eb', color: '#fff', '&:hover': { backgroundColor: '#174ea6' } }} onClick={() => signIn("keycloak")}>Sign in with Keycloak</Button>
      )}
    </Box>
  );
}
