'use client';

export default function Header() {
  // Replace with real user data as needed
  const user = {
    name: 'Admin User',
    role: 'Super Admin',
    avatar: '', // You can use an avatar URL or initials
  };

  return (
    <nav className="main-app-header">
      <div className="header-left">
        {/* Add logo or app name here if needed */}
        <span className="app-logo" style={{ fontWeight: 700, fontSize: 18, color: '#2563eb' }}>eSociety</span>
      </div>
      <div className="header-right">
        <span className="header-user-name">{user.name}</span>
        <span className="header-user-role">{user.role}</span>
        <div className="header-avatar">
          {user.avatar
            ? <img src={user.avatar} alt={user.name} />
            : <span>{user.name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
          }
        </div>
      </div>
    </nav>
  );
}