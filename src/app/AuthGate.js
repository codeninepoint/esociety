"use client";
import { useSession, SessionProvider } from "next-auth/react";
import AppLayout from './AppLayout';
import LandingPage from './LandingPage';

function AuthGateInner({ children }) {
  const { status } = useSession();

  if (status === "loading") {
    return null;
  }

  if (status === "unauthenticated") {
    return <LandingPage />;
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
