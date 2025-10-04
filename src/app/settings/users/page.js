'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from 'next/link';
import {
  Box, Typography, Button, Paper, Tabs, Tab, Avatar, IconButton, TextField, InputAdornment
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';

const roles = ['All', 'Admin', 'Manager', 'Accountant'];

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState('All');
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    let url = 'http://localhost:8000/users?status=active';
    if (role !== 'All') url += `&role=${role.toLowerCase()}`;
    fetch(url)
      .then(res => res.json())
      .then(data => setUsers(data));
  }, [role]);

  const filteredUsers = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#18181b' }}>
      <Sidebar selected="Users" />
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: '#f8fafc',
          p: 4,
          maxWidth: 'calc(100vw - 240px)',
          minHeight: '100vh',
        }}
      >
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
            <Link href="/dashboard" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
            <Link href="/settings" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>Settings</Link>
            <Typography color="text.primary" fontWeight={500}>Users</Typography>
          </Breadcrumbs>
          <Typography variant="h5" fontWeight="bold" mb={2}>Users</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 2 }}>
            <Button variant="contained" sx={{ flexShrink: 0 }} onClick={() => router.push('/settings/users/adduser')}>Add User</Button>
            <TextField
              size="small"
              placeholder="Search by name, email, or role"
              value={search}
              onChange={e => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ bgcolor: '#fff', borderRadius: 1, flex: 1 }}
            />
          </Box>
          <Tabs value={tab} onChange={(_, v) => { setTab(v); setRole(roles[v]); }} sx={{ mb: 2 }}>
            {roles.map((r, i) => <Tab key={r} label={r} />)}
          </Tabs>
          <Paper>
            <Box sx={{ display: 'grid', gridTemplateColumns: '3fr 2fr 1fr 1fr 80px', fontWeight: 'bold', p: 2, bgcolor: '#f9fafb' }}>
             <span>Name</span>
             <span>Email</span>
             <span>Role</span>
             <span>Status</span>
             <span>Actions</span>
            </Box>

            {/* Data rows */}
            {filteredUsers.map(u => (
             <Box key={u.id} sx={{ display: 'grid', gridTemplateColumns: '3fr 2fr 1fr 1fr 80px', alignItems: 'center', p: 2, borderBottom: '1px solid #eee' }}>
               <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                 <Avatar sx={{ bgcolor: '#2563eb' }}>{u.username[0]?.toUpperCase()}</Avatar>
                 <Typography>{u.username}</Typography>
               </Box>
               <Typography>{u.email}</Typography>
               <Typography>{u.role}</Typography>
               <Typography>{u.status}</Typography>
               <Box>
                 <IconButton><EditIcon /></IconButton>
                 <IconButton><DeleteIcon /></IconButton>
               </Box>
             </Box>
            ))}
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}