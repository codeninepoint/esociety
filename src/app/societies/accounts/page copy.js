"use client";
// ...existing code...
import React, { useEffect, useRef, useState, useMemo, useContext } from "react";
import { ModuleContext } from '../../societies/ModuleProvider';
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from "@mui/material/ListItemText";
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

const FIELD_DEFS = [
  { id: "acct_code", label: "Acct. Code", name: "acct_code", type: "text", autoComplete: "off" },
  { id: "name", label: "Name", name: "name", type: "text", autoComplete: "name" },
  { id: "open_bal", label: "Open. Bal.", name: "open_bal", type: "number", autoComplete: "off" },
  { id: "debit_credit", label: "Debit/Credit", name: "debit_credit", type: "select", options: ["Debit", "Credit"], autoComplete: "off" },
  { id: "prin_bill", label: "Prin. Bill Amt", name: "prin_bill", type: "number", autoComplete: "off" },
  { id: "interest_amt", label: "Interest Amt.", name: "interest_amt", type: "number", autoComplete: "off" },
  { id: "prev_years_bal", label: "Prev. Years Bal.", name: "prev_years_bal", type: "number", autoComplete: "off" },

  // address / member details
  { id: "flat_shop", label: "Flat/Shop", name: "flat_shop", type: "text", autoComplete: "off" },
  { id: "flat_no", label: "Flat No.", name: "flat_no", type: "text", autoComplete: "off" },
  { id: "joint_name", label: "Joint Name", name: "joint_name", type: "text", autoComplete: "name" },
  { id: "email", label: "Email ID", name: "email", type: "email", autoComplete: "email" },
  { id: "loan_from", label: "Loan From", name: "loan_from", type: "text", autoComplete: "off" },
  { id: "rented_from", label: "Rented From", name: "rented_from", type: "text", autoComplete: "off" },
  { id: "member_flag", label: "Member (Y/N)?", name: "member_flag", type: "select", options: ["Y", "N"], autoComplete: "off" },

  { id: "member_bank", label: "Member's Bank", name: "member_bank", type: "text", autoComplete: "off" },
  { id: "phone", label: "Phone No.", name: "phone", type: "tel", autoComplete: "tel" },
  { id: "other_info", label: "Other Info.", name: "other_info", type: "text", autoComplete: "off" },
  { id: "classify", label: "Classify", name: "classify", type: "select", options: [
      "Banks",
      "Cash Books",
      "Expenses",
      "Bill Income",
      "Current Liabilities",
      "Reserve Funds & Other Funds",
      "Fixed Assets",
      "Investments",
      "Members",
      "Interest",
      "Advances",
      "Income & Expenditure A/c.",
      "Share Capital",
      "Member's Contribution",
      "Other Income"
    ], autoComplete: "off"
  }
];

export default function AccountsCreatePage() {
  const { moduleContext } = useContext(ModuleContext || React.createContext({ moduleContext: { society_name: '', society_code: '' } }));
  const [form, setForm] = useState(() =>
    FIELD_DEFS.reduce((acc, f) => ({ ...acc, [f.name]: f.type === "select" ? (f.options ? f.options[0] : "") : "" }), {})
  );
  const [focusIndex, setFocusIndex] = useState(0);
  const [editing, setEditing] = useState(false); // when true, the focused field is editable
  const refs = useRef([]);
  const acctItemRefs = useRef([]);
  const acctSearchRef = useRef(null);
  const [selectDialogOpen, setSelectDialogOpen] = useState(false);
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectIndex, setSelectIndex] = useState(0);
  const [selectFieldName, setSelectFieldName] = useState(null);
  // Account code lookup dialog state (F1)
  const [acctListOpen, setAcctListOpen] = useState(false);
  const [acctList, setAcctList] = useState([]);
  const [acctListIndex, setAcctListIndex] = useState(0);
  const [acctSearch, setAcctSearch] = useState('');
  // confirm / edit dialog / snackbar state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmCode, setConfirmCode] = useState(null);
  const [snack, setSnack] = useState({ open: false, msg: "", severity: "info" });
  const [infoDialog, setInfoDialog] = useState({ open: false, title: '', message: '' });
  const [saveConfirmOpen, setSaveConfirmOpen] = useState(false);
  const [saveConfirmSelection, setSaveConfirmSelection] = useState(1); // 0: No, 1: Yes (default)
  const [errors, setErrors] = useState({ acct_code: '', name: '' });

  // focus management
  useEffect(() => {
    refs.current = refs.current.slice(0, FIELD_DEFS.length);
  }, []);

  // load acct list from server API on mount
  useEffect(() => {
    loadAcctList();
  }, []);

  async function loadAcctList() {
    try {
      const res = await fetch('/api/acct-list');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) setAcctList(json);
      }
    } catch (e) {
      // fallback: keep built-in defaults
      console.error('Failed to load acct list', e);
    }
  }

  // populate parent form with selected account object for full editing
  function populateFormForEdit(item) {
    if (!item) return;
    // item is expected to be an object with keys matching form fields
    setForm(prev => ({ ...prev, ...item }));
    setAcctListOpen(false);
    // focus acct_code and enter editing mode
    const idx = FIELD_DEFS.findIndex(f => f.name === 'acct_code');
    setFocusIndex(idx >= 0 ? idx : 0);
    setEditing(true);
  }

  useEffect(() => {
    // ensure focused element is visible and focused when not editing
    const el = refs.current[focusIndex];
    if (el && !editing) {
      el.focus();
    }
  }, [focusIndex, editing]);

  // when entering edit mode, focus and select the input
  useEffect(() => {
    if (editing) {
      const el = refs.current[focusIndex];
      if (el) {
        try {
          el.focus();
          if (typeof el.select === 'function') el.select();
        } catch (e) {
          // ignore
        }
      }
    }
  }, [editing, focusIndex]);

  // derived filtered list used across render and keyboard handlers
  const acctFiltered = useMemo(() => {
    const term = (acctSearch || '').toString().toLowerCase();
    return acctList.filter(a => {
      if (!a) return false;
      const code = (a.acct_code || '').toString().toLowerCase();
      const name = (a.name || '').toString().toLowerCase();
      return !term || code.includes(term) || name.includes(term);
    });
  }, [acctList, acctSearch]);

  // Keep acctListIndex within bounds of the filtered results when the list or search term changes
  useEffect(() => {
    setAcctListIndex(i => {
      if (!Array.isArray(acctFiltered) || acctFiltered.length === 0) return 0;
      return Math.min(i, acctFiltered.length - 1);
    });
  }, [acctFiltered]);

  // Scroll the selected filtered item into view when selection changes
  useEffect(() => {
    if (!acctListOpen) return;
    const el = acctItemRefs.current[acctListIndex];
    if (el && typeof el.scrollIntoView === 'function') {
      try { el.scrollIntoView({ block: 'nearest', behavior: 'auto' }); } catch (e) { /* ignore */ }
    }
  }, [acctListIndex, acctListOpen, acctFiltered]);

  // focus the search input when the acct list dialog opens
  useEffect(() => {
    if (!acctListOpen) return;
    const t = setTimeout(() => {
      const el = acctSearchRef.current;
      if (el) {
        try { el.focus(); if (typeof el.select === 'function') el.select(); } catch (e) { /* ignore */ }
      }
    }, 50);
    return () => clearTimeout(t);
  }, [acctListOpen]);

  // global keyboard handlers
  useEffect(() => {
    function onKey(e) {
      // F1 -> open account code list when acct_code field is focused
      if (e.key === 'F1') {
        if (focusIndex === FIELD_DEFS.findIndex(f => f.name === 'acct_code')) {
          e.preventDefault();
          // refresh server-backed list before showing
          try {
            loadAcctList();
          } catch (err) {
            console.error('loadAcctList failed', err);
          }
          console.debug('F1 pressed, opening acct list (focusIndex)', focusIndex);
          setAcctListOpen(true);
          setAcctListIndex(0);
          return;
        }
      }
      // Alternative shortcut: Ctrl/Cmd + K to open acct list when on acct_code
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        if (focusIndex === FIELD_DEFS.findIndex(f => f.name === 'acct_code')) {
          e.preventDefault();
          try { loadAcctList(); } catch (err) { console.error(err); }
          setAcctListOpen(true);
          setAcctListIndex(0);
          return;
        }
      }
      // CTRL/CMD + S => open save confirmation
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        setSaveConfirmSelection(1);
        setSaveConfirmOpen(true);
        return;
      }
      // CTRL/CMD + N => new / clear
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        handleClear();
        return;
      }

      // when dialog open, handle its keys
      if (selectDialogOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectIndex(i => Math.min(i + 1, selectOptions.length - 1));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectIndex(i => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
          e.preventDefault();
          handleSelectOption(selectOptions[selectIndex]);
        } else if (e.key === "Escape") {
          e.preventDefault();
          setSelectDialogOpen(false);
        }
        return;
      }

      // Account code list (F1) handling when open
      if (acctListOpen) {
        const filtered = acctFiltered;

        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setAcctListIndex(i => Math.min(i + 1, Math.max(0, filtered.length - 1)));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setAcctListIndex(i => Math.max(i - 1, 0));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          // choose and put into acct_code for editing
          const selected = filtered[acctListIndex];
          if (selected) handleAcctEdit(selected);
        } else if (e.key === 'e' || e.key === 'E') {
          e.preventDefault();
          // populate parent form for editing the selected account
          const sel = filtered[acctListIndex];
          if (sel) populateFormForEdit(sel);
        } else if (e.key === 'd' || e.key === 'D' || e.key === 'Delete') {
          e.preventDefault();
          const sel = filtered[acctListIndex];
          if (sel) {
            setConfirmCode(sel.acct_code || '');
            setConfirmOpen(true);
          }
        } else if (e.key === 'Escape') {
          e.preventDefault();
          setAcctListOpen(false);
        }
        return;
      }

      // navigation when not editing
      if (!editing) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setFocusIndex(i => Math.min(i + 1, FIELD_DEFS.length - 1));
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setFocusIndex(i => Math.max(i - 1, 0));
        } else if (e.key === "Enter") {
          e.preventDefault();
          const f = FIELD_DEFS[focusIndex];
          if (f.type === "select") {
            openSelectForField(f);
          } else if (f.name === 'acct_code' && e.key === 'Enter') {
            // Enter on acct_code should start editing (default behavior handled below)
          } else {
            setEditing(true);
            // focus text input for editing
            const el = refs.current[focusIndex];
            if (el) el.select();
          }
        } else if (e.key === "Escape") {
          e.preventDefault();
          // nothing, could clear
        }
      } else {
        // when editing: Escape to exit editing mode
        if (e.key === "Escape") {
          e.preventDefault();
          setEditing(false);
          // move focus back to the field container
          const el = refs.current[focusIndex];
          if (el) el.focus();
        }
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [editing, focusIndex, selectDialogOpen, selectOptions, selectIndex, acctListOpen, acctListIndex, acctList, acctSearch]);

  function openSelectForField(fieldDef) {
    setSelectOptions(fieldDef.options || []);
    setSelectIndex(0);
    setSelectFieldName(fieldDef.name);
    setSelectDialogOpen(true);
  }

  function handleSelectOption(opt) {
    setForm(prev => ({ ...prev, [selectFieldName]: opt }));
    setSelectDialogOpen(false);
    setEditing(false);
    // move focus to next field
    setFocusIndex(i => Math.min(i + 1, FIELD_DEFS.length - 1));
  }

  // F1 Account list handlers
  function handleAcctEdit(itemOrCode) {
    // itemOrCode may be an object (acct item) or a plain code string
    if (itemOrCode && typeof itemOrCode === 'object') {
      populateFormForEdit(itemOrCode);
      return;
    }
    const code = itemOrCode;
    setForm(prev => ({ ...prev, acct_code: code }));
    setAcctListOpen(false);
    // focus acct_code and allow editing
    const idx = FIELD_DEFS.findIndex(f => f.name === 'acct_code');
    setFocusIndex(idx >= 0 ? idx : 0);
    setEditing(true);
  }



  function handleConfirmDelete() {
    if (!confirmCode) return;
    // call API to delete
    (async () => {
      try {
        const res = await fetch('/api/acct-list', { method: 'DELETE', body: JSON.stringify({ code: confirmCode }) });
        if (res.ok) {
          const json = await res.json();
          setAcctList(Array.isArray(json) ? json : []);
          setSnack({ open: true, msg: `Deleted ${confirmCode}`, severity: 'warning' });
        } else {
          setInfoDialog({ open: true, title: 'Delete failed', message: 'Unable to delete account code.' });
        }
      } catch (e) {
        setInfoDialog({ open: true, title: 'Delete failed', message: String(e) });
      } finally {
        setConfirmOpen(false);
        setConfirmCode(null);
        setAcctListIndex(0);
      }
    })();
  }

  function handleAcctDelete(code) {
    // open confirm dialog
    setConfirmCode(code);
    setConfirmOpen(true);
  }

  function handleChange(name, value) {
    // Ensure Account Code is always uppercase
    if (name === 'acct_code' && typeof value === 'string') {
      value = value.toUpperCase();
    }
    setForm(prev => ({ ...prev, [name]: value }));
    // clear field error when user types
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  }

  function handleSubmit() {
    // validate minimal fields
    if (!form.name || !form.acct_code) {
      setInfoDialog({ open: true, title: 'Validation', message: 'Please provide Account Code and Name.' });
      return;
    }
    // Replace with API call
    console.log("Submitting account:", form);
    setInfoDialog({ open: true, title: 'Saved', message: 'Account saved (mock). Check console.' });
    // after save reset or keep selection as needed
  }

  function handleClear() {
    setForm(FIELD_DEFS.reduce((acc, f) => ({ ...acc, [f.name]: f.type === "select" ? (f.options ? f.options[0] : "") : "" }), {}));
    setFocusIndex(0);
    setEditing(false);
  }

  function handleCloseSnack() {
    setSnack(s => ({ ...s, open: false }));
  }

  async function handleSaveConfirm() {
    // basic validation
    const newErrors = { acct_code: '', name: '' };
    if (!form.acct_code || (typeof form.acct_code === 'string' && form.acct_code.trim() === '')) newErrors.acct_code = 'Account Code is required';
    if (!form.name || (typeof form.name === 'string' && form.name.trim() === '')) newErrors.name = 'Account Name is required';
    if (newErrors.acct_code || newErrors.name) {
      setErrors(newErrors);
      // focus first invalid field in the form
      const firstInvalid = newErrors.acct_code ? 'acct_code' : 'name';
      const idx = FIELD_DEFS.findIndex(f => f.name === firstInvalid);
      if (idx >= 0) {
        setFocusIndex(idx);
        setEditing(true);
      }
      // keep confirmation open to let user decide or correct
      return;
    }
    try {
      const res = await fetch('/api/accounts', { method: 'POST', body: JSON.stringify(form) });
      if (res.ok) {
        setSnack({ open: true, msg: 'Account saved', severity: 'success' });
        // refresh account list
        await loadAcctList();
      } else {
        const json = await res.json();
        setInfoDialog({ open: true, title: 'Save failed', message: json?.error || 'Unknown error' });
      }
    } catch (e) {
      setInfoDialog({ open: true, title: 'Save failed', message: String(e) });
    } finally {
      setSaveConfirmOpen(false);
    }
  }

  // keyboard handling for save confirmation dialog
  useEffect(() => {
    function onKey(e) {
      if (!saveConfirmOpen) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        setSaveConfirmSelection(s => Math.max(0, s - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        setSaveConfirmSelection(s => Math.min(1, s + 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (saveConfirmSelection === 1) handleSaveConfirm();
        else setSaveConfirmOpen(false);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        setSaveConfirmOpen(false);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [saveConfirmOpen, saveConfirmSelection]);

  return (
    <Box sx={{ p: 1 }}>
      {/* Show selected Module context (society) above the form */}
      <Paper elevation={1} sx={{ p: 1, mb: 1, bgcolor: '#071727', color: '#e6fffa' }}>
        <Typography variant="subtitle2" sx={{ color: '#94a3b8' }}>Selected Society</Typography>
        <Typography variant="body1" sx={{ fontWeight: 700 }}>{moduleContext?.society_name || moduleContext?.society_code || '— none —'}</Typography>
      </Paper>

      <Paper elevation={6} sx={{ p: 1.5, bgcolor: "#000", color: "#fff" }}>
        <Typography variant="h6" sx={{ mb: 0.5, color: "#bdbdbd", fontSize: 14 }}>
          Accounts / Vendor - Create (keyboard driven)
        </Typography>

        <Box component="form" noValidate autoComplete="off" sx={{ display: "grid", gap: 0.5, gridTemplateColumns: { xs: '1fr', sm: 'repeat(2,1fr)', md: 'repeat(3,1fr)' }, alignItems: 'start' }}>
          {FIELD_DEFS.map((f, idx) => {
            const isFocused = idx === focusIndex;
            const value = form[f.name] ?? "";
            const common = {
              id: f.id,
              name: f.name,
              label: f.label,
              value,
              // inputs are editable when focused; we manage editing via onFocus/onKeyDown
              inputProps: {},
              sx: {
                bgcolor: isFocused ? "#073642" : "#111",
                px: 1,
                py: 0.4,
                borderRadius: 0.5,
                "& .MuiInputBase-input": { color: "#fff", fontSize: 16, caretColor: '#00eaff', lineHeight: '20px' }
              },
              onClick: () => setFocusIndex(idx),
              // store actual input element reference via inputRef below
            };

            if (f.type === "select") {
              return (
                <TextField
                  key={f.id}
                  {...common}
                  onFocus={() => { setFocusIndex(idx); setEditing(true); }}
                  onKeyDown={e => {
                    // open select on Enter
                    if (e.key === "Enter") {
                      e.preventDefault();
                      openSelectForField(f);
                      return;
                    }
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setFocusIndex(i => Math.min(i + 1, FIELD_DEFS.length - 1));
                    }
                    if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setFocusIndex(i => Math.max(i - 1, 0));
                    }
                  }}
                  value={value}
                  helperText="Press Enter to choose"
                  variant="filled"
                  fullWidth
                  margin="dense"
                  size="small"
                  inputRef={el => (refs.current[idx] = el)}
                  InputLabelProps={{ style: { color: "#9ca3af" } }}
                  name={f.name}
                  aria-label={f.label}
                  autoComplete={f.autoComplete}
                />
              );
            }

            return (
              <TextField
                key={f.id}
                {...common}
                onFocus={() => { setFocusIndex(idx); setEditing(true); }}
                onChange={e => handleChange(f.name, e.target.value)}
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    // finish editing and move next
                    setEditing(false);
                    setFocusIndex(i => Math.min(i + 1, FIELD_DEFS.length - 1));
                    return;
                  }
                  if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    setFocusIndex(i => Math.min(i + 1, FIELD_DEFS.length - 1));
                  }
                  if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    setFocusIndex(i => Math.max(i - 1, 0));
                  }
                }}
                variant="filled"
                fullWidth
                margin="dense"
                size="small"
                type={f.type === "number" ? "number" : "text"}
                InputLabelProps={{ style: { color: "#9ca3af" } }}
                name={f.name}
                aria-label={f.label}
                autoComplete={f.autoComplete}
                inputRef={el => (refs.current[idx] = el)}
                InputProps={f.name === 'acct_code' ? {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton size="small" onClick={(ev) => { ev.stopPropagation(); loadAcctList(); setAcctListOpen(true); setAcctListIndex(0); }} title="Search accounts"><SearchIcon fontSize="small" /></IconButton>
                    </InputAdornment>
                  )
                } : undefined}
                error={!!errors[f.name]}
                helperText={errors[f.name] || undefined}
              />
            );
          })}

          <Divider sx={{ my: 1, borderColor: "#374151", gridColumn: '1 / -1', width: '100%' }} />

          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1, gridColumn: '1 / -1' }}>
            {/* Left: shortcut badges arranged horizontally */}
            <Box sx={{ display: 'flex', flexDirection: 'row', gap: 1, alignItems: 'center' }}>
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

            {/* Right: icon buttons (horizontal) */}
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <IconButton color="primary" title="New (Ctrl+N)" onClick={handleClear}><AddIcon /></IconButton>
              <IconButton color="success" title="Save (Ctrl+S)" onClick={() => { setSaveConfirmSelection(1); setSaveConfirmOpen(true); }}><SaveIcon /></IconButton>
              <IconButton color="warning" title="Clear" onClick={handleClear}><ClearIcon /></IconButton>
            </Stack>
          </Box>
        </Box>
      </Paper>

      <Dialog open={selectDialogOpen} onClose={() => setSelectDialogOpen(false)}>
        <Paper sx={{ width: 420 }}>
          <Typography sx={{ p: 1, bgcolor: "#b91c1c", color: "#fff" }}>Choose</Typography>
          <List dense>
            {selectOptions.map((opt, i) => (
              <ListItem key={opt} disablePadding>
                <ListItemButton
                  selected={i === selectIndex}
                  onClick={() => handleSelectOption(opt)}
                >
                  <ListItemText primary={opt} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Dialog>

      {/* Account code pick dialog (F1) */}
      <Dialog open={acctListOpen} onClose={() => setAcctListOpen(false)}>
        <Paper sx={{ width: 480, bgcolor: '#041414', color: '#e6f6f6' }}>
          <Typography sx={{ p: 1, bgcolor: '#073636', color: '#e6f6f6' }}>Account Codes (F1)</Typography>
          <Box sx={{ p: 1 }}>
            <TextField
              placeholder="Search code or name..."
              variant="filled"
              size="small"
              fullWidth
              value={acctSearch}
              onChange={e => { setAcctSearch(e.target.value); setAcctListIndex(0); }}
              inputRef={acctSearchRef}
              InputProps={{ sx: { bgcolor: '#011818', color: '#e6fff9' }, disableUnderline: true }}
            />
          </Box>
          <List dense sx={{ bgcolor: 'transparent', maxHeight: 360, overflow: 'auto' }}>
            {acctFiltered.length === 0 ? (
              <ListItem>
                <ListItemText primary="No results" primaryTypographyProps={{ color: '#94a3b8' }} />
              </ListItem>
            ) : acctFiltered.map((acct, i) => (
              <ListItem key={acct.acct_code || i} disablePadding>
                <ListItemButton
                  selected={i === acctListIndex}
                  onClick={() => populateFormForEdit(acct)}
                  ref={el => (acctItemRefs.current[i] = el)}
                  sx={{
                    px: 1,
                    bgcolor: i === acctListIndex ? '#012a2a' : 'transparent',
                    color: i === acctListIndex ? '#e6fff9' : '#d1e8e8',
                    borderLeft: i === acctListIndex ? '4px solid #00eaff' : '4px solid transparent',
                    alignItems: 'center',
                    '&:hover': { bgcolor: i === acctListIndex ? '#013535' : 'rgba(255,255,255,0.02)' }
                  }}
                >
                  {i === acctListIndex ? <CheckIcon fontSize="small" sx={{ mr: 1, color: '#00eaff' }} /> : <span style={{ width: 18, display: 'inline-block' }} />}
                  <ListItemText primary={`${acct.acct_code || ''}  —  ${acct.name || ''}`} primaryTypographyProps={{ fontWeight: i === acctListIndex ? 700 : 500, color: i === acctListIndex ? '#e6fff9' : '#d1e8e8' }} secondary={<span style={{ color: '#94a3b8' }}>E:edit • D:delete • Enter:select • Esc:close</span>} />
                  <IconButton size="small" onClick={(ev) => { ev.stopPropagation(); populateFormForEdit(acct); }} title="Edit"><EditIcon fontSize="small" sx={{ color: '#9ca3af' }} /></IconButton>
                  <IconButton size="small" onClick={(ev) => { ev.stopPropagation(); setConfirmCode(acct.acct_code || ''); setConfirmOpen(true); }} title="Delete"><DeleteIcon fontSize="small" sx={{ color: '#fca3a5' }} /></IconButton>
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      </Dialog>

      {/* Edit dialog removed — editing now happens in parent form */}

      {/* Delete confirmation dialog */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Confirm delete</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to delete account code <strong>{confirmCode}</strong>?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snack.open} autoHideDuration={3000} onClose={handleCloseSnack}>
        <Alert onClose={handleCloseSnack} severity={snack.severity} sx={{ width: '100%' }}>{snack.msg}</Alert>
      </Snackbar>

      {/* Save confirmation dialog */}
      <Dialog open={saveConfirmOpen} onClose={() => setSaveConfirmOpen(false)}>
        <DialogTitle>Confirm save</DialogTitle>
        <DialogContent>
          <DialogContentText>Do you want to save this account?</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ pr: 2 }}>
          <Button
            onClick={() => setSaveConfirmOpen(false)}
            variant={saveConfirmSelection === 0 ? 'contained' : 'text'}
            color={saveConfirmSelection === 0 ? 'primary' : 'inherit'}
          >
            No
          </Button>
          <Button
            autoFocus
            onClick={handleSaveConfirm}
            variant={saveConfirmSelection === 1 ? 'contained' : 'text'}
            color={saveConfirmSelection === 1 ? 'primary' : 'inherit'}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
// ...existing code...