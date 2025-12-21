"use client";

import React from 'react';
import Link from 'next/link';
import { useState, useContext, useEffect, useRef } from 'react';
import { List, ListItem, ListItemIcon, ListItemText, Divider, Avatar, Collapse, Box, Drawer, IconButton } from '@mui/material';
import { Home, Group, AccountBalance, Receipt, Payment, Assessment, Settings, Person, ExitToApp, ExpandLess, ExpandMore, Menu } from '@mui/icons-material';
import ListItemButton from '@mui/material/ListItemButton';
import { LogOut } from 'lucide-react';
import { AppContext } from '@/app/ContextProvider';
import { useSession } from "next-auth/react";

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
  const { data: session } = useSession();
  
  const user = session?.user || { name: 'Guest', email: '', role: '' };
  const userInitials = user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'G';
  const userRole = user.role || 'User';

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
        background: 'transparent',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        py: 0,
        height: '100%',
      }}
    >
      <div>
        <div className="sidebar-logo" style={{ 
          padding: '0 20px', 
          fontWeight: 600, 
          fontSize: 14, 
          height: 48, 
          display: 'flex', 
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(99, 102, 241, 0.08)',
          borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
          letterSpacing: '0.3px',
          color: '#e2e8f0'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: '#818cf8' }}>
            <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          eSociety
        </div>
        <List sx={{ pt: 1.5, px: 1 }}>
          {menuItems.map((item) => {
            if (item.label === 'Societies' && item.children) {
              return (
                <React.Fragment key={item.label}>
                  <ListItem disablePadding sx={{ mb: 0.5 }}>
                    <Link href={item.href} style={{ width: '100%', display: 'flex' }}>
                      <ListItemButton
                        selected={selected === item.label}
                        onClick={() => {
                          setOpenSocieties((prev) => !prev);
                        }}
                        sx={{
                          py: 1,
                          px: 1.5,
                          borderRadius: '8px',
                          transition: 'all 0.15s ease',
                          '&:hover': {
                            background: 'rgba(99, 102, 241, 0.1)',
                          },
                          '&.Mui-selected': {
                            background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
                            borderLeft: '3px solid #6366f1',
                            '&:hover': {
                              background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)',
                            },
                          },
                        }}
                      >
                        {item.icon && <ListItemIcon sx={{ color: '#818cf8', minWidth: 32 }}>{item.icon}</ListItemIcon>}
                        <ListItemText 
                          primary={item.label} 
                          primaryTypographyProps={{ 
                            fontSize: 13, 
                            fontWeight: 500,
                            color: '#e2e8f0'
                          }} 
                        />
                      </ListItemButton>
                    </Link>
                    <IconButton
                      onClick={handleSocietiesClick}
                      sx={{ 
                        color: '#64748b', 
                        ml: 'auto', 
                        p: 0.5, 
                        mr: 0.5,
                        borderRadius: '6px',
                        '&:hover': {
                          background: 'rgba(99, 102, 241, 0.1)',
                          color: '#818cf8'
                        }
                      }}
                      size="small"
                      aria-label={openSocieties ? 'Collapse' : 'Expand'}
                    >
                      {openSocieties ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                    </IconButton>
                  </ListItem>
                  <Collapse in={openSocieties} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding sx={{ 
                      ml: 2, 
                      borderLeft: '1px solid rgba(148, 163, 184, 0.1)',
                      pl: 1 
                    }}>
                      {item.children.map((child) => (
                        <ListItem disablePadding key={child.label} sx={{ mb: 0.25 }}>
                          <Link href={child.href} style={{ width: '100%', display: 'flex' }}>
                            <ListItemButton 
                              sx={{ 
                                pl: 2, 
                                py: 0.75,
                                borderRadius: '6px',
                                transition: 'all 0.15s ease',
                                '&:hover': {
                                  background: 'rgba(99, 102, 241, 0.08)',
                                },
                                '&.Mui-selected': {
                                  background: 'rgba(99, 102, 241, 0.15)',
                                  '&:hover': {
                                    background: 'rgba(99, 102, 241, 0.2)',
                                  },
                                },
                              }} 
                              selected={selected === child.label}
                            >
                              {child.icon && <ListItemIcon sx={{ color: '#64748b', minWidth: 24 }}>{child.icon}</ListItemIcon>}
                              <ListItemText 
                                primary={child.label} 
                                primaryTypographyProps={{ 
                                  fontSize: 12, 
                                  fontWeight: 500,
                                  color: '#94a3b8'
                                }} 
                              />
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
                <ListItem disablePadding key={item.label} sx={{ mb: 0.5 }}>
                  <Link href={item.href} style={{ width: '100%', display: 'flex' }}>
                    <ListItemButton
                      selected={selected === item.label}
                      onClick={() => {
                        // Auto-collapse Societies submenu when another menu item is clicked
                        setOpenSocieties(false);
                      }}
                      sx={{
                        py: 1,
                        px: 1.5,
                        borderRadius: '8px',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          background: 'rgba(99, 102, 241, 0.1)',
                        },
                        '&.Mui-selected': {
                          background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
                          borderLeft: '3px solid #6366f1',
                          '&:hover': {
                            background: 'linear-gradient(90deg, rgba(99, 102, 241, 0.25) 0%, rgba(139, 92, 246, 0.15) 100%)',
                          },
                        },
                      }}
                    >
                      {item.icon && <ListItemIcon sx={{ color: '#818cf8', minWidth: 32 }}>{item.icon}</ListItemIcon>}
                      <ListItemText 
                        primary={item.label} 
                        primaryTypographyProps={{ 
                          fontSize: 13, 
                          fontWeight: 500,
                          color: '#e2e8f0'
                        }} 
                      />
                    </ListItemButton>
                  </Link>
                </ListItem>
              );
            }
          })}
        </List>
      </div>
      <div className="sidebar-user" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        padding: '12px 16px',
        background: 'rgba(99, 102, 241, 0.06)',
        borderTop: '1px solid rgba(148, 163, 184, 0.1)',
        gap: '12px',
        margin: '8px',
        borderRadius: '10px',
        marginTop: 'auto'
      }}>
        <Avatar sx={{ 
          width: 36, 
          height: 36, 
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', 
          fontSize: 13, 
          fontWeight: 600,
          boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
        }}>{userInitials}</Avatar>
        <div style={{ overflow: 'hidden' }}>
          <span style={{ color: '#f1f5f9', fontWeight: 500, fontSize: 13, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</span>
          <div style={{ color: '#64748b', fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{userRole}</div>
        </div>
      </div>
    </Box>
  );

  return (
    <>
      {/* Hamburger menu for mobile only */}
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        className="sidebar-hamburger-btn"
        sx={{
          position: 'fixed',
          top: 136,
          left: 12,
          zIndex: 50,
          display: 'none',
          '@media (max-width: 900px)': {
            display: 'flex',
          },
          background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
          color: '#f1f5f9',
          width: 40,
          height: 40,
          borderRadius: '10px',
          border: '1px solid rgba(148, 163, 184, 0.15)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.25)',
          '&:hover': {
            background: 'linear-gradient(135deg, #334155 0%, #475569 100%)',
            borderColor: 'rgba(148, 163, 184, 0.25)',
          },
        }}
      >
        <Menu />
      </IconButton>
      {/* Sidebar for desktop */}
      <Box
        className="sidebar-container"
        sx={{
          width: 240,
          flexShrink: 0,
          background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
          color: '#fff',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          py: 0,
          minHeight: 'calc(100vh - 124px)',
          borderRight: '1px solid rgba(148, 163, 184, 0.1)',
          position: 'relative',
          '@media (max-width: 900px)': {
            display: 'none',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            width: '1px',
            height: '100%',
            background: 'linear-gradient(180deg, rgba(99, 102, 241, 0.3) 0%, rgba(139, 92, 246, 0.1) 50%, transparent 100%)',
          },
        }}
      >
        {drawerContent}
      </Box>
      {/* Drawer for mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: 'none',
          '@media (max-width: 900px)': {
            display: 'block',
          },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 240,
            background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
            color: '#fff',
            borderRight: '1px solid rgba(148, 163, 184, 0.1)',
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Box ref={mainContentRef} sx={{ display: 'none' }} />
    </>
  );
}

export default Sidebar;
