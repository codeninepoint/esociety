"use client";
import ThemeRegistry from '@/theme/ThemeRegistry';
import Header from '@/components/layout/Header';
import ContextHeader from '@/components/layout/ContextHeader';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';
import ContextProvider from './ContextProvider';

export default function AppLayout({ children }) {
  return (
    <ContextProvider>
      <Header />
      <ContextHeader />
      <div className="main-app-flex" style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main className="main-app-content" style={{ flex: 1 }}>
          {children}
        </main>
      </div>
      <Footer />
    </ContextProvider>
  );
}
