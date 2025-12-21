"use client";
import React, { useEffect, useState, useContext, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import { ModuleContext } from '@/app/societies/ModuleProvider';
import { AppContext } from '@/app/ContextProvider';

/**
 * Shared AccountList component for listing accounts of any type
 * @param {Object} props
 * @param {string} props.accountType - The account type to list ('Bill Income' or 'members')
 * @param {string} props.title - Title to display (e.g., 'Bill Income Account')
 * @param {string} props.editPath - Path to navigate to for editing (e.g., '/societies/accounts/bill-income')
 * @param {string} props.backPath - Path to navigate back to (default: '/societies/accounts')
 * @param {Function} props.onBack - Optional callback when back is clicked (alternative to backPath)
 * @param {boolean} props.showBackButton - Whether to show the back button (default: true)
 */
export default function AccountList({ 
  accountType, 
  title, 
  editPath, 
  backPath = '/societies/accounts',
  onBack,
  showBackButton = true 
}) {
  const router = useRouter();
  const { moduleContext } = useContext(ModuleContext || React.createContext({ moduleContext: { society_name: '', society_code: '' } }));
  const { context } = useContext(AppContext || React.createContext({ context: {} }));
  
  const [acctList, setAcctList] = useState([]);
  const [societyId, setSocietyId] = useState(null);
  const [filter, setFilter] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const listRefs = useRef([]);
  const searchRef = useRef(null);
  
  // Delete confirmation state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmAccount, setConfirmAccount] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'info' });

  // Load list when component mounts or society changes
  useEffect(() => { 
    loadList(); 
  }, [moduleContext?.society_code, context?.organizationId, accountType]);

  async function loadList() {
    setLoading(true);
    try {
      if (!moduleContext?.society_code) {
        setAcctList([]);
        setSocietyId(null);
        return;
      }

      // Get society_id from society_code
      const orgId = context?.organizationId ? `&organizationId=${encodeURIComponent(context.organizationId)}` : '';
      const societyRes = await fetch(`/api/societies?code=${encodeURIComponent(moduleContext.society_code)}${orgId}`, { cache: 'no-store' });
      
      if (!societyRes.ok) {
        console.error('Failed to resolve society_id');
        setAcctList([]);
        setSocietyId(null);
        return;
      }

      const society = await societyRes.json();
      const resolvedSocietyId = society?.id || society?._id || null;

      if (!resolvedSocietyId) {
        console.error('Society ID not found');
        setAcctList([]);
        setSocietyId(null);
        return;
      }

      setSocietyId(resolvedSocietyId);

      // Fetch accounts
      const res = await fetch(`/api/accounts?accountType=${encodeURIComponent(accountType)}&societyId=${encodeURIComponent(resolvedSocietyId)}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        setAcctList(Array.isArray(json) ? json : []);
        setSelectedIndex(0);
      } else {
        console.error('Failed to load accounts', res.status);
        setAcctList([]);
      }
    } catch (e) {
      console.error('Failed to load acct list', e);
      setAcctList([]);
    } finally {
      setLoading(false);
    }
  }

  // Filter accounts
  const filtered = (acctList || []).filter(a => {
    const term = (filter || '').toString().toLowerCase();
    return !term || (a.acct_code || '').toString().toLowerCase().includes(term) || (a.name || '').toString().toLowerCase().includes(term);
  });

  // Keep selectedIndex in bounds
  useEffect(() => {
    if (selectedIndex < 0) setSelectedIndex(0);
    if (selectedIndex >= filtered.length) setSelectedIndex(Math.max(0, filtered.length - 1));
  }, [filtered, selectedIndex]);

  // Scroll selected item into view
  useEffect(() => {
    const el = listRefs.current[selectedIndex];
    if (el && typeof el.scrollIntoView === 'function') {
      try { el.scrollIntoView({ block: 'nearest', behavior: 'auto' }); } catch (e) { /* ignore */ }
    }
  }, [selectedIndex]);

  // Navigate to edit page
  const goToEdit = useCallback((item) => {
    if (!item) return;
    router.push(`${editPath}?code=${encodeURIComponent(item.acct_code)}`);
  }, [router, editPath]);

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      router.push(backPath);
    }
  }, [onBack, router, backPath]);

  // Called when delete icon is clicked or 'd' is pressed
  const onDeleteClick = useCallback((account) => {
    if (!account) return;
    setConfirmAccount(account);
    setConfirmOpen(true);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (confirmOpen) return;
      
      const tagName = document.activeElement?.tagName?.toLowerCase();
      const isInSearch = document.activeElement === searchRef.current;
      
      // If in search input
      if (isInSearch) {
        if (e.key === 'Enter' && filtered.length > 0) {
          e.preventDefault();
          goToEdit(filtered[0]);
        } else if (e.key === 'Escape') {
          e.preventDefault();
          handleBack();
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          searchRef.current?.blur();
          setSelectedIndex(0);
        }
        return;
      }
      
      // If in other input/textarea, only handle Escape
      if (tagName === 'input' || tagName === 'textarea') {
        if (e.key === 'Escape') { 
          e.preventDefault(); 
          handleBack(); 
        }
        return;
      }
      
      // List navigation
      if (e.key === 'ArrowDown') { 
        e.preventDefault(); 
        setSelectedIndex(i => Math.min(i + 1, Math.max(0, filtered.length - 1))); 
      }
      else if (e.key === 'ArrowUp') { 
        e.preventDefault(); 
        setSelectedIndex(i => Math.max(i - 1, 0)); 
      }
      else if (e.key === 'Enter') { 
        e.preventDefault(); 
        const sel = filtered[selectedIndex]; 
        if (sel) goToEdit(sel); 
      }
      else if (e.key === 'e' || e.key === 'E') { 
        e.preventDefault(); 
        const sel = filtered[selectedIndex]; 
        if (sel) goToEdit(sel); 
      }
      else if (e.key === 'd' || e.key === 'D' || e.key === 'Delete') { 
        e.preventDefault(); 
        const sel = filtered[selectedIndex]; 
        if (sel) onDeleteClick(sel);
      }
      else if (e.key === 'Escape') { 
        e.preventDefault(); 
        handleBack(); 
      }
      else if (e.key === '/' || e.key === 'f' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [filtered, selectedIndex, confirmOpen, goToEdit, onDeleteClick, handleBack]);

  // Delete confirmation handler
  async function onConfirmDelete() {
    if (!confirmAccount) {
      setSnack({ open: true, msg: 'No account selected', severity: 'error' });
      setConfirmOpen(false);
      return;
    }

    const accountId = confirmAccount.id || confirmAccount._id;
    const accountCode = confirmAccount.acct_code || confirmAccount.code;

    if (!accountId) {
      setSnack({ open: true, msg: 'Account ID not found', severity: 'error' });
      setConfirmOpen(false);
      setConfirmAccount(null);
      return;
    }

    try {
      const res = await fetch('/api/accounts/delete', {
        method: 'POST',
        body: JSON.stringify({ id: accountId }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        setSnack({ open: true, msg: `Deleted account ${accountCode}`, severity: 'success' });
        await loadList();
        setSelectedIndex(0);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setSnack({ open: true, msg: errorData.error || 'Delete failed', severity: 'error' });
      }
    } catch (e) {
      console.error('[AccountList] Delete error:', e);
      setSnack({ open: true, msg: String(e), severity: 'error' });
    } finally {
      setConfirmOpen(false);
      setConfirmAccount(null);
    }
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="h6" sx={{ color: '#bdbdbd', fontSize: 14 }}>{title}</Typography>
        {showBackButton && (
          <Button
            size="small"
            onClick={handleBack}
            sx={{ color: '#94a3b8', minWidth: 'auto', px: 1 }}
          >
            ← Back
          </Button>
        )}
      </Box>

      <Box sx={{ p: 1, pb: 0 }}>
        <TextField
          placeholder="Search account code or name... (Press / to focus)"
          variant="filled"
          size="small"
          fullWidth
          value={filter}
          onChange={e => { setFilter(e.target.value); setSelectedIndex(0); }}
          inputRef={searchRef}
          InputProps={{ sx: { bgcolor: '#011818', color: '#e6fff9' }, disableUnderline: true }}
        />
      </Box>

      <List dense sx={{ maxHeight: 380, overflow: 'auto', bgcolor: 'transparent' }}>
        {loading ? (
          <ListItem>
            <ListItemText primary="Loading..." primaryTypographyProps={{ color: '#94a3b8' }} />
          </ListItem>
        ) : filtered.length === 0 ? (
          <ListItem>
            <ListItemText primary="No accounts found" primaryTypographyProps={{ color: '#94a3b8' }} />
          </ListItem>
        ) : filtered.map((a, i) => (
          <ListItem
            key={a.id || a._id || a.acct_code || i}
            disablePadding
            secondaryAction={
              <Box sx={{ display: 'flex', gap: 0.5, pr: 0.5 }}>
                <IconButton size="small" onClick={() => goToEdit(a)} title="Edit (E)">
                  <EditIcon fontSize="small" sx={{ color: '#9ca3af' }} />
                </IconButton>
                <IconButton size="small" onClick={() => onDeleteClick(a)} title="Delete (D)">
                  <DeleteIcon fontSize="small" sx={{ color: '#fca3a5' }} />
                </IconButton>
              </Box>
            }
          >
            <ListItemButton
              selected={i === selectedIndex}
              onClick={() => goToEdit(a)}
              onFocus={() => setSelectedIndex(i)}
              ref={el => listRefs.current[i] = el}
              sx={{ 
                px: 1, 
                pr: 8, 
                bgcolor: i === selectedIndex ? '#012a2a' : 'transparent',
                '&.Mui-selected': {
                  bgcolor: '#012a2a',
                },
                '&:hover': {
                  bgcolor: i === selectedIndex ? '#013a3a' : '#022e2e',
                }
              }}
            >
              {i === selectedIndex ? (
                <CheckIcon fontSize="small" sx={{ mr: 1, color: '#00eaff' }} />
              ) : (
                <span style={{ width: 18, display: 'inline-block' }} />
              )}
              <ListItemText 
                primary={`${a.acct_code || ''} — ${a.name || ''}`} 
                primaryTypographyProps={{ color: i === selectedIndex ? '#e6fff9' : '#d1e8e8' }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 1, borderColor: '#374151' }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            ↑↓: Navigate • Enter/E: Edit • D: Delete • Esc: Back • /: Search
          </Typography>
        </Box>
        <Box>
          <Button 
            variant="contained" 
            size="small"
            onClick={() => router.push(editPath)} 
            startIcon={<AddIcon />}
          >
            New
          </Button>
        </Box>
      </Box>

      {/* Delete confirmation dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete account <strong>{confirmAccount?.acct_code || confirmAccount?.code}</strong> ({confirmAccount?.name})?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={onConfirmDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snack.open} 
        autoHideDuration={3000} 
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: { xs: 90, sm: 70 } }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </>
  );
}

