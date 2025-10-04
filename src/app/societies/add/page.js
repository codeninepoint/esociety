// src/app/societies/add/page.js
'use client';

import { useContext, useState } from 'react';
import { AppContext } from '@/app/ContextProvider';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Sidebar from '@/components/layout/Sidebar';

const initialState = {
  society_name: '',
  society_code: '',
  interest_charged: '',
  interest_type: '',
  due_days_of_payment: '',
  interest_from_bd_to_dd: '',
  account_period_from: '',
  account_period_to: '',
  authorized_signatory: '',
  total_members: '',
  charge_for_late_payment: '',
  from_bill_date_to_due_date: '',
  rebate_percent_or_amount: '',
  rebate_days: '',
  rebate_amount_or_percent: '',
  adjust_first_ip_or_pi: '',
  account_year: '',
};

const blocks = [
  {
    title: 'Society Details',
    fields: [
      'society_name',
      'society_code',
      'authorized_signatory',
      'total_members',
      'account_year',
    ],
  },
  {
    title: 'Interest & Payment',
    fields: [
      'interest_charged',
      'interest_type',
      'due_days_of_payment',
      'interest_from_bd_to_dd',
      'charge_for_late_payment',
      'from_bill_date_to_due_date',
      'account_period_from',
      'account_period_to',
      'adjust_first_ip_or_pi',
    ],
  },
  {
    title: 'Rebate',
    fields: [
      'rebate_percent_or_amount',
      'rebate_days',
      'rebate_amount_or_percent',
    ],
  },
];

// Utility to suggest a code from society name
function suggestSocietyCode(name) {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();
}

export default function AddSocietyPage() {
  const { context } = useContext(AppContext);
  const [form, setForm] = useState(initialState);
  const [submitted, setSubmitted] = useState(false);

  // Suggest code as user types society_name, but allow editing society_code
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

    if (name === 'society_name') {
      const suggested = suggestSocietyCode(value);
      if (!form.society_code || form.society_code === suggestSocietyCode(form.society_name)) {
        updatedForm.society_code = suggested;
      }
    }
    setForm(updatedForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Send context along with form data
    await fetch('/api/societies/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, ...context }),
    });
    setSubmitted(true);
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', background: '#f8fafc' }}>
      <Grid container sx={{ minHeight: '100vh' }}>
        <Grid sx={{ width: '16.666%', minWidth: 180 }}>
          {/* Sidebar removed: now rendered in layout.js */}
        </Grid>
        <Grid sx={{ width: '83.333%', p: 4, display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ width: '100%', maxWidth: 900 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              <Link href="/dashboard" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
              <Link href="/societies" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>Societies</Link>
              <Typography color="text.primary" fontWeight={500}>Add Society</Typography>
            </Breadcrumbs>
            <h2 className="add-society-title" style={{ textAlign: 'center' }}>Add Society</h2>
            {submitted ? (
              <div className="add-society-success" style={{ textAlign: 'center' }}>
                Society added (stubbed)!
              </div>
            ) : null}
            <form onSubmit={handleSubmit}>
              {blocks.map((block, blockIdx) => (
                <div key={block.title} className="add-society-block" style={{ marginBottom: '2rem' }}>
                  <div className="add-society-block-title">{block.title}</div>
                  <div className="add-society-row" style={{ flexWrap: 'wrap' }}>
                    {block.fields.map((key) => (
                      <div className="add-society-field" key={key}>
                        <label
                          className="add-society-label"
                          htmlFor={key}
                          title={key.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                        >
                          {key
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </label>
                        <input
                          type="text"
                          id={key}
                          name={key}
                          value={form[key]}
                          onChange={handleChange}
                          className="add-society-input"
                          required={key === 'society_name'}
                          placeholder={key === 'society_code' ? "Auto-suggested from Society Name, can edit" : ""}
                        />
                      </div>
                    ))}
                  </div>
                  {blockIdx < blocks.length - 1 && (
                    <hr className="add-society-divider" style={{ marginTop: '1rem', marginBottom: '1rem' }} />
                  )}
                </div>
              ))}
              <button type="submit" className="add-society-submit" style={{ marginTop: '1rem' }}>
                Submit
              </button>
            </form>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}