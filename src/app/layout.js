import { Inter } from 'next/font/google';
import './globals.css';
import ThemeRegistry from '@/theme/ThemeRegistry';
import Header from '@/components/layout/Header';
import ContextHeader from '@/components/layout/ContextHeader';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
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
          <div className="main-app-flex" style={{ display: 'flex', minHeight: '100vh' }}>
            <Sidebar />
            <main className="main-app-content" style={{ flex: 1 }}>{children}</main>
          </div>
          <Footer />
        </ContextProvider>
      </body>
    </html>
  );
}