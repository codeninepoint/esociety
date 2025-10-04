"use client";

import React from 'react';
import Link from 'next/link';
import { useState, useContext, useEffect, useRef } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider, Avatar, Collapse, Box, Drawer, IconButton } from '@mui/material';
import { Home, Group, AccountBalance, Receipt, Payment, Assessment, Settings, Person, ExitToApp, ExpandLess, ExpandMore, Menu } from '@mui/icons-material';
import ListItemButton from '@mui/material/ListItemButton';
import { LogOut } from 'lucide-react';
import { AppContext } from '@/app/ContextProvider';

function Sidebar({ selected, children }) {
  const { organization, project, module, subscription, location } = useContext(AppContext).context;
  console.log('Sidebar context:', { organization, project, module, subscription, location });
  const [openSocieties, setOpenSocieties] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [forceMobile, setForceMobile] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const mainContentRef = useRef(null);
  const { context } = useContext(AppContext);

  const handleSocietiesClick = () => {
    setOpenSocieties((prev) => !prev);
    if (!openSocieties) setOpenSettings(false);
  };

  const handleSettingsClick = () => {
    setOpenSettings((prev) => !prev);
    if (!openSettings) setOpenSocieties(false);
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Observe if main content is pushed down
  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (!mainContent) return;
    const observer = new window.IntersectionObserver(
      ([entry]) => {
        // If main content is not visible at the top, force mobile sidebar
        setForceMobile(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        rootMargin: '-1px 0px 0px 0px',
      }
    );
    observer.observe(mainContent);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    async function fetchMenu() {
      if (!module) return;
      console.log('Fetching menu for module:', module);
      try {
        const res = await fetch(`/api/menu?module=${module}`);
        const data = await res.json();
        console.log('Menu API response:', data);
        setMenuItems(data.items || []);
      } catch (e) {
        console.error('Menu API error:', e);
        setMenuItems([]);
      }
    }
    fetchMenu();
  }, [module]);

  const drawerContent = (
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
          {menuItems.map((item) => {
            if (item.label === 'Societies' && item.children) {
              return (
                <React.Fragment key={item.label}>
                  <ListItem disablePadding>
                    <Link href={item.href} style={{ width: '100%', display: 'flex' }}>
                      <ListItemButton
                        selected={selected === item.label}
                        onClick={() => {
                          setOpenSocieties((prev) => !prev);
                        }}
                      >
                        {item.icon && <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>}
                        <ListItemText primary={item.label} />
                      </ListItemButton>
                    </Link>
                    <IconButton
                      onClick={handleSocietiesClick}
                      sx={{ color: '#fff', ml: 'auto', p: 0 }}
                      size="small"
                      aria-label={openSocieties ? 'Collapse' : 'Expand'}
                    >
                      {openSocieties ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </ListItem>
                  <Collapse in={openSocieties} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <ListItem disablePadding key={child.label}>
                          <Link href={child.href} style={{ width: '100%', display: 'flex' }}>
                            <ListItemButton sx={{ pl: 4 }} selected={selected === child.label}>
                              {child.icon && <ListItemIcon sx={{ color: '#fff' }}>{child.icon}</ListItemIcon>}
                              <ListItemText primary={child.label} />
                            </ListItemButton>
                          </Link>
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </React.Fragment>
              );
            } else {
              return (
                <ListItem disablePadding key={item.label}>
                  <Link href={item.href} style={{ width: '100%', display: 'flex' }}>
                    <ListItemButton
                      selected={selected === item.label}
                      onClick={() => {
                        // Auto-collapse Societies submenu when another menu item is clicked
                        setOpenSocieties(false);
                      }}
                    >
                      {item.icon && <ListItemIcon sx={{ color: '#fff' }}>{item.icon}</ListItemIcon>}
                      <ListItemText primary={item.label} />
                    </ListItemButton>
                  </Link>
                </ListItem>
              );
            }
          })}
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
  );

  return (
    <Box sx={{ display: 'flex', background: '#f8fafc', height: '100vh', position: 'relative' }}>
      {/* Hamburger menu for mobile or forced mobile */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1300,
          display: { xs: 'block', md: forceMobile ? 'block' : 'none' },
          background: '#1e293b',
          color: '#fff',
        }}
      >
        <Menu />
      </IconButton>
      {/* Sidebar for desktop, hidden if forced mobile */}
      <Box
        sx={{
          width: 240,
          background: '#1e293b',
          color: '#fff',
          display: { xs: 'none', md: forceMobile ? 'none' : 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          py: 2,
          minHeight: '100vh',
        }}
      >
        {drawerContent}
      </Box>
      {/* Drawer for mobile or forced mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: forceMobile ? 'block' : 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            background: '#1e293b',
            color: '#fff',
          },
        }}
      >
        {drawerContent}
      </Drawer>
      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          p: { xs: 1, md: 3 },
          background: '#f8fafc',
          height: '100%',
          overflowY: 'auto',
          position: 'relative',
        }}
        ref={mainContentRef}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Sidebar;
