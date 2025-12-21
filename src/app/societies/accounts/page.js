"use client";
import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import { useRouter } from 'next/navigation';
import { ModuleContext } from '../ModuleProvider';
import { useContext, useEffect, useState, useRef } from 'react';
import AccountList from '@/components/accounts/AccountList';

const ACCOUNT_TYPE_OPTIONS = [
  { key: 'members', label: 'Members', accountType: 'members', editPath: '/societies/accounts/member' },
  { key: 'bill-income', label: 'Bill Income', accountType: 'Bill Income', editPath: '/societies/accounts/bill-income' },
  { key: 'banks', label: 'Banks', accountType: 'banks', editPath: '/societies/accounts/banks' },
  { key: 'cash-books', label: 'Cash Books', accountType: 'cash-books', editPath: '/societies/accounts/cash-books' },
  { key: 'expenses', label: 'Expenses', accountType: 'expenses', editPath: '/societies/accounts/expenses' },
];

export default function AccountsIndexPage() {
  const router = useRouter();
  const { moduleContext } = useContext(ModuleContext || React.createContext({ moduleContext: { society_name: '', society_code: '' } }));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRefs = useRef([]);
  
  // State to track which account type list we're showing (null or one of the ACCOUNT_TYPE_OPTIONS keys)
  const [showAccountListType, setShowAccountListType] = useState(null);

  // Get the currently selected account type config
  const selectedAccountConfig = ACCOUNT_TYPE_OPTIONS.find(opt => opt.key === showAccountListType);

  // Ensure we have at least one item selected
  useEffect(() => {
    if (selectedIndex < 0) setSelectedIndex(0);
    if (selectedIndex >= ACCOUNT_TYPE_OPTIONS.length) setSelectedIndex(ACCOUNT_TYPE_OPTIONS.length - 1);
  }, [selectedIndex]);

  // Keyboard navigation for account type options (when account list is not shown)
  useEffect(() => {
    if (showAccountListType) return; // Don't handle when account list is shown
    
    function onKey(e) {
      // Don't handle if focus is in search input
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
        return;
      }
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, ACCOUNT_TYPE_OPTIONS.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const opt = ACCOUNT_TYPE_OPTIONS[selectedIndex];
        goToType(opt);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        router.push('/societies/main');
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedIndex, showAccountListType, router]);

  function goToType(opt) {
    if (opt.key === 'members' || opt.key === 'bill-income') {
      // Show the account list in the same Paper
      setShowAccountListType(opt.key);
      return;
    }
    // For other account types, stay on this page (they're not implemented yet)
    // router.push('/societies/accounts');
  }

  function handleBack() {
    setShowAccountListType(null);
  }

  return (
    <Box sx={{ p: 1 }}>
      <Paper elevation={1} sx={{ p: 1, mb: 1, bgcolor: '#071727', color: '#e6fffa' }}>
        <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>Selected Society</Typography>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>{moduleContext?.society_name || moduleContext?.society_code || '— none —'}</Typography>
      </Paper>

      <Paper elevation={6} sx={{ p: 1.5, bgcolor: '#041414', color: '#e6fff9' }}>
        {showAccountListType && selectedAccountConfig ? (
          // Show account list using the shared component
          <AccountList
            accountType={selectedAccountConfig.accountType}
            title={`${selectedAccountConfig.label} / Accounts`}
            editPath={selectedAccountConfig.editPath}
            onBack={handleBack}
            showBackButton={true}
          />
        ) : (
          // Show account type options
          <>
            <Typography variant="h6" sx={{ mb: 1, color: '#bdbdbd', fontSize: 14 }}>Accounts — Choose type</Typography>
            <List>
              {ACCOUNT_TYPE_OPTIONS.map((opt, idx) => (
                <ListItem key={opt.key} disablePadding>
                  <ListItemButton
                    onClick={() => { setSelectedIndex(idx); goToType(opt); }}
                    selected={idx === selectedIndex}
                    ref={el => listRefs.current[idx] = el}
                    disabled={opt.key !== 'members' && opt.key !== 'bill-income'}
                    sx={{
                      color: '#e6fff9',
                      '& .MuiListItemText-primary': { color: '#e6fff9' },
                      bgcolor: idx === selectedIndex ? '#064a4a' : 'transparent',
                      borderRadius: 1,
                      px: 1,
                      opacity: (opt.key === 'members' || opt.key === 'bill-income') ? 1 : 0.5,
                      '&:hover': { 
                        bgcolor: idx === selectedIndex ? '#075555' : '#022e2e' 
                      },
                      '&.Mui-selected': {
                        bgcolor: '#064a4a',
                        '&:hover': { 
                          bgcolor: '#075555' 
                        }
                      },
                      '&.Mui-focusVisible': { 
                        bgcolor: idx === selectedIndex ? '#064a4a' : '#022e2e',
                        outline: '2px solid #0fb6a6', 
                        outlineOffset: '2px' 
                      },
                      '&:focus-visible': { 
                        bgcolor: idx === selectedIndex ? '#064a4a' : '#022e2e',
                        outline: '2px solid #0fb6a6', 
                        outlineOffset: '2px' 
                      },
                      '&.Mui-selected.Mui-focusVisible': {
                        bgcolor: '#064a4a',
                        outline: '2px solid #0fb6a6',
                        outlineOffset: '2px'
                      },
                      '&.Mui-selected:focus-visible': {
                        bgcolor: '#064a4a',
                        outline: '2px solid #0fb6a6',
                        outlineOffset: '2px'
                      }
                    }}
                  >
                    <ListItemText 
                      primary={opt.label} 
                      secondary={(opt.key !== 'members' && opt.key !== 'bill-income') ? 'Coming soon' : null}
                      primaryTypographyProps={{ sx: { color: '#e6fff9', fontWeight: 600 } }} 
                      secondaryTypographyProps={{ sx: { color: '#64748b', fontSize: 11 } }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ gridColumn: '1 / -1', my: 1, borderColor: '#374151' }} />
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" sx={{ color: '#94a3b8' }}>
                  ↑↓: Navigate • Enter: Select • Esc: Back
                </Typography>
              </Box>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}
