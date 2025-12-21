"use client";
import React, { useEffect, useRef, useState, useContext } from "react";
import { AppContext } from '../../../ContextProvider';
import { ModuleContext } from '../../ModuleProvider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useRouter, useSearchParams } from 'next/navigation';
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import CloseIcon from '@mui/icons-material/Close';

const FIELD_DEFS = [
  { id: 'society_code', name: 'society_code', label: 'Society Code', type: 'text', autoComplete: 'off' },
  { id: 'name', name: 'name', label: 'Name', type: 'text', autoComplete: 'name' },
  { id: 'reg_no', name: 'reg_no', label: 'Regn. No.', type: 'text', autoComplete: 'off' },
  { id: 'address1', name: 'address1', label: 'Address - 1', type: 'text', autoComplete: 'off' },
  { id: 'address2', name: 'address2', label: 'Address - 2', type: 'text', autoComplete: 'off' },

  { id: 'interest_pct', name: 'interest_pct', label: 'Interest Charged (%)', type: 'number', autoComplete: 'off' },
  { id: 'total_members', name: 'total_members', label: 'Total Members', type: 'number', autoComplete: 'off' },
  { id: 'billing_period', name: 'billing_period', label: 'Billing Period (1,3,6)', type: 'text', autoComplete: 'off' },
  { id: 'charge_late', name: 'charge_late', label: 'Charge for Late Payment', type: 'text', autoComplete: 'off' },
  { id: 'interest_method', name: 'interest_method', label: 'Interest (Sim/Comp)', type: 'text', autoComplete: 'off' },

  { id: 'from_bill_due', name: 'from_bill_due', label: 'From Bill Dt/Due Dt', type: 'text', autoComplete: 'off' },
  { id: 'due_days', name: 'due_days', label: 'Due Days of Payment', type: 'number', autoComplete: 'off' },
  { id: 'rebate_mode', name: 'rebate_mode', label: 'Rebate (Percent/Amt)?', type: 'text', autoComplete: 'off' },
  { id: 'interest_from', name: 'interest_from', label: 'Interest from BD/DD', type: 'text', autoComplete: 'off' },
  { id: 'rebate_days', name: 'rebate_days', label: 'Rebate Days', type: 'number', autoComplete: 'off' },

  { id: 'acct_period_from', name: 'acct_period_from', label: 'Acct. Period (From)', type: 'text', autoComplete: 'off' },
  { id: 'rebate_amt_pct', name: 'rebate_amt_pct', label: 'Rebate Amount/Percent', type: 'number', autoComplete: 'off' },
  { id: 'acct_period_to', name: 'acct_period_to', label: 'Acct. Period (To)', type: 'text', autoComplete: 'off' },
  { id: 'adjust_first', name: 'adjust_first', label: 'Adjust first (IP/PI)', type: 'text', autoComplete: 'off' },
  { id: 'acct_year', name: 'acct_year', label: 'Acct Year', type: 'text', autoComplete: 'off' },

  { id: 'auth_sign', name: 'auth_sign', label: 'Authorised Signatory', type: 'text', autoComplete: 'off' },
  { id: 'messages', name: 'messages', label: 'Messages During Bill Printing (10 Lines)', type: 'multiline', autoComplete: 'off' }
];

export default function Page() {
  const router = useRouter();
  
  // Helper function to get default values
  const getDefaultValues = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const nextYear = currentYear + 1;
    
    // Calculate acct_period_from: 01-04-YYYY (April 1st of current year)
    const acctPeriodFrom = `01-04-${currentYear}`;
    
    // Calculate acct_period_to: 31-03-YYYY (March 31st of next year)
    const acctPeriodTo = `31-03-${nextYear}`;
    
    // Calculate acct_year: YYYY-YYYY (current year - next year)
    const acctYear = `${currentYear}-${nextYear}`;
    
    return {
      interest_pct: '10',
      billing_period: '1',
      charge_late: 'Y',
      interest_method: 'S',
      from_bill_due: 'D',
      due_days: '10',
      rebate_mode: 'P',
      interest_from: 'DD',
      rebate_days: '10',
      acct_period_from: acctPeriodFrom,
      rebate_amt_pct: '10',
      acct_period_to: acctPeriodTo,
      adjust_first: 'IP',
      acct_year: acctYear,
      auth_sign: 'Chairman'
    };
  };
  
  const [form, setForm] = useState(() => {
    const defaults = getDefaultValues();
    return FIELD_DEFS.reduce((acc, f) => {
      if (f.type === 'multiline') {
        acc[f.name] = '';
      } else {
        acc[f.name] = defaults[f.name] !== undefined ? defaults[f.name] : '';
      }
      return acc;
    }, {});
  });
  const [focusIndex, setFocusIndex] = useState(() => Math.max(0, FIELD_DEFS.findIndex(f => f.name === 'society_code')));
  const [editing, setEditing] = useState(true);
  const refs = useRef([]);
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [saveConfirmSelection, setSaveConfirmSelection] = useState(1);
  const [snack, setSnack] = useState({ open: false, msg: '', severity: 'info' });
  const [errors, setErrors] = useState({ society_code: '', name: '', messages: '' });
  const [statusMessage, setStatusMessage] = useState('');
  const { moduleContext, setModuleContext } = useContext(ModuleContext);
  const { context } = useContext(AppContext);
  const [selectedSociety, setSelectedSociety] = useState(moduleContext?.society_code || '');
  const searchParams = useSearchParams();
  // society picker state
  const [societyListOpen, setSocietyListOpen] = useState(false);
  const [societyList, setSocietyList] = useState([]);
  const [societyListIndex, setSocietyListIndex] = useState(0);
  const [societySearch, setSocietySearch] = useState('');
  const societyItemRefs = useRef([]);
  const societySearchRef = useRef(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmCode, setConfirmCode] = useState(null);

  // keep local select in sync with module context updates
  useEffect(() => {
    setSelectedSociety(moduleContext?.society_code || '');
  }, [moduleContext]);

  useEffect(() => { refs.current = refs.current.slice(0, FIELD_DEFS.length); }, []);

  // Map a society object from the BFF/Core into the local form shape
  function mapSocietyToForm(s) {
    if (!s || typeof s !== 'object') return {};
    const out = {};
    // preserve id so we can detect edit vs create
    if (s.id) out.id = s.id;
    for (const f of FIELD_DEFS) {
      const name = f.name;
      let val = undefined;
      // direct mapping if present
      if (s.hasOwnProperty(name)) val = s[name];
      // special-case aliases
      if (val === undefined) {
        if (name === 'interest_pct') val = s.interest_charged ?? s.interestPct ?? s.interest_pct ?? s.interestCharged ?? undefined;
        if (name === 'billing_period') val = s.billing_period ?? s.billingPeriod ?? undefined;
      }
      if (val !== undefined) out[name] = val;
    }
    return out;
  }

  // focus the society code input on mount
  useEffect(() => {
    const t = setTimeout(() => {
      const el = refs.current[focusIndex];
      if (el) {
        try { el.focus(); if (typeof el.select === 'function') el.select(); } catch (e) { /* ignore */ }
      }
    }, 50);
    return () => clearTimeout(t);
  }, [focusIndex]);

  // load existing societies on mount
  useEffect(() => {
    // Prefetch society list so the picker opens quickly, but do NOT
    // populate the form — default should be a blank new entry.
    (async () => {
      try {
        const base = '/api/societies/list';
        const q = context?.organizationId ? `?organizationId=${encodeURIComponent(context.organizationId)}` : '';
        const res = await fetch(`${base}${q}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json)) setSocietyList(json);
          else if (json && Array.isArray(json.societies)) setSocietyList(json.societies);
        }
      } catch (e) {
        // ignore prefetch errors
      }
    })();
  }, [context?.organizationId]);

  // If navigated here with ?code=..., prefill the form with that society
  useEffect(() => {
    const code = searchParams?.get('code');
    if (!code) return;
    (async () => {
      try {
        // Fetch the single society object via the BFF using code+organizationId
        const qOrg = context?.organizationId ? `&organizationId=${encodeURIComponent(context.organizationId)}` : '';
        const res = await fetch(`/api/societies?code=${encodeURIComponent(code)}${qOrg}`, { cache: 'no-store' });
        if (res.ok) {
          const item = await res.json();
          // If the BFF returned an array (legacy) pick the first match
          const obj = Array.isArray(item) ? item.find(s => (s.society_code || s.code) === code) : item;
          if (obj) {
            setForm(prev => ({ ...prev, ...mapSocietyToForm(obj) }));
            setSelectedSociety(code);
            setEditing(true);
            const idx = FIELD_DEFS.findIndex(f => f.name === 'society_code');
            setFocusIndex(idx >= 0 ? idx : 0);
          }
        }
      } catch (e) {
        // ignore
      }
    })();
  }, [searchParams, context?.organizationId]);

  async function loadSocietyList() {
    try {
      const base = '/api/societies/list';
      const q = context?.organizationId ? `?organizationId=${encodeURIComponent(context.organizationId)}` : '';
      const res = await fetch(`${base}${q}`, { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) setSocietyList(json);
        else if (json && Array.isArray(json.societies)) setSocietyList(json.societies);
      }
    } catch (e) {
      console.error('Failed to load societies', e);
    }
  }

  function handleChange(name, value) {
    if (name === 'society_code' && typeof value === 'string') value = value.toUpperCase();
    setForm(prev => ({ ...prev, [name]: value }));
    // real-time validation for messages: limit to 10 lines
    if (name === 'messages') {
      const lines = value ? value.split(/\r?\n/).length : 0;
      if (lines > 10) {
        setErrors(prev => ({ ...prev, messages: 'Messages cannot exceed 10 lines' }));
      } else if (errors.messages) {
        setErrors(prev => ({ ...prev, messages: '' }));
      }
      return; // avoid clearing other field errors below
    }
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function handleClear() {
    const defaults = getDefaultValues();
    setForm(FIELD_DEFS.reduce((acc, f) => {
      if (f.type === 'multiline') {
        acc[f.name] = '';
      } else {
        acc[f.name] = defaults[f.name] !== undefined ? defaults[f.name] : '';
      }
      return acc;
    }, {}));
    setFocusIndex(0);
    setEditing(false);
  }

  async function handleSaveConfirm() {
    const newErrors = { society_code: '', name: '', messages: '' };
    if (!form.society_code || !String(form.society_code).trim()) newErrors.society_code = 'Society Code is required';
    if (!form.name || !String(form.name).trim()) newErrors.name = 'Name is required';
    // Validate messages is at most 10 lines (preserve as single text block)
    if (form.messages && typeof form.messages === 'string') {
      const lines = form.messages.split(/\r?\n/);
      if (lines.length > 10) {
        newErrors.messages = 'Messages cannot exceed 10 lines';
      }
    }
    if (newErrors.society_code || newErrors.name) {
      setErrors(newErrors);
      const first = newErrors.society_code ? 'society_code' : 'name';
      const idx = FIELD_DEFS.findIndex(f => f.name === first);
      if (idx >= 0) { setFocusIndex(idx); setEditing(true); }
      return;
    }
    if (newErrors.messages) {
      setErrors(newErrors);
      // focus the messages textarea
      const idx = FIELD_DEFS.findIndex(f => f.name === 'messages');
      if (idx >= 0) {
        setFocusIndex(idx);
        setEditing(true);
        setTimeout(() => {
          const el = refs.current[idx];
          if (el && typeof el.focus === 'function') {
            try { el.focus(); } catch (e) { /* ignore */ }
          }
        }, 0);
      }
      return;
    }
    try {
      // ensure organization_id is present
      const payload = { ...form, organization_id: form.organization_id || context?.organizationId || '' };
      const isCreate = !form?.id;
      const endpoint = isCreate ? '/api/societies/add' : '/api/societies/update';
      const res = await fetch(endpoint, { method: 'POST', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
      if (res.ok) {
        const json = await res.json().catch(() => null);
        setSnack({ open: true, msg: isCreate ? 'Society created' : 'Society updated', severity: 'success' });
        setStatusMessage(isCreate ? 'Society created' : 'Society updated');
        // update local list and module context if this is the selected society
        try {
          if (json && (json.society_code || json.code || json.id)) {
            const code = json.society_code || json.code || form.society_code;
            setSelectedSociety(code);
            setModuleContext({ ...moduleContext, society_code: code, society_name: json.name || moduleContext?.society_name });
            // if create returned an id, make sure form has it
            if (isCreate && json.id) setForm(prev => ({ ...prev, ...mapSocietyToForm(json) }));
          }
          // reload society list to reflect changes
          loadSocietyList();
        } catch (e) { /* ignore */ }
      } else {
        const json = await res.json().catch(() => ({}));
        // Try to surface validation errors returned by the BFF/Core
        const upstreamErrors = json?.body?.errors || json?.errors || null;
        if (upstreamErrors && typeof upstreamErrors === 'object') {
          // map upstream keys (camelCase) to our form field names (snake_case)
          const fieldMap = {
            acctPeriodFrom: 'acct_period_from',
            acctPeriodTo: 'acct_period_to',
            acctYear: 'acct_year',
            chargeLate: 'charge_late',
            interestCharged: 'interest_pct',
            billingPeriod: 'billing_period'
          };
          const mapped = { ...errors };
          for (const k of Object.keys(upstreamErrors)) {
            const formKey = fieldMap[k] || k.replace(/([A-Z])/g, (m) => `_${m.toLowerCase()}`);
            const msg = Array.isArray(upstreamErrors[k]) ? upstreamErrors[k].join('; ') : String(upstreamErrors[k]);
            mapped[formKey] = msg;
          }
          setErrors(mapped);
          const firstMsg = Object.values(upstreamErrors)[0];
          const summary = typeof firstMsg === 'string' ? firstMsg : (Array.isArray(firstMsg) ? firstMsg[0] : 'Validation failed');
          setSnack({ open: true, msg: summary || 'Validation failed', severity: 'error' });
          setStatusMessage('Save failed');
        } else {
          setSnack({ open: true, msg: json?.error || 'Save failed', severity: 'error' });
          setStatusMessage('Save failed');
        }
      }
    } catch (e) {
      setSnack({ open: true, msg: String(e), severity: 'error' });
      setStatusMessage('Save failed');
    } finally {
      setSaveConfirmOpen(false);
    }
  }

  // clear status message after a short time so screen readers don't re-announce
  useEffect(() => {
    if (!statusMessage) return;
    const t = setTimeout(() => setStatusMessage(''), 3000);
    return () => clearTimeout(t);
  }, [statusMessage]);

  useEffect(() => {
    function onKey(e) {
      // If the focused element is a textarea (multiline field), allow
      // the textarea to handle Enter (insert newline) instead of
      // the global handler moving focus to the next field. This is
      // necessary because the global handler is attached in capture
      // phase.
      try {
        const active = document.activeElement;
        const tag = active && active.tagName ? active.tagName.toLowerCase() : null;
        if (e.key === 'Enter' && tag === 'textarea') {
          return; // allow textarea to insert newline
        }
      } catch (err) { /* ignore DOM access errors */ }
      // Attempt to capture Ctrl/Cmd+N (common browser shortcut) and Ctrl/Cmd+Alt+N.
      // Browsers often reserve Ctrl/Cmd+N. We attach the listener in capture
      // phase (below) and call preventDefault(), but some browsers may still
      // open a new window. For reliability the Alt variant is preferred.
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        // try to stop the browser default
        try { e.preventDefault(); } catch (err) { /* ignore */ }

        // If Alt is held, definitely treat as create-new. If Alt is not held,
        // still attempt to handle it but inform the user that the browser may
        // intercept this shortcut.
        const handled = (() => {
          try {
            handleClear();
            router.push('/societies/society/manage');
            return true;
          } catch (err) {
            return false;
          }
        })();

        if (!e.altKey) {
          // show a short hint that Alt+Cmd/Ctrl+N is more reliable
          setSnack({ open: true, msg: 'Use Cmd/Ctrl+Alt+N to create a new society (browser may intercept Cmd/Ctrl+N)', severity: 'info' });
        }

        if (handled) return;
      }

      // global cancel mapping: if NOT editing, Esc navigates back to previous UI.
      // When editing, the editing-specific Escape handler below will run
      // and simply exit editing mode instead of navigating away.
      if (e.key === 'Escape' && !editing) {
        e.preventDefault();
        try { router.back(); } catch (err) { handleClear(); }
        return;
      }
      // If this page was opened with a ?code=... (prefilled) and user presses Enter
      // while not in editing mode, navigate back to the societies list/picker.
      if (!editing && e.key === 'Enter') {
        const code = searchParams?.get('code');
        if (code) {
          e.preventDefault();
          try { router.push('/societies/society'); } catch (err) { /* ignore */ }
          return;
        }
      }
      // NOTE: Removed Ctrl/Cmd+K shortcut in manage page. Picker remains available on the societies index page.
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault(); setSaveConfirmSelection(1); setSaveConfirmOpen(true); return;
      }
      if (!editing) {
        if (e.key === 'ArrowDown') { e.preventDefault(); setFocusIndex(i => Math.min(i + 1, FIELD_DEFS.length - 1)); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); setFocusIndex(i => Math.max(i - 1, 0)); }
        else if (e.key === 'Enter') { e.preventDefault(); setEditing(true); const el = refs.current[focusIndex]; if (el && typeof el.select === 'function') el.select(); }
      } else {
        if (e.key === 'Enter') {
          e.preventDefault();
          // move to next field and focus/select it
          const next = Math.min(focusIndex + 1, FIELD_DEFS.length - 1);
          setFocusIndex(next);
          setEditing(true);
          // focus/select after state updates
          setTimeout(() => {
            const el = refs.current[next];
            if (el) {
              try { el.focus(); if (typeof el.select === 'function') el.select(); } catch (err) { /* ignore */ }
            }
          }, 0);
        } else if (e.key === 'Escape') { e.preventDefault(); setEditing(false); const el = refs.current[focusIndex]; if (el) el.focus(); }
      }
    }
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, [editing, focusIndex]);

  // derived filtered list for societies
  const societyFiltered = (societyList || []).filter(s => {
    const term = (societySearch || '').toString().toLowerCase();
    const code = (s.society_code || '').toString().toLowerCase();
    const name = (s.name || '').toString().toLowerCase();
    return !term || code.includes(term) || name.includes(term);
  });

  // keep societyListIndex in bounds when filter changes
  useEffect(() => {
    setSocietyListIndex(i => {
      if (!Array.isArray(societyFiltered) || societyFiltered.length === 0) return 0;
      return Math.min(i, societyFiltered.length - 1);
    });
  }, [societyFiltered]);

  // scroll selected society into view
  useEffect(() => {
    if (!societyListOpen) return;
    const el = societyItemRefs.current[societyListIndex];
    if (el && typeof el.scrollIntoView === 'function') {
      try { el.scrollIntoView({ block: 'nearest', behavior: 'auto' }); } catch (e) { /* ignore */ }
    }
  }, [societyListIndex, societyListOpen, societyFiltered]);

  // also focus the selected list item so Enter activates it
  useEffect(() => {
    if (!societyListOpen) return;
    const el = societyItemRefs.current[societyListIndex];
    if (el && typeof el.focus === 'function') {
      try { el.focus(); } catch (e) { /* ignore */ }
    }
  }, [societyListIndex, societyListOpen]);

  // focus the search input when the list opens
  useEffect(() => {
    if (!societyListOpen) return;
    const t = setTimeout(() => {
      const el = societySearchRef.current;
      if (el) {
        try { el.focus(); if (typeof el.select === 'function') el.select(); } catch (e) { /* ignore */ }
      }
    }, 50);
    return () => clearTimeout(t);
  }, [societyListOpen]);

  // keyboard handling while society picker is open (Arrow keys / Enter / E / D / Esc)
  useEffect(() => {
    function onListKey(e) {
      if (!societyListOpen) return;
      const filtered = societyFiltered;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSocietyListIndex(i => Math.min(i + 1, Math.max(0, (filtered || []).length - 1)));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSocietyListIndex(i => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const sel = (filtered || [])[societyListIndex];
        if (sel) handleSocietySelect(sel);
      } else if (e.key === 'e' || e.key === 'E') {
        e.preventDefault();
        const sel = (filtered || [])[societyListIndex];
        if (sel) populateFormFromList(sel);
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'Delete') {
        e.preventDefault();
        const sel = (filtered || [])[societyListIndex];
        if (sel) { setConfirmCode(sel.society_code || ''); setConfirmOpen(true); }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setSocietyListOpen(false);
      }
    }
    window.addEventListener('keydown', onListKey);
    return () => window.removeEventListener('keydown', onListKey);
  }, [societyListOpen, societyFiltered, societyListIndex]);

  function populateFormFromList(item) {
    if (!item) return;
    setForm(prev => ({ ...prev, ...mapSocietyToForm(item) }));
    setSocietyListOpen(false);
    const idx = FIELD_DEFS.findIndex(f => f.name === 'society_code');
    setFocusIndex(idx >= 0 ? idx : 0);
    setEditing(true);
  }

  function handleSocietySelect(item) {
    populateFormFromList(item);
  }

  function handleSocietyDelete(code) {
    setConfirmCode(code);
    setConfirmOpen(true);
  }

  async function handleConfirmDelete() {
    if (!confirmCode) return;
    try {
      const payload = { code: confirmCode };
      if (context?.organizationId) payload.organization_id = context.organizationId;
      const res = await fetch('/api/societies/delete', { method: 'DELETE', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
      if (res.ok) {
        const json = await res.json().catch(() => null);
        // If upstream returned an updated list, use it; otherwise just show success
        if (Array.isArray(json)) setSocietyList(json);
        setSnack({ open: true, msg: `Deleted ${confirmCode}`, severity: 'warning' });
      } else {
        const j = await res.json().catch(() => ({}));
        setSnack({ open: true, msg: j?.error || 'Delete failed', severity: 'error' });
      }
    } catch (e) {
      setSnack({ open: true, msg: String(e), severity: 'error' });
    } finally {
      setConfirmOpen(false);
      setConfirmCode(null);
      setSocietyListIndex(0);
    }
  }

  // keyboard nav for save confirmation dialog
  useEffect(() => {
    if (!saveConfirmOpen) return;
    function onDialogKey(e) {
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault(); setSaveConfirmSelection(s => Math.max(0, s - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault(); setSaveConfirmSelection(s => Math.min(1, s + 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (saveConfirmSelection === 1) {
          handleSaveConfirm();
        } else {
          setSaveConfirmOpen(false);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault(); setSaveConfirmOpen(false);
      }
    }
    window.addEventListener('keydown', onDialogKey);
    return () => window.removeEventListener('keydown', onDialogKey);
  }, [saveConfirmOpen, saveConfirmSelection]);

  return (
    <Box sx={{ p: 1 }}>
      {/* Show current Organization from AppContext (similar to Accounts page Selected Society) */}
      <Paper elevation={1} sx={{ p: 1, mb: 1, bgcolor: '#071727', color: '#e6fffa' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>Organization</Typography>
            <Typography variant="body1" sx={{ fontWeight: 700 }}>{context?.organizationName || context?.organization || '\u2014 none \u2014'}</Typography>
          </Box>
          <Box sx={{ minWidth: 220 }}>
            <FormControl variant="filled" size="small" fullWidth>
              <InputLabel id="set-society-label" sx={{ color: '#cbd5e1' }}>Set Society</InputLabel>
              <Select
                labelId="set-society-label"
                id="set-society"
                value={selectedSociety}
                onChange={(e) => {
                  const code = e.target.value;
                  setSelectedSociety(code);
                  const sel = (societyList || []).find(s => (s.society_code || s.code) === code || (s.name || s.society_name) === code);
                  setModuleContext({ ...moduleContext, society_code: sel ? (sel.society_code || sel.code) : '', society_name: sel ? (sel.name || sel.society_name) : '' });
                }}
                sx={{ bgcolor: '#011818', color: '#e6fff9', '& .MuiSelect-filled': { color: '#e6fff9' } }}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                {(societyList || []).map((s) => (
                  <MenuItem key={s.society_code || s.code || s.name} value={s.society_code || s.code || s.name}>{s.name || s.society_name || s.society_code}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={6} sx={{ p: 1.5, bgcolor: '#000', color: '#fff' }}>
        <Typography variant="h6" sx={{ mb: 0.5, color: '#bdbdbd', fontSize: 14 }}>Society - Create / Edit</Typography>

        <Box component="form" noValidate autoComplete="off" sx={{ display: 'grid', gap: 0.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(3,1fr)' } }}>
          {FIELD_DEFS.map((f, idx) => {
            if (!f) {
              console.warn('Skipping undefined field at index', idx);
              return null;
            }
            const isFocused = idx === focusIndex;
            const value = (form && form[f.name]) ?? '';
            const helper = (errors && errors[f.name]) ? errors[f.name] : undefined;
            const common = {
              id: f.id || String(idx),
              name: f.name,
              label: f.label,
              value,
              variant: 'filled',
              fullWidth: true,
              margin: 'dense',
              size: 'small',
              InputLabelProps: { style: { color: '#9ca3af' } },
              inputRef: el => { if (el) refs.current[idx] = el; },
              'aria-label': f.label,
              onFocus: () => { setFocusIndex(idx); setEditing(true); },
              sx: { bgcolor: isFocused ? '#073642' : '#111', '& .MuiInputBase-input': { color: '#fff' } }
            };

            // prepare InputProps (add search adornment for society_code)
            const inputPropsForField = (() => {
              const base = common.InputProps || {};
              if (f.name === 'society_code') {
                return {
                  ...base,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        size="small"
                        onClick={ev => { ev.stopPropagation(); loadSocietyList(); setSocietyListOpen(true); setSocietyListIndex(0); }}
                        title="Search societies (Ctrl+K)"
                        aria-label="Search societies"
                      >
                        <SearchIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  )
                };
              }
              return base;
            })();

            if (f.type === 'multiline') {
              const msgValue = (form && form.messages) ? String(form.messages) : '';
              const lines = msgValue === '' ? 0 : msgValue.split(/\r?\n/).length;
              const remaining = Math.max(0, 10 - lines);
              const helper = errors.messages ? errors.messages : `${remaining} line${remaining === 1 ? '' : 's'} remaining`;
              return (
                <TextField
                  key={f.id || idx}
                  {...common}
                  multiline
                  rows={4}
                  onChange={e => handleChange(f.name, e.target.value)}
                  onKeyDown={e => {
                    // Allow Enter to insert a newline in the messages field only.
                    if (e.key === 'Enter') {
                      // Prevent the global window handler from intercepting Enter
                      // so the TextField will insert a newline as expected.
                      e.stopPropagation();
                      // Do not preventDefault — allow normal newline insertion
                    }
                  }}
                  helperText={helper}
                  error={!!errors.messages}
                />
              );
            }

            return (
              <TextField
                key={f.id || idx}
                {...common}
                type={f.type === 'number' ? 'number' : 'text'}
                onChange={e => handleChange(f.name, e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    // Move to next field
                    const nextIndex = Math.min(idx + 1, FIELD_DEFS.length - 1);
                    setFocusIndex(nextIndex);
                    setEditing(true);
                  }
                }}
                error={!!helper}
                helperText={helper}
                InputProps={inputPropsForField}
              />
            );
          })}

          <Divider sx={{ gridColumn: '1 / -1', my: 1, borderColor: '#374151' }} />

          <Box sx={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
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
                  <Typography variant="caption" sx={{ color: '#9ca3af', display: 'block' }}>Cancel</Typography>
                </Box>
              </Box>
              <Box sx={{ color: '#9ca3af', ml: 2 }}>Use Arrow keys to navigate · Ctrl+S to save</Box>
            </Box>

            <Stack direction="row" spacing={1}>
              <IconButton title="New (Ctrl+N)" onClick={handleClear} sx={{ color: '#60a5fa' }} aria-label="New"><AddIcon /></IconButton>
              {form?.id ? (
                <IconButton title="Update (Ctrl+S)" onClick={() => { setSaveConfirmSelection(1); setSaveConfirmOpen(true); }} sx={{ color: '#34d399' }} aria-label="Update"><SaveIcon /></IconButton>
              ) : (
                <IconButton title="Create (Ctrl+S)" onClick={() => { setSaveConfirmSelection(1); setSaveConfirmOpen(true); }} sx={{ color: '#34d399' }} aria-label="Create"><AddIcon /></IconButton>
              )}
              <IconButton title="Close" onClick={() => router.back()} sx={{ color: '#f97316' }} aria-label="Close"><CloseIcon /></IconButton>
            </Stack>
          </Box>
        </Box>
      </Paper>

  {/* screen-reader status updates */}
  <div aria-live="polite" aria-atomic="true" style={{ position: 'absolute', left: -9999, top: 'auto', width: 1, height: 1, overflow: 'hidden' }}>{statusMessage}</div>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={() => setSnack(s => ({ ...s, open: false }))}>
        <Alert severity={snack.severity} onClose={() => setSnack(s => ({ ...s, open: false }))}>{snack.msg}</Alert>
      </Snackbar>

      <Dialog open={saveConfirmOpen} onClose={() => setSaveConfirmOpen(false)}>
        <DialogTitle>Confirm</DialogTitle>
        <DialogContent>
          <DialogContentText>{form?.id ? 'Do you want to update this society?' : 'Do you want to create this society?'}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveConfirmOpen(false)} variant={saveConfirmSelection === 0 ? 'contained' : 'text'} color={saveConfirmSelection === 0 ? 'primary' : 'inherit'}>No</Button>
          <Button autoFocus onClick={handleSaveConfirm} variant={saveConfirmSelection === 1 ? 'contained' : 'text'} color={saveConfirmSelection === 1 ? 'primary' : 'inherit'}>Yes</Button>
        </DialogActions>
      </Dialog>
      {/* Society picker dialog (Ctrl/Cmd+K) */}
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
                  if (sel) handleSocietySelect(sel);
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
                  onClick={() => handleSocietySelect(s)}
                  ref={el => (societyItemRefs.current[i] = el)}
                  sx={{ px: 1, bgcolor: i === societyListIndex ? '#012a2a' : 'transparent' }}
                >
                  {i === societyListIndex ? <CheckIcon fontSize="small" sx={{ mr: 1, color: '#00eaff' }} /> : <span style={{ width: 18, display: 'inline-block' }} />}
                  <ListItemText primary={`${s.society_code || ''}  —  ${s.name || ''}`} primaryTypographyProps={{ color: i === societyListIndex ? '#e6fff9' : '#d1e8e8' }} secondary={<span style={{ color: '#94a3b8' }}>E:edit • D:delete • Enter:select • Esc:close</span>} />
                  <IconButton size="small" onClick={(ev) => { ev.stopPropagation(); populateFormFromList(s); }} title="Edit"><EditIcon fontSize="small" sx={{ color: '#9ca3af' }} /></IconButton>
                  <IconButton size="small" onClick={(ev) => { ev.stopPropagation(); handleSocietyDelete(s.society_code || ''); }} title="Delete"><DeleteIcon fontSize="small" sx={{ color: '#fca3a5' }} /></IconButton>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Dialog>

      {/* Delete confirmation for society */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete society <strong>{confirmCode}</strong>?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
