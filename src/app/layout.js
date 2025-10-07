import { Inter } from 'next/font/google';
import './globals.css';
import AuthGate from './AuthGate';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Community Login',
  description: 'System of Zero Trust',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthGate>{children}</AuthGate>
      </body>
    </html>
  );
}