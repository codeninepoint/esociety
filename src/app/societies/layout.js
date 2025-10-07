"use client";
import ModuleProvider from './ModuleProvider.js';

export default function SocietiesLayout({ children }) {
  return (
    <ModuleProvider>
      {children}
    </ModuleProvider>
  );
}
