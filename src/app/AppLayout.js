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
      <div className="app-wrapper">
        <Header />
        <ContextHeader />
        <div className="main-app-flex">
          <Sidebar />
          <main className="main-app-content">
            <div className="main-app-content-inner">
              {children}
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </ContextProvider>
  );
}
