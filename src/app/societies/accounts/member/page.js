"use client";
import React, { useEffect, useState, useContext, useRef } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import { useRouter, useSearchParams } from 'next/navigation';
import { ModuleContext } from '../../ModuleProvider';
import { AppContext } from '../../../ContextProvider';

const FIELD_ORDER = ['acct_code', 'name', 'member_number', 'member_id', 'joined_date', 'sq_ft_area', 'flat_no', 'active'];

export default function MemberAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { moduleContext } = useContext(ModuleContext || React.createContext({ moduleContext: { society_name: '', society_code: '' } }));
  const { context } = useContext(AppContext || React.createContext({ context: {} }));
  const [form, setForm] = useState({ member_number: '', member_id: '', joined_date: '', sq_ft_area: '', flat_no: '', active: 'Y', acct_code: '', name: '', account_type: 'Members' });
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'info' });
  const [loading, setLoading] = useState(false);
  const [focusIndex, setFocusIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const refs = useRef([]);

  function handleChange(name, value) {
    setForm(prev => ({ ...prev, [name]: value }));
  }

  // Load account data when code is provided in query params
  useEffect(() => {
    const code = searchParams?.get('code');
    if (!code || !moduleContext?.society_code) return;

    async function loadAccount() {
      setLoading(true);
      try {
        // Get society_id from society_code
        const orgId = context?.organizationId ? `&organizationId=${encodeURIComponent(context.organizationId)}` : '';
        const societyRes = await fetch(`/api/societies?code=${encodeURIComponent(moduleContext.society_code)}${orgId}`, { cache: 'no-store' });
        
        if (!societyRes.ok) {
          console.error('Failed to resolve society_id');
          setLoading(false);
          return;
        }

        const society = await societyRes.json();
        const societyId = society?.id || society?._id || null;

        if (!societyId) {
          console.error('Society ID not found');
          setLoading(false);
          return;
        }

        // Fetch all member accounts and find the one with matching code
        const res = await fetch(`/api/accounts?accountType=members&societyId=${encodeURIComponent(societyId)}`, { cache: 'no-store' });
        if (res.ok) {
          const accounts = await res.json();
          const account = Array.isArray(accounts) ? accounts.find(a => (a.acct_code || a.code) === code) : null;
          
          if (account) {
            // Handle active field: convert boolean to Y/N string
            const activeValue = account.member?.active !== undefined 
              ? (typeof account.member.active === 'boolean' ? (account.member.active ? 'Y' : 'N') : account.member.active)
              : (account.active !== undefined 
                ? (typeof account.active === 'boolean' ? (account.active ? 'Y' : 'N') : account.active)
                : 'Y');
            
            // Map account data to form (handling nested member structure)
            setForm({
              id: account.id || account._id || '',
              acct_code: account.acct_code || account.code || '',
              name: account.name || '',
              member_number: account.member?.member_number || account.member_number || '',
              member_id: account.member?.member_id || account.member_id || '',
              joined_date: account.member?.joined_date || account.joined_date || '',
              sq_ft_area: account.member?.sq_ft_area !== undefined ? String(account.member.sq_ft_area) : (account.sq_ft_area !== undefined ? String(account.sq_ft_area) : ''),
              active: activeValue,
              account_type: account.account_type || 'Members',
              flat_shop: account.member?.flat_shop || account.flat_shop || 'F',
              flat_no: account.member?.flat_no || account.flat_no || '',
              open_bal: account.open_bal || 0,
              debit_credit: account.debit_credit || 'D',
              prin_bill: account.prin_bill || 0,
              interest_amt: account.interest_amt || 0,
              prev_years_bal: account.prev_years_bal || 0,
              sinking_fund: account.sinking_fund || 0,
              classify: account.classify || '',
              other_info: account.other_info || '',
              member: {
                ...(account.member?.id && { id: account.member.id }),
                email: account.member?.email || '',
                phone: account.member?.phone || ''
              }
            });
          }
        }
      } catch (e) {
        console.error('Failed to load account', e);
      } finally {
        setLoading(false);
      }
    }

    loadAccount();
  }, [searchParams, moduleContext?.society_code, context?.organizationId]);

  async function handleSave() {
    if (!form.acct_code || !form.name) {
      setSnack({ open: true, msg: 'Provide Account Code and Name', severity: 'warning' });
      return;
    }
    try {
      const isUpdate = !!form.id;
      
      // Get society_id if needed
      let societyId = null;
      if (moduleContext?.society_code && context?.organizationId) {
        try {
          const orgId = context.organizationId ? `&organizationId=${encodeURIComponent(context.organizationId)}` : '';
          const societyRes = await fetch(`/api/societies?code=${encodeURIComponent(moduleContext.society_code)}${orgId}`, { cache: 'no-store' });
          if (societyRes.ok) {
            const society = await societyRes.json();
            societyId = society?.id || society?._id || null;
          }
        } catch (e) {
          console.error('Failed to get society_id', e);
        }
      }
      
      // Convert active from 'Y'/'N' to boolean
      const activeBoolean = form.active === 'Y' || form.active === true || form.active === 'true';
      
      // Convert sq_ft_area to number
      const sqFtArea = form.sq_ft_area ? parseFloat(form.sq_ft_area) : 0;
      
      // Structure payload according to Core service format
      const memberObj = {
        name: form.name,
        active: activeBoolean,
        flat_shop: form.flat_shop || 'F',
        flat_no: form.flat_no || '',
        sq_ft_area: sqFtArea,
        member_number: form.member_number || '',
        ...(form.joined_date && { joined_date: form.joined_date }),
        ...(form.member?.email && { email: form.member.email }),
        ...(form.member?.phone && { phone: form.member.phone }),
      };
      
      // Add member id if it exists (for updates)
      if (form.member_id) {
        memberObj.member_id = form.member_id;
      }
      // If we have a member object with id from loaded account, include it
      if (form.member?.id) {
        memberObj.id = form.member.id;
      }
      
      const payload = {
        ...(form.id && { id: form.id }),
        name: form.name,
        acct_code: form.acct_code,
        account_type: form.account_type || 'Members',
        member_flag: 'Y',
        member: memberObj,
        ...(societyId && { society_id: societyId }),
        open_bal: form.open_bal || 0,
        debit_credit: form.debit_credit || 'D',
        prin_bill: form.prin_bill || 0,
        interest_amt: form.interest_amt || 0,
        prev_years_bal: form.prev_years_bal || 0,
        sinking_fund: form.sinking_fund || 0,
        ...(form.classify && { classify: form.classify }),
        ...(form.other_info && { other_info: form.other_info }),
      };
      
      const method = isUpdate ? 'PUT' : 'POST';
      const res = await fetch('/api/accounts', { 
        method, 
        body: JSON.stringify(payload), 
        headers: { 'Content-Type': 'application/json' } 
      });
      
      if (res.ok) {
        const data = await res.json();
        setSnack({ open: true, msg: isUpdate ? 'Member account updated' : 'Member account created', severity: 'success' });
        // Navigate back to the accounts list after a short delay to show the success message
        setTimeout(() => {
          router.push('/societies/accounts');
        }, 1000);
      } else {
        const errorData = await res.json().catch(() => ({}));
        setSnack({ open: true, msg: errorData.error || 'Save failed', severity: 'error' });
      }
    } catch (e) {
      setSnack({ open: true, msg: String(e), severity: 'error' });
    }
  }

  useEffect(() => { refs.current = refs.current.slice(0, FIELD_ORDER.length); }, []);

  // Focus the first field on mount
  useEffect(() => {
    const t = setTimeout(() => {
      const el = refs.current[focusIndex];
      if (el) {
        try { el.focus(); if (typeof el.select === 'function') el.select(); } catch (e) { /* ignore */ }
      }
    }, 50);
    return () => clearTimeout(t);
  }, [focusIndex]);

  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); handleSave(); }
      else if (e.key === 'Escape') { 
        e.preventDefault(); 
        if (editing) {
          setEditing(false);
          const el = refs.current[focusIndex];
          if (el) el.focus();
        } else {
          router.push('/societies/accounts');
        }
      }
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') { 
        e.preventDefault(); 
        router.push('/societies/accounts/member');
        setFocusIndex(0);
        setEditing(false);
      }
      else if (!editing) {
        if (e.key === 'ArrowDown') { 
          e.preventDefault(); 
          setFocusIndex(i => Math.min(i + 1, FIELD_ORDER.length - 1)); 
        }
        else if (e.key === 'ArrowUp') { 
          e.preventDefault(); 
          setFocusIndex(i => Math.max(i - 1, 0)); 
        }
        else if (e.key === 'Enter') { 
          e.preventDefault(); 
          setEditing(true); 
          const el = refs.current[focusIndex];
          if (el && typeof el.select === 'function') el.select();
        }
      }
    }
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [form, editing, focusIndex]);

  return (
    <Box sx={{ p: 1 }}>
      <Paper elevation={1} sx={{ p: 1, mb: 1, bgcolor: '#052020', color: '#e6fff9' }}>
        <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>Selected Society</Typography>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>{moduleContext?.society_name || moduleContext?.society_code || '— none —'}</Typography>
      </Paper>
      <Paper sx={{ p: 2, bgcolor: '#041414', color: '#e6fff9' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>{form.id ? 'Edit Member Account' : 'Create Member Account'}</Typography>
        <Box component="form" sx={{ display: 'grid', gap: 1 }}>
          {/* Hidden field for account_type */}
          <input type="hidden" name="account_type" value="Members" />
          <TextField 
            label="Account Code" 
            value={form.acct_code} 
            onChange={e => handleChange('acct_code', e.target.value.toUpperCase())} 
            variant="filled" 
            inputRef={el => { if (el) refs.current[0] = el; }}
            onFocus={() => { setFocusIndex(0); setEditing(true); }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const nextIndex = Math.min(1, FIELD_ORDER.length - 1);
                setFocusIndex(nextIndex);
                setEditing(true);
                setTimeout(() => {
                  const el = refs.current[nextIndex];
                  if (el) {
                    try { el.focus(); if (typeof el.select === 'function') el.select(); } catch (err) { /* ignore */ }
                  }
                }, 0);
              }
            }}
            InputProps={{ sx: { bgcolor: focusIndex === 0 ? '#073642' : '#021717', color: '#e6fff9' } }} 
            InputLabelProps={{ sx: { color: '#9ca3af' } }} 
          />
          <TextField 
            label="Account Name" 
            value={form.name} 
            onChange={e => handleChange('name', e.target.value)} 
            variant="filled" 
            inputRef={el => { if (el) refs.current[1] = el; }}
            onFocus={() => { setFocusIndex(1); setEditing(true); }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const nextIndex = Math.min(2, FIELD_ORDER.length - 1);
                setFocusIndex(nextIndex);
                setEditing(true);
                setTimeout(() => {
                  const el = refs.current[nextIndex];
                  if (el) {
                    try { el.focus(); if (typeof el.select === 'function') el.select(); } catch (err) { /* ignore */ }
                  }
                }, 0);
              }
            }}
            InputProps={{ sx: { bgcolor: focusIndex === 1 ? '#073642' : '#021717', color: '#e6fff9' } }} 
            InputLabelProps={{ sx: { color: '#9ca3af' } }} 
          />
          <TextField 
            label="Member No." 
            value={form.member_number} 
            onChange={e => handleChange('member_number', e.target.value)} 
            variant="filled" 
            inputRef={el => { if (el) refs.current[2] = el; }}
            onFocus={() => { setFocusIndex(2); setEditing(true); }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const nextIndex = Math.min(3, FIELD_ORDER.length - 1);
                setFocusIndex(nextIndex);
                setEditing(true);
                setTimeout(() => {
                  const el = refs.current[nextIndex];
                  if (el) {
                    try { el.focus(); if (typeof el.select === 'function') el.select(); } catch (err) { /* ignore */ }
                  }
                }, 0);
              }
            }}
            InputProps={{ sx: { bgcolor: focusIndex === 2 ? '#073642' : '#021717', color: '#e6fff9' } }} 
            InputLabelProps={{ sx: { color: '#9ca3af' } }} 
          />
          <TextField 
            label="Member ID" 
            value={form.member_id} 
            onChange={e => handleChange('member_id', e.target.value)} 
            variant="filled" 
            inputRef={el => { if (el) refs.current[3] = el; }}
            onFocus={() => { setFocusIndex(3); setEditing(true); }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const nextIndex = Math.min(4, FIELD_ORDER.length - 1);
                setFocusIndex(nextIndex);
                setEditing(true);
                setTimeout(() => {
                  const el = refs.current[nextIndex];
                  if (el) {
                    try { el.focus(); if (typeof el.select === 'function') el.select(); } catch (err) { /* ignore */ }
                  }
                }, 0);
              }
            }}
            InputProps={{ sx: { bgcolor: focusIndex === 3 ? '#073642' : '#021717', color: '#e6fff9' } }} 
            InputLabelProps={{ sx: { color: '#9ca3af' } }} 
          />
          <TextField 
            label="Joined Date" 
            type="date" 
            InputLabelProps={{ shrink: true, sx: { color: '#9ca3af' } }} 
            value={form.joined_date} 
            onChange={e => handleChange('joined_date', e.target.value)} 
            variant="filled" 
            inputRef={el => { if (el) refs.current[4] = el; }}
            onFocus={() => { setFocusIndex(4); setEditing(true); }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const nextIndex = Math.min(5, FIELD_ORDER.length - 1);
                setFocusIndex(nextIndex);
                setEditing(true);
                setTimeout(() => {
                  const el = refs.current[nextIndex];
                  if (el) {
                    try { el.focus(); if (typeof el.select === 'function') el.select(); } catch (err) { /* ignore */ }
                  }
                }, 0);
              }
            }}
            InputProps={{ sx: { bgcolor: focusIndex === 4 ? '#073642' : '#021717', color: '#e6fff9' } }} 
          />
          <TextField 
            label="Area (sq.ft)" 
            type="number" 
            value={form.sq_ft_area} 
            onChange={e => handleChange('sq_ft_area', e.target.value)} 
            variant="filled" 
            inputRef={el => { if (el) refs.current[5] = el; }}
            onFocus={() => { setFocusIndex(5); setEditing(true); }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const nextIndex = Math.min(6, FIELD_ORDER.length - 1);
                setFocusIndex(nextIndex);
                setEditing(true);
                setTimeout(() => {
                  const el = refs.current[nextIndex];
                  if (el) {
                    try { el.focus(); if (typeof el.select === 'function') el.select(); } catch (err) { /* ignore */ }
                  }
                }, 0);
              }
            }}
            InputProps={{ sx: { bgcolor: focusIndex === 5 ? '#073642' : '#021717', color: '#e6fff9' } }} 
            InputLabelProps={{ sx: { color: '#9ca3af' } }} 
          />
          <TextField 
            label="Flat No." 
            value={form.flat_no} 
            onChange={e => handleChange('flat_no', e.target.value)} 
            variant="filled" 
            inputRef={el => { if (el) refs.current[6] = el; }}
            onFocus={() => { setFocusIndex(6); setEditing(true); }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const nextIndex = Math.min(7, FIELD_ORDER.length - 1);
                setFocusIndex(nextIndex);
                setEditing(true);
                setTimeout(() => {
                  const el = refs.current[nextIndex];
                  if (el) {
                    try { el.focus(); if (typeof el.select === 'function') el.select(); } catch (err) { /* ignore */ }
                  }
                }, 0);
              }
            }}
            InputProps={{ sx: { bgcolor: focusIndex === 6 ? '#073642' : '#021717', color: '#e6fff9' } }} 
            InputLabelProps={{ sx: { color: '#9ca3af' } }} 
          />
          <TextField 
            select 
            label="Active (Y/N)" 
            value={form.active} 
            SelectProps={{ native: true }} 
            onChange={e => handleChange('active', e.target.value)} 
            variant="filled" 
            inputRef={el => { if (el) refs.current[7] = el; }}
            onFocus={() => { setFocusIndex(7); setEditing(true); }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                // Last field - could save or just stop navigation
                handleSave();
              }
            }}
            InputProps={{ sx: { bgcolor: focusIndex === 7 ? '#073642' : '#021717', color: '#e6fff9' } }}
          >
            <option value="Y">Y</option>
            <option value="N">N</option>
          </TextField>

          {/* <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={() => router.push('/societies/accounts')}>Back</Button>
            <Button variant="contained" onClick={handleSave} startIcon={<SaveIcon />}>Save</Button>
          </Box> */}

            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ px: 1, py: 0.25, bgcolor: '#021717', border: '1px solid #064a4a', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#e6fff9', fontWeight: 700 }}>Ctrl+N</Typography>
              <Typography variant="caption" sx={{ color: '#bfcfd0', display: 'block' }}>New</Typography>
            </Box>
            <Box sx={{ px: 1, py: 0.25, bgcolor: '#021717', border: '1px solid #064a4a', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#e6fff9', fontWeight: 700 }}>Ctrl+S</Typography>
              <Typography variant="caption" sx={{ color: '#bfcfd0', display: 'block' }}>Save</Typography>
            </Box>
            <Box sx={{ px: 1, py: 0.25, bgcolor: '#021717', border: '1px solid #064a4a', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#e6fff9', fontWeight: 700 }}>Esc</Typography>
              <Typography variant="caption" sx={{ color: '#bfcfd0', display: 'block' }}>Back</Typography>
            </Box>
          </Box>
          <Typography variant="caption" sx={{ color: '#9ca3af', ml: 2 }}>Use Arrow keys to navigate · Enter to move to next field</Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <IconButton color="primary" title="New (Ctrl+N)" onClick={() => { setForm({ member_number: '', member_id: '', joined_date: '', sq_ft_area: '', flat_no: '', active: 'Y', acct_code: '', name: '', account_type: 'Members' }); setFocusIndex(0); setEditing(false); router.push('/societies/accounts/member'); }}><AddIcon /></IconButton>
          <IconButton color="success" title="Save (Ctrl+S)" onClick={handleSave}><SaveIcon /></IconButton>
          <IconButton color="warning" title="Back (Esc)" onClick={() => router.push('/societies/accounts')}><ClearIcon /></IconButton>
        </Stack>
      </Box>

        </Box>
      </Paper>

      

      <Snackbar 
        open={snack.open} 
        autoHideDuration={3000} 
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: { xs: 90, sm: 70 } }}
      >
        <Alert severity={snack.severity} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
      </Snackbar>
    </Box>
  );
}
