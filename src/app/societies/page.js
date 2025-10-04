'use client';

import { useContext, useEffect, useState } from 'react';
import { AppContext } from '@/app/ContextProvider';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Sidebar from '@/components/layout/Sidebar';

const PAGE_SIZE = 10;

export default function SocietiesListPage() {
  const { context } = useContext(AppContext);
  console.log('SocietiesListPage context:', context);
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchSocieties() {
      setLoading(true);
      const params = new URLSearchParams({
        page,
        limit: PAGE_SIZE,
        ...(context.customer && context.customer !== 'All Customers' ? { customer: context.customer } : {}),
        ...(context.subscription && context.subscription !== 'All Subscriptions' ? { subscription: context.subscription } : {}),
        ...(context.profile && context.profile !== 'All Profiles' ? { profile: context.profile } : {}),
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
    <Box sx={{ display: 'flex',flexGrow: 1, minHeight: '100vh', background: '#f8fafc' }}>
      <Grid container sx={{ minHeight: '100vh' }}>
        {/* Sidebar removed: now rendered in layout.js */}
        <Grid sx={{ width: '83.333%', p: 4 }}>
          <div className="add-society-container">
            <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
              <Link href="/dashboard" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
              <Typography color="text.primary" fontWeight={500}>Societies</Typography>
            </Breadcrumbs>
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

export async function GET(request) {
  // Parse pagination params
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);

  // Example stubbed data (replace with DB call in real app)
  const allSocieties = [
    { society_name: 'Green Valley Society', society_code: 'GVS', authorized_signatory: 'John Doe', total_members: 120, account_year: '2024-2025' },
    { society_name: 'Blue Lake Residency', society_code: 'BLR', authorized_signatory: 'Jane Smith', total_members: 80, account_year: '2024-2025' },
    // ...add more mock societies for demo
    ...Array.from({ length: 30 }, (_, i) => ({
      society_name: `Society ${i + 3}`,
      society_code: `S${i + 3}`,
      authorized_signatory: `Signatory ${i + 3}`,
      total_members: 50 + i,
      account_year: '2024-2025',
    })),
  ];

  const start = (page - 1) * limit;
  const end = start + limit;
  const pagedSocieties = allSocieties.slice(start, end);

  return Response.json({
    societies: pagedSocieties,
    total: allSocieties.length,
    page,
    limit,
  });
}