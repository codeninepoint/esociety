"use client";
import ThemeRegistry from './ThemeRegistry';
import AuthGate from './AuthGate';

export default function ClientLayout({ children }) {
  return (
    <ThemeRegistry>
      <AuthGate>{children}</AuthGate>
    </ThemeRegistry>
  );
}
