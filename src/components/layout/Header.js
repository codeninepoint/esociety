"use client";
import AuthPanel from '@/components/auth/AuthPanel';
import { useSession } from "next-auth/react";
import Image from 'next/image';

export default function Header() {
  const { data: session, status } = useSession();
  const user = session?.user || {
    name: 'Guest',
    role: '',
    avatar: '',
  };

  return (
    <nav className="main-app-header">
      <div className="header-left">
        <div className="app-logo-container">
          <svg className="app-logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="app-logo">Swaym</span>
          <span className="app-logo-suffix">Org</span>
        </div>
      </div>
      <div className="header-right">
        {status === "authenticated" && (
          <>
            <div className="header-user-info">
              <span className="header-greeting">Signed in as</span>
              <span className="header-user-name">{user.name}</span>
            </div>
            <AuthPanel />
          </>
        )}
        <div className="header-avatar">
          {user.avatar
            ? <Image src={user.avatar} alt={user.name} width={40} height={40} style={{ borderRadius: '50%' }} />
            : <span>{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
          }
        </div>
      </div>
    </nav>
  );
}