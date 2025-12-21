"use client";
import React, { useEffect, useRef, useState, useContext } from "react";
import { AppContext } from '../../ContextProvider';
import { ModuleContext } from '../ModuleProvider';
import { useRouter } from 'next/navigation';
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Dialog from "@mui/material/Dialog";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import Tooltip from '@mui/material/Tooltip';



export default function SocietyIndexPage() {
  const router = useRouter();
  const { moduleContext, setModuleContext } = useContext(ModuleContext);
  const { context } = useContext(AppContext);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // society picker state
  const [societyListOpen, setSocietyListOpen] = useState(false);
  const [societyList, setSocietyList] = useState([]);
  const [societySearch, setSocietySearch] = useState('');
  const [societyListIndex, setSocietyListIndex] = useState(0);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const societyItemRefs = useRef([]);
  const societySearchRef = useRef(null);
  const [selectedSociety, setSelectedSociety] = useState(moduleContext?.society_code || '');

  useEffect(() => {
    setSelectedSociety(moduleContext?.society_code || '');
  }, [moduleContext]);

  // prefetch societies
  useEffect(() => {
    (async () => {
      try {
        const orgParam = context?.organizationId ? `?organizationId=${encodeURIComponent(context.organizationId)}` : '';
        const res = await fetch(`/api/societies/list${orgParam}`, { cache: 'no-store' });
        if (res.ok) {
          const list = await res.json().catch(() => null);
          if (Array.isArray(list)) setSocietyList(list);
          else if (list && Array.isArray(list.societies)) setSocietyList(list.societies);
        }
      } catch (e) { /* ignore */ }
    })();
  }, []);

  async function loadSocietyList() {
    try {
      const orgParam = context?.organizationId ? `?organizationId=${encodeURIComponent(context.organizationId)}` : '';
      const res = await fetch(`/api/societies/list${orgParam}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        // Accept either an array or an object { societies: [...] }
        if (Array.isArray(json)) setSocietyList(json);
        else if (json && Array.isArray(json.societies)) setSocietyList(json.societies);
      }
    } catch (e) {
      console.error('Failed to load societies', e);
    }
  }

  const societyFiltered = (societyList || []).filter(s => {
    const term = (societySearch || '').toString().toLowerCase();
    const code = (s.society_code || '').toString().toLowerCase();
    const name = (s.name || '').toString().toLowerCase();
    return !term || code.includes(term) || name.includes(term);
  });

  useEffect(() => {
    setSocietyListIndex(i => {
      if (!Array.isArray(societyFiltered) || societyFiltered.length === 0) return 0;
      return Math.min(i, societyFiltered.length - 1);
    });
  }, [societyFiltered]);

  // keyboard navigation for the inline societies list (Arrow keys + Enter => edit)
  useEffect(() => {
    function onInlineListKey(e) {
      // ignore when the picker dialog is open — it has its own handlers
      if (societyListOpen) return;
      if (!Array.isArray(societyFiltered) || societyFiltered.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSocietyListIndex(i => Math.min(i + 1, Math.max(0, societyFiltered.length - 1)));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSocietyListIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const sel = societyFiltered[societyListIndex];
        if (sel) {
          // Apply the society to the ModuleContext only (do not navigate)
          applySociety(sel);
        }
      }
    }
    window.addEventListener('keydown', onInlineListKey);
    return () => window.removeEventListener('keydown', onInlineListKey);
  }, [societyListOpen, societyFiltered, societyListIndex, router]);

  // global shortcuts on the Society picker page:
  // Cmd/Ctrl+N => navigate to manage (new)
  // Cmd/Ctrl+E => navigate to manage?code=<selected> (edit)
  // Escape => go back to societies dashboard
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'info' });
  useEffect(() => {
    function onShortcuts(e) {
      // Prefer Cmd/Ctrl+Alt+N as a reliable in-app shortcut (browsers rarely
      // reserve the Alt variant). If plain Cmd/Ctrl+N is used we still try
      // to handle it, but browsers often ignore preventDefault for that key
      // and will open a new window — so show a hint recommending the Alt
      // variant when that happens.
      if ((e.ctrlKey || e.metaKey) && e.key && e.key.toLowerCase() === 'n') {
        // If Alt is held, this should be reliable.
        if (e.altKey) {
          try { e.preventDefault(); } catch (err) { /* ignore */ }
          router.push('/societies/society/manage');
          return;
        }

        // Plain Cmd/Ctrl+N: attempt to handle but warn the user if the
        // browser intercepts (we can't reliably prevent the browser).
        try { e.preventDefault(); } catch (err) { /* ignore */ }
        router.push('/societies/society/manage');
        // show a short hint that Cmd/Ctrl+Alt+N is more reliable
        setSnack({ open: true, msg: 'Browser may open a new window for Cmd/Ctrl+N — use Cmd/Ctrl+Alt+N for reliable in-app shortcut', severity: 'info' });
        return;
      }

      // When focus is in an input (like the search), don't intercept normal typing
      const active = document.activeElement;
      const activeTag = active && active.tagName ? active.tagName.toLowerCase() : null;
      const isTyping = activeTag === 'input' || activeTag === 'textarea' || (active && active.getAttribute && active.getAttribute('role') === 'textbox');

      // Allow other shortcuts only when modifier keys are used or when Escape
      if (!((e.ctrlKey || e.metaKey) || e.key === 'Escape')) return;

      // Cmd/Ctrl+E => edit selected society
      if ((e.ctrlKey || e.metaKey) && e.key && e.key.toLowerCase() === 'e') {
        e.preventDefault();
        if (!Array.isArray(societyFiltered) || societyFiltered.length === 0) {
          setSnack({ open: true, msg: 'No society selected', severity: 'info' });
          return;
        }
        const sel = societyFiltered[societyListIndex];
        if (!sel) { setSnack({ open: true, msg: 'No society selected', severity: 'info' }); return; }
        router.push(`/societies/society/manage?code=${encodeURIComponent(sel.society_code || sel.code || '')}`);
        return;
      }

      // Escape => go back to societies dashboard
      if (e.key === 'Escape') {
        e.preventDefault();
        router.push('/societies/main');
        return;
      }
    }
    window.addEventListener('keydown', onShortcuts, { capture: true });
    return () => window.removeEventListener('keydown', onShortcuts, { capture: true });
  }, [societyFiltered, societyListIndex, router]);

  useEffect(() => {
    if (!societyListOpen) return;
    const t = setTimeout(() => {
      const el = societySearchRef.current;
      if (el && typeof el.focus === 'function') {
        try { el.focus(); if (typeof el.select === 'function') el.select(); } catch (e) { /* ignore */ }
      }
    }, 50);
    return () => clearTimeout(t);
  }, [societyListOpen]);

  // keyboard navigation when picker open
  useEffect(() => {
    function onKey(e) {
      if (!societyListOpen) return;
      if (e.key === 'ArrowDown') { e.preventDefault(); setSocietyListIndex(i => Math.min(i + 1, Math.max(0, (societyFiltered || []).length - 1))); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setSocietyListIndex(i => Math.max(i - 1, 0)); }
      else if (e.key === 'Enter') {
        e.preventDefault();
        const sel = (societyFiltered || [])[societyListIndex];
        if (sel) applySociety(sel);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setSocietyListOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [societyListOpen, societyFiltered, societyListIndex]);

  function applySociety(s) {
    const code = s?.society_code || s?.code || '';
    const name = s?.name || s?.society_name || '';
    setModuleContext({ ...moduleContext, society_code: code, society_name: name });
    setSelectedSociety(code);
    setSocietyListOpen(false);
  }

  function openDeleteConfirm(s) {
    setDeleteTarget(s || null);
    setDeleteConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!deleteTarget) return;
    try {
      const payload = { code: deleteTarget.society_code || deleteTarget.code };
      if (context?.organizationId) payload.organization_id = context.organizationId;
      const res = await fetch('/api/societies/delete', { method: 'DELETE', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
      if (res.ok) {
        setSnack({ open: true, msg: 'Society deleted', severity: 'success' });
      } else {
        const j = await res.json().catch(() => ({}));
        setSnack({ open: true, msg: j?.error || 'Delete failed', severity: 'error' });
      }
    } catch (err) {
      setSnack({ open: true, msg: String(err), severity: 'error' });
    } finally {
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
      try { await loadSocietyList(); } catch (e) { /* ignore */ }
      setSocietyListIndex(0);
    }
  }

  return (
    <Box sx={{ p: 1 }}>
      <Paper elevation={1} sx={{ p: 1, mb: 1, bgcolor: '#071727', color: '#e6fffa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>Organization</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>{context?.organizationName || context?.organization || '\u2014 none \u2014'}</Typography>
          </Box>

          <Box sx={{ minWidth: 220 }}>
            <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>Society</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>
              {moduleContext?.society_name ? (
                <>{moduleContext.society_name} {moduleContext.society_code ? `(${moduleContext.society_code})` : ''}</>
              ) : (
                '\u2014 none \u2014'
              )}
            </Typography>
          </Box>
        </Box>
      </Paper>

     

      {/* Inline societies list on the page (search + list) */}
      <Paper elevation={6} sx={{ p: 1.5, bgcolor: '#041414', color: '#e6fff9', mt: 2 }}>
        <Typography variant="h6" sx={{ mb: 1, color: '#bdbdbd', fontSize: 14 }}>Societies</Typography>
        <Box sx={{ p: 1, pb: 0 }}>
          <TextField
            placeholder="Search societies..."
            variant="filled"
            size="small"
            fullWidth
            value={societySearch}
            onChange={e => { setSocietySearch(e.target.value); setSocietyListIndex(0); }}
            InputProps={{ sx: { bgcolor: '#011818', color: '#e6fff9' }, disableUnderline: true }}
          />
        </Box>
        <List dense sx={{ bgcolor: 'transparent', maxHeight: 320, overflow: 'auto' }}>
          {societyFiltered.length === 0 ? (
            <ListItem>
              <ListItemText primary="No societies" primaryTypographyProps={{ color: '#94a3b8' }} />
            </ListItem>
          ) : societyFiltered.map((s, i) => (
            <ListItem key={s.society_code || i} disablePadding>
              <ListItemButton
                selected={i === societyListIndex}
                onClick={() => { applySociety(s); }}
                sx={{ px: 1, bgcolor: i === societyListIndex ? '#012a2a' : 'transparent' }}
              >
                {i === societyListIndex ? <CheckIcon fontSize="small" sx={{ mr: 1, color: '#00eaff' }} /> : <span style={{ width: 18, display: 'inline-block' }} />}
                <ListItemText primary={`${s.society_code || ''} — ${s.name || ''}`} primaryTypographyProps={{ color: i === societyListIndex ? '#e6fff9' : '#d1e8e8' }} />
                <IconButton size="small" onClick={(ev) => { ev.stopPropagation(); router.push(`/societies/society/manage?code=${encodeURIComponent(s.society_code || s.code || '')}`); }} title="Edit"><EditIcon fontSize="small" sx={{ color: '#9ca3af' }} /></IconButton>
                <IconButton size="small" onClick={(ev) => { ev.stopPropagation(); openDeleteConfirm(s); }} title="Delete"><DeleteIcon fontSize="small" sx={{ color: '#fca3a5' }} /></IconButton>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
          <Divider sx={{ gridColumn: '1 / -1', my: 1, borderColor: '#374151' }} />
        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" sx={{ color: '#94a3b8' }}>
              Enter: Set • Ctrl/Cmd+N: New • Ctrl/Cmd+E: Edit • Esc: Back
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Add Society">
              <Button
                variant="contained"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => router.push('/societies/society/manage')}
              >
                Add
              </Button>
            </Tooltip>
          </Box>
        </Box>
      </Paper>

      <Dialog open={societyListOpen} onClose={() => setSocietyListOpen(false)}>
        <Paper sx={{ width: 520, bgcolor: '#041414', color: '#e6f6f6' }}>
          <Typography sx={{ p: 1, bgcolor: '#073636', color: '#e6f6f6' }}>Societies (Ctrl+K)</Typography>
          <Box sx={{ p: 1 }}>
            <TextField
              placeholder="Search code or name..."
              variant="filled"
              size="small"
              fullWidth
              value={societySearch}
              onChange={e => { setSocietySearch(e.target.value); setSocietyListIndex(0); }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const sel = (societyFiltered || [])[societyListIndex];
                  if (sel) applySociety(sel);
                }
              }}
              inputRef={societySearchRef}
              InputProps={{ sx: { bgcolor: '#011818', color: '#e6fff9' }, disableUnderline: true }}
            />
          </Box>
          <List dense sx={{ bgcolor: 'transparent', maxHeight: 360, overflow: 'auto' }}>
            {societyFiltered.length === 0 ? (
              <ListItem>
                <ListItemText primary="No results" primaryTypographyProps={{ color: '#94a3b8' }} />
              </ListItem>
            ) : societyFiltered.map((s, i) => (
              <ListItem key={s.society_code || i} disablePadding>
                <ListItemButton
                  selected={i === societyListIndex}
                  onClick={() => applySociety(s)}
                  ref={el => (societyItemRefs.current[i] = el)}
                  sx={{ px: 1, bgcolor: i === societyListIndex ? '#012a2a' : 'transparent' }}
                >
                  {i === societyListIndex ? <CheckIcon fontSize="small" sx={{ mr: 1, color: '#00eaff' }} /> : <span style={{ width: 18, display: 'inline-block' }} />}
                  <ListItemText primary={`${s.society_code || ''}  —  ${s.name || ''}`} primaryTypographyProps={{ color: i === societyListIndex ? '#e6fff9' : '#d1e8e8' }} />
                  <IconButton size="small" onClick={(ev) => { ev.stopPropagation(); /* edit navigation */ router.push(`/societies/society/manage?code=${encodeURIComponent(s.society_code || s.code || '')}`); }} title="Edit"><EditIcon fontSize="small" sx={{ color: '#9ca3af' }} /></IconButton>
                  <IconButton size="small" onClick={(ev) => { ev.stopPropagation(); openDeleteConfirm(s); }} title="Delete"><DeleteIcon fontSize="small" sx={{ color: '#fca3a5' }} /></IconButton>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          
        </Paper>
      </Dialog>
      <Dialog open={deleteConfirmOpen} onClose={() => { setDeleteConfirmOpen(false); setDeleteTarget(null); }}>
        <DialogTitle>Delete Society</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the society &quot;{deleteTarget?.society_code || ''} — {deleteTarget?.name || ''}&quot;? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setDeleteConfirmOpen(false); setDeleteTarget(null); }}>Cancel</Button>
          <Button color="error" onClick={handleConfirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(prev => ({ ...prev, open: false }))}>
        <Alert onClose={() => setSnack(prev => ({ ...prev, open: false }))} severity={snack.severity} sx={{ width: '100%' }}>
          {snack.msg}
        </Alert>
      </Snackbar>
    </Box>
  );
}
