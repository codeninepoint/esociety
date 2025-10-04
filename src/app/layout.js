import { Inter } from 'next/font/google';
import './globals.css';
import ThemeRegistry from '@/theme/ThemeRegistry';
import Header from '@/components/layout/Header';
import ContextHeader from '@/components/layout/ContextHeader';
import Sidebar from '@/components/layout/Sidebar';
import ContextProvider from './ContextProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Community Login',
  description: 'System of Zero Trust',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ContextProvider>
          <Header />
          <ContextHeader />
          <div className="main-app-flex">
            <main className="main-app-content">{children}</main>
          </div>
        </ContextProvider>
      </body>
    </html>
  );
}