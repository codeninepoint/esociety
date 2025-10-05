'use client';

import { useContext, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { ModuleContext } from './ModuleProvider.js';
import { AppContext } from '@/app/ContextProvider';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Sidebar from '@/components/layout/Sidebar';

const PAGE_SIZE = 10;

export default function SocietiesListPage() {
  const { moduleContext } = useContext(ModuleContext);
  const { context } = useContext(AppContext);
  console.log('SocietiesListPage ModuleContext:', moduleContext);
  console.log('SocietiesListPage AppContext:', context);
  const [societies, setSocieties] = useState([]);
  const [selectedSociety, setSelectedSociety] = useState(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchSocieties() {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: PAGE_SIZE,
        // Example: combine both contexts if needed
        ...(moduleContext.customer && moduleContext.customer !== 'All Customers' ? { customer: moduleContext.customer } : {}),
        ...(moduleContext.subscription && moduleContext.subscription !== 'All Subscriptions' ? { subscription: moduleContext.subscription } : {}),
        ...(moduleContext.profile && moduleContext.profile !== 'All Profiles' ? { profile: moduleContext.profile } : {}),
        ...(context.organization ? { organization: context.organization } : {}),
        ...(context.project ? { project: context.project } : {}),
        ...(context.module ? { module: context.module } : {}),
        ...(context.subscription ? { app_subscription: context.subscription } : {}),
        ...(context.location ? { location: context.location } : {}),
      });
      const res = await fetch(`/api/societies/list?${params.toString()}`);
      const data = await res.json();
      setSocieties(data.societies || []);
      setTotal(data.total || 0);
      setLoading(false);
    }
    fetchSocieties();
  }, [page, context]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <Box sx={{ display: 'flex', flexGrow: 1, minHeight: '100vh', background: '#f8fafc' }}>
      <Grid container sx={{ minHeight: '100vh' }}>
        <Grid sx={{ width: '83.333%', p: 4 }}>
          <div className="add-society-container">
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
              <Breadcrumbs aria-label="breadcrumb">
                <Link href="/dashboard" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
                <Typography color="text.primary" fontWeight={500}>Societies</Typography>
              </Breadcrumbs>
              <Box sx={{ minWidth: 200, textAlign: 'right', color: '#1976d2', fontWeight: 600, fontSize: 18 }}>
                {moduleContext.society_name || context.society_name || ''}
              </Box>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, background: '#fff', p: 2, borderRadius: 2, boxShadow: 1 }}>
              <Button variant="contained" color="primary" disabled={!selectedSociety}>Modify</Button>
              <Button variant="contained" color="success">Add</Button>
              <Button variant="contained" color="info" disabled={!selectedSociety}>Copy</Button>
              <Button variant="contained" color="error" disabled={!selectedSociety}>Delete</Button>
            </Box>
            <h2 className="add-society-title">Societies List</h2>
            {loading ? (
              <div>Loading...</div>
            ) : societies.length === 0 ? (
              <div>No societies found.</div>
            ) : (
              <>
                <div className="societies-list-table-wrapper">
                  <table className="societies-list-table">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Society Name</th>
                        <th>Society Code</th>
                        <th>Authorized Signatory</th>
                        <th>Total Members</th>
                        <th>Account Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      {societies.map((society) => (
                        <tr key={society.society_code}>
                          <td>
                            <Checkbox
                              checked={selectedSociety === society.society_code}
                              onChange={() => setSelectedSociety(selectedSociety === society.society_code ? null : society.society_code)}
                              inputProps={{ 'aria-label': `Select ${society.society_name}` }}
                            />
                          </td>
                          <td>{society.society_name}</td>
                          <td>{society.society_code}</td>
                          <td>{society.authorized_signatory}</td>
                          <td>{society.total_members}</td>
                          <td>{society.account_year}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pagination-controls">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="pagination-btn"
                  >
                    Previous
                  </button>
                  <span className="pagination-info">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="pagination-btn"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}
