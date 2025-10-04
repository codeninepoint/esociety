import React from 'react';

export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      background: '#1e293b',
      color: '#fff',
      textAlign: 'center',
      padding: '1rem 0',
      position: 'fixed',
      left: 0,
      bottom: 0,
      zIndex: 1200,
    }}>
      <div>
        <span>© 2025 Community Exchange Platform | Powered by Ninepoint Solutions & Services LLP</span>
        <span style={{ marginLeft: '2rem' }}>Contact: info.ninepoint@gmail.com</span>
        <span style={{ marginLeft: '2rem' }}>Version: 1.0.0</span>
        <a
          href="https://www.linkedin.com/in/ninepoint-solutions-services-llp-841800340/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: '2rem', verticalAlign: 'middle', display: 'inline-flex', alignItems: 'center' }}
          aria-label="LinkedIn"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: 6 }}>
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.026-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.6 2 3.6 4.594v5.602z"/>
          </svg>
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
