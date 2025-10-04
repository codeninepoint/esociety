'use client';

import Link from 'next/link';
import { useState, useContext } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider, Avatar, Collapse, Box } from '@mui/material';
import { Home, Group, AccountBalance, Receipt, Payment, Assessment, Settings, Person, ExitToApp, ExpandLess, ExpandMore } from '@mui/icons-material';
import ListItemButton from '@mui/material/ListItemButton';
import { LogOut } from 'lucide-react';
import { AppContext } from '@/app/ContextProvider';

export default function Sidebar({ selected, children }) {
  const [openSocieties, setOpenSocieties] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const context = useContext(AppContext);

  const handleSocietiesClick = () => {
    setOpenSocieties((prev) => !prev);
    if (!openSocieties) setOpenSettings(false);
  };

  const handleSettingsClick = () => {
    setOpenSettings((prev) => !prev);
    if (!openSettings) setOpenSocieties(false);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar */}
      <Box
        sx={{
          width: 240,
          background: '#1e293b',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          py: 2,
          minHeight: '100vh',
        }}
      >
        <div>
          <div className="sidebar-logo" style={{ padding: '1rem', fontWeight: 700, fontSize: 22 }}>eSociety</div>
          <List>
            <ListItem disablePadding>
              <Link href="/dashboard" style={{ width: '100%', display: 'flex' }}>
                <ListItemButton selected={selected === 'Dashboard'}>
                  <ListItemIcon sx={{ color: '#fff' }}><Home /></ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItemButton>
              </Link>
            </ListItem>
            <ListItem disablePadding>
              <Link href="/societies" style={{ width: '100%', display: 'flex' }}>
              <ListItemButton onClick={handleSocietiesClick} selected={selected === 'Societies'}>
                <ListItemIcon sx={{ color: '#fff' }}><Group /></ListItemIcon>
                <ListItemText primary="Societies" />
                {openSocieties ? <ExpandLess sx={{ color: '#fff' }} /> : <ExpandMore sx={{ color: '#fff' }} />}
              </ListItemButton>
              </Link>
            </ListItem>
            <Collapse in={openSocieties} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem disablePadding>
                  <Link href="/societies/add" style={{ width: '100%', display: 'flex' }}>
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemText primary="Add Society" />
                    </ListItemButton>
                  </Link>
                </ListItem>
              </List>
            </Collapse>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ color: '#fff' }}><AccountBalance /></ListItemIcon>
                <ListItemText primary="Accounts" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ color: '#fff' }}><Receipt /></ListItemIcon>
                <ListItemText primary="Vouchers" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ color: '#fff' }}><Payment /></ListItemIcon>
                <ListItemText primary="Payments" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon sx={{ color: '#fff' }}><Assessment /></ListItemIcon>
                <ListItemText primary="Reports" />
              </ListItemButton>
            </ListItem>
            <Divider sx={{ bgcolor: '#333', my: 1 }} />
            <ListItem disablePadding>
              <ListItemButton onClick={handleSettingsClick}>
                <ListItemIcon sx={{ color: '#fff' }}><Settings /></ListItemIcon>
                <ListItemText primary="Settings" />
                {openSettings ? <ExpandLess sx={{ color: '#fff' }} /> : <ExpandMore sx={{ color: '#fff' }} />}
              </ListItemButton>
            </ListItem>
            <Collapse in={openSettings} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                <ListItem disablePadding>
                  <Link href="/settings/users" style={{ width: '100%', display: 'flex' }}>
                    <ListItemButton sx={{ pl: 4 }} selected={selected === 'Users'}>
                      <ListItemIcon sx={{ color: '#fff' }}><Person /></ListItemIcon>
                      <ListItemText primary="Users" />
                    </ListItemButton>
                  </Link>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton sx={{ pl: 4 }}>
                    <ListItemIcon sx={{ color: '#fff' }}><ExitToApp /></ListItemIcon>
                    <ListItemText primary="Profile" />
                  </ListItemButton>
                </ListItem>
              </List>
            </Collapse>
          </List>
          <List>
            <ListItem disablePadding>
              <Link href="/logout" style={{ width: '100%', display: 'flex' }}>
                <ListItemButton>
                  <ListItemIcon sx={{ color: '#fff' }}><LogOut /></ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </Link>
            </ListItem>
          </List>
        </div>
        <div className="sidebar-user" style={{ display: 'flex', alignItems: 'center', padding: '1rem' }}>
          <Avatar sx={{ mr: 1, bgcolor: '#2563eb' }}>A</Avatar>
          <div>
            <span style={{ color: '#fff', fontWeight: 500 }}>Admin User</span>
            <div style={{ color: '#aaa', fontSize: 12 }}>Super Admin</div>
          </div>
        </div>
      </Box>
      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3, background: '#f8fafc' }}>
        {children}
      </Box>
    </Box>
  );
}