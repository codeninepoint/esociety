"use client";
import React from "react";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from "@mui/material/ListItemText";
import { useRouter } from 'next/navigation';
import { ModuleContext } from '../ModuleProvider';
import { useContext, useEffect, useState, useRef } from 'react';

const MASTER_FILES_OPTIONS = [
  'Society',
  'Accounts / Vendors'
];

export default function MasterIndexPage() {
  const router = useRouter();
  const { moduleContext } = useContext(ModuleContext || React.createContext({ moduleContext: { society_name: '', society_code: '' } }));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRefs = useRef([]);

  // Ensure we have at least one item selected
  useEffect(() => {
    if (selectedIndex < 0) setSelectedIndex(0);
    if (selectedIndex >= MASTER_FILES_OPTIONS.length) setSelectedIndex(MASTER_FILES_OPTIONS.length - 1);
  }, [selectedIndex]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(i => Math.min(i + 1, MASTER_FILES_OPTIONS.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const opt = MASTER_FILES_OPTIONS[selectedIndex];
        goToType(opt);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedIndex]);

  function goToType(opt) {
    if (opt === 'Society') return router.push('/societies/society');
    if (opt === 'Accounts / Vendors') return router.push('/societies/accounts');
    return router.push('/societies/accounts');
  }

  return (
    <Box sx={{ p: 1 }}>
      <Paper elevation={1} sx={{ p: 1, mb: 1, bgcolor: '#071727', color: '#e6fffa' }}>
        <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>Selected Society</Typography>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>{moduleContext?.society_name || moduleContext?.society_code || '— none —'}</Typography>
      </Paper>

  <Paper elevation={6} sx={{ p: 1.5, bgcolor: '#041414', color: '#e6fff9' }}>
        <Typography variant="h6" sx={{ mb: 1, color: '#bdbdbd', fontSize: 14 }}>Create Account — Choose type</Typography>
        <List>
          {MASTER_FILES_OPTIONS.map((opt, idx) => (
            <ListItem key={opt} disablePadding>
              <ListItemButton
                onClick={() => { setSelectedIndex(idx); goToType(opt); }}
                selected={idx === selectedIndex}
                ref={el => listRefs.current[idx] = el}
                sx={{
                  color: '#e6fff9',
                  '& .MuiListItemText-primary': { color: '#e6fff9' },
                  bgcolor: idx === selectedIndex ? '#064a4a' : 'transparent',
                  borderRadius: 1,
                  px: 1,
                  '&:hover': { bgcolor: idx === selectedIndex ? '#075555' : '#022e2e' },
                  '&.Mui-focusVisible, &:focus-visible': { outline: '2px solid #0fb6a6', outlineOffset: '2px' }
                }}
              >
                <ListItemText primary={opt} primaryTypographyProps={{ sx: { color: '#e6fff9', fontWeight: 600 } }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ gridColumn: '1 / -1', my: 1, borderColor: '#374151' }} />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ px: 1, py: 0.25, bgcolor: '#111', border: '1px solid #374151', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700 }}>Ctrl+N</Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block' }}>New</Typography>
            </Box>
            <Box sx={{ px: 1, py: 0.25, bgcolor: '#111', border: '1px solid #374151', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700 }}>Esc</Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block' }}>Back</Typography>
            </Box>
          </Box> */}

          <Box>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>Choose an account type and press Enter</Typography>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}