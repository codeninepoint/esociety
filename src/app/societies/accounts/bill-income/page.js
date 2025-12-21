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

const FIELD_ORDER = ['acct_code', 'name', 'bill_item', 'item_narration', 'order_number', 'charge_interest', 'gst_limit_calc', 'include_in_gst_bill', 'rebate', 'compulsorily_apply_gst'];

export default function BillIncomeAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { moduleContext } = useContext(ModuleContext || React.createContext({ moduleContext: { society_name: '', society_code: '' } }));
  const { context } = useContext(AppContext || React.createContext({ context: {} }));
  const [form, setForm] = useState({ bill_item: '', item_narration: '', order_number: '', charge_interest: 'N', gst_limit_calc: '', include_in_gst_bill: 'N', rebate: '', compulsorily_apply_gst: 'N', acct_code: '', name: '', account_type: 'Bill Income' });
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'info' });
  const [focusIndex, setFocusIndex] = useState(0);
  const [editing, setEditing] = useState(false);
  const refs = useRef([]);
  const [loading, setLoading] = useState(false);

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

        // Fetch all bill income accounts and find the one with matching code
        const res = await fetch(`/api/accounts?accountType=Bill Income&societyId=${encodeURIComponent(societyId)}`, { cache: 'no-store' });
        if (res.ok) {
          const accounts = await res.json();
          const account = Array.isArray(accounts) ? accounts.find(a => (a.acct_code || a.code) === code) : null;
          
          if (account) {
            // Map account data to form (handling nested bill_income structure)
            setForm({
              id: account.id || account._id || '',
              acct_code: account.acct_code || account.code || '',
              name: account.name || '',
              account_type: account.account_type || 'Bill Income',
              bill_item: account.bill_income?.bill_item || account.bill_item || '',
              item_narration: account.bill_income?.item_narration || account.item_narration || '',
              order_number: account.bill_income?.order_number !== undefined ? String(account.bill_income.order_number) : (account.order_number !== undefined ? String(account.order_number) : ''),
              charge_interest: account.bill_income?.charge_interest || account.charge_interest || 'N',
              gst_limit_calc: account.bill_income?.gst_limit_calc || account.gst_limit_calc || '',
              include_in_gst_bill: account.bill_income?.include_in_gst_bill || account.include_in_gst_bill || 'N',
              rebate: account.bill_income?.rebate || account.rebate || '',
              compulsorily_apply_gst: account.bill_income?.compulsorily_apply_gst || account.compulsorily_apply_gst || 'N',
              classify: account.classify || 'I',
              title: account.title || '',
              other_info: account.other_info || '',
              open_bal: account.open_bal || 0.1,
              debit_credit: account.debit_credit || 'D',
              prin_bill: account.prin_bill || 0.1,
              interest_amt: account.interest_amt || 0.1,
              prev_years_bal: account.prev_years_bal || 0.1,
              sinking_fund: account.sinking_fund || 0.1,
              bill_income: {
                ...(account.bill_income?.id && { id: account.bill_income.id })
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

      // Convert order_number to number
      const orderNumber = form.order_number ? parseInt(form.order_number, 10) : 0;
      if (isNaN(orderNumber)) {
        setSnack({ open: true, msg: 'Order Number must be a valid number', severity: 'warning' });
        return;
      }

      // Structure payload according to Core service format
      const billIncomeObj = {
        rebate: form.rebate || '',
        bill_item: form.bill_item || '',
        item_narration: form.item_narration || '',
        order_number: orderNumber,
        charge_interest: form.charge_interest || 'N',
        gst_limit_calc: form.gst_limit_calc || '',
        include_in_gst_bill: form.include_in_gst_bill || 'N',
        compulsorily_apply_gst: form.compulsorily_apply_gst || 'N',
      };

      // Add bill_income id if updating
      if (form.bill_income?.id) {
        billIncomeObj.id = form.bill_income.id;
      }

      const payload = {
        name: form.name,
        acct_code: form.acct_code,
        account_type: form.account_type || 'Bill Income',
        member_flag: 'N',
        classify: form.classify || 'I',
        bill_income: billIncomeObj,
        ...(societyId && { society_id: societyId }),
        open_bal: form.open_bal || 0.1,
        debit_credit: form.debit_credit || 'D',
        prin_bill: form.prin_bill || 0.1,
        interest_amt: form.interest_amt || 0.1,
        prev_years_bal: form.prev_years_bal || 0.1,
        sinking_fund: form.sinking_fund || 0.1,
        ...(form.title && { title: form.title }),
        ...(form.other_info && { other_info: form.other_info }),
        ...(form.id && { id: form.id }),
      };

      const isUpdate = !!form.id;
      const method = isUpdate ? 'PUT' : 'POST';
      const res = await fetch('/api/accounts', { 
        method, 
        body: JSON.stringify(payload), 
        headers: { 'Content-Type': 'application/json' } 
      });
      
      if (res.ok) {
        const data = await res.json();
        setSnack({ open: true, msg: isUpdate ? 'Bill Income account updated' : 'Bill Income account created', severity: 'success' });
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
        setForm({ bill_item: '', item_narration: '', order_number: '', charge_interest: 'N', gst_limit_calc: '', include_in_gst_bill: 'N', rebate: '', compulsorily_apply_gst: 'N', acct_code: '', name: '', account_type: 'Bill Income' });
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
        <Typography variant="h6" sx={{ mb: 1 }}>{form.id ? 'Edit Bill Income Account' : 'Create Bill Income Account'}</Typography>
        <Box component="form" sx={{ display: 'grid', gap: 1 }}>
          {/* Hidden field for account_type */}
          <input type="hidden" name="account_type" value="Bill Income" />
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
            label="Bill Item" 
            value={form.bill_item} 
            onChange={e => handleChange('bill_item', e.target.value)} 
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
            label="Narration" 
            value={form.item_narration} 
            onChange={e => handleChange('item_narration', e.target.value)} 
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
            label="Order No." 
            value={form.order_number} 
            onChange={e => handleChange('order_number', e.target.value)} 
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
            InputLabelProps={{ sx: { color: '#9ca3af' } }} 
          />
          <TextField 
            select 
            label="Charge Interest" 
            value={form.charge_interest} 
            onChange={e => handleChange('charge_interest', e.target.value)} 
            SelectProps={{ native: true }} 
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
          >
            <option value="Y">Y</option>
            <option value="N">N</option>
          </TextField>
          <TextField 
            label="GST Limit Calc" 
            type="number" 
            value={form.gst_limit_calc} 
            onChange={e => handleChange('gst_limit_calc', e.target.value)} 
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
            label="Include in GST Bill" 
            value={form.include_in_gst_bill} 
            onChange={e => handleChange('include_in_gst_bill', e.target.value)} 
            SelectProps={{ native: true }} 
            variant="filled" 
            inputRef={el => { if (el) refs.current[7] = el; }}
            onFocus={() => { setFocusIndex(7); setEditing(true); }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const nextIndex = Math.min(8, FIELD_ORDER.length - 1);
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
            InputProps={{ sx: { bgcolor: focusIndex === 7 ? '#073642' : '#021717', color: '#e6fff9' } }}
          >
            <option value="Y">Y</option>
            <option value="N">N</option>
          </TextField>
          <TextField 
            label="Rebate" 
            type="number" 
            value={form.rebate} 
            onChange={e => handleChange('rebate', e.target.value)} 
            variant="filled" 
            inputRef={el => { if (el) refs.current[8] = el; }}
            onFocus={() => { setFocusIndex(8); setEditing(true); }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                const nextIndex = Math.min(9, FIELD_ORDER.length - 1);
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
            InputProps={{ sx: { bgcolor: focusIndex === 8 ? '#073642' : '#021717', color: '#e6fff9' } }} 
            InputLabelProps={{ sx: { color: '#9ca3af' } }} 
          />
          <TextField 
            select 
            label="Compulsorily Apply GST" 
            value={form.compulsorily_apply_gst} 
            onChange={e => handleChange('compulsorily_apply_gst', e.target.value)} 
            SelectProps={{ native: true }} 
            variant="filled" 
            inputRef={el => { if (el) refs.current[9] = el; }}
            onFocus={() => { setFocusIndex(9); setEditing(true); }}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                e.preventDefault();
                // Last field - could save or just stop navigation
                handleSave();
              }
            }}
            InputProps={{ sx: { bgcolor: focusIndex === 9 ? '#073642' : '#021717', color: '#e6fff9' } }}
          >
            <option value="Y">Y</option>
            <option value="N">N</option>
          </TextField>

          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
            <Button onClick={() => router.push('/societies/accounts')}>Back</Button>
            <Button variant="contained" onClick={handleSave} startIcon={<SaveIcon />}>Save</Button>
          </Box>
        </Box>
      </Paper>

      <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Box sx={{ px: 1, py: 0.25, bgcolor: '#111', border: '1px solid #374151', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700 }}>Ctrl+N</Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block' }}>New</Typography>
            </Box>
            <Box sx={{ px: 1, py: 0.25, bgcolor: '#111', border: '1px solid #374151', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700 }}>Ctrl+S</Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block' }}>Save</Typography>
            </Box>
            <Box sx={{ px: 1, py: 0.25, bgcolor: '#111', border: '1px solid #374151', borderRadius: 1, textAlign: 'center' }}>
              <Typography variant="caption" sx={{ color: '#cbd5e1', fontWeight: 700 }}>Esc</Typography>
              <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block' }}>Back</Typography>
            </Box>
          </Box>
          <Typography variant="caption" sx={{ color: '#9ca3af', ml: 2 }}>Use Arrow keys to navigate · Enter to move to next field</Typography>
        </Box>

        <Stack direction="row" spacing={1}>
          <IconButton color="primary" title="New (Ctrl+N)" onClick={() => { setForm({ bill_item: '', item_narration: '', order_number: '', charge_interest: 'N', gst_limit_calc: '', include_in_gst_bill: 'N', rebate: '', compulsorily_apply_gst: 'N', acct_code: '', name: '', account_type: 'Bill Income' }); setFocusIndex(0); setEditing(false); }}><AddIcon /></IconButton>
          <IconButton color="success" title="Save (Ctrl+S)" onClick={handleSave}><SaveIcon /></IconButton>
          <IconButton color="warning" title="Back (Esc)" onClick={() => router.push('/societies/accounts')}><ClearIcon /></IconButton>
        </Stack>
      </Box>

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
