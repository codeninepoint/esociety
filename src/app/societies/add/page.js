// src/app/societies/add/page.js
'use client';

import { useContext, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ModuleContext } from '../ModuleProvider.js';
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
  const router = useRouter();
  const { moduleContext, setModuleContext } = useContext(ModuleContext);
  const { context } = useContext(AppContext);
  console.log('AddSocietyPage ModuleContext:', moduleContext);
  const [form, setForm] = useState(initialState);
  const [error, setError] = useState(null);

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
    setError(null); // Clear any previous errors
    
    try {
      // Send context along with form data
      const payload = { ...form };
      // Add organization_id from context if available
      if (context?.organizationId) {
        payload.organization_id = context.organizationId;
        payload.organizationId = context.organizationId;
      }
      
      console.log('Creating society with payload:', payload);
      
      const response = await fetch('/api/societies/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status, response.ok);

      if (response.ok) {
        let createdSociety = null;
        try {
          createdSociety = await response.json();
          console.log('Created society response:', createdSociety);
        } catch (parseError) {
          console.warn('Failed to parse response as JSON, using form data:', parseError);
          // If parsing fails, use form data
          createdSociety = { society_code: form.society_code, name: form.society_name };
        }
        
        // Extract society code and name from the response or form
        const societyCode = createdSociety?.society_code || createdSociety?.code || form.society_code;
        const societyName = createdSociety?.name || createdSociety?.society_name || form.society_name;
        
        console.log('Created society - Code:', societyCode, 'Name:', societyName);
        
        // Update module context with the newly created society
        if (setModuleContext && societyCode) {
          setModuleContext({ 
            ...moduleContext, 
            society_code: societyCode, 
            society_name: societyName 
          });
          console.log('Updated module context');
        }
        
        // Navigate to the society list page (use replace so user can't go back to add page)
        console.log('Navigating to /societies/society');
        try {
          router.replace('/societies/society');
        } catch (navError) {
          console.error('Navigation error, using window.location:', navError);
          // Fallback to window.location if router.replace fails
          window.location.replace('/societies/society');
        }
      } else {
        // Handle error case
        let errorData = { error: 'Failed to create society' };
        try {
          const text = await response.text();
          if (text) {
            errorData = JSON.parse(text);
          }
        } catch (parseError) {
          console.warn('Failed to parse error response, using default error message');
        }
        console.error('Failed to create society - Status:', response.status, 'Error:', errorData);
        setError(errorData?.error || `Failed to create society (Status: ${response.status}). Please try again.`);
      }
    } catch (error) {
      console.error('Error creating society:', error);
      setError('An error occurred while creating the society. Please try again.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexGrow: 1, minHeight: '100vh', background: '#f8fafc' }}>
      <Grid container sx={{ minHeight: '100vh' }}>
        <Grid sx={{ width: '83.333%', p: 4, display: 'flex', flexDirection: 'column' }}>
          <div className="add-society-container">
          <Box sx={{ width: '100%', maxWidth: 900 }}>
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              <Link href="/dashboard" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
              <Link href="/societies" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>Societies</Link>
              <Typography color="text.primary" fontWeight={500}>Add Society</Typography>
            </Breadcrumbs>
            <h2 className="add-society-title" style={{ textAlign: 'center' }}>Add Society</h2>
            {error ? (
              <div className="add-society-error" style={{ textAlign: 'center', color: '#d32f2f', padding: '1rem', backgroundColor: '#ffebee', borderRadius: '4px', marginBottom: '1rem' }}>
                {error}
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
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}
