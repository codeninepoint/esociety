// 'use client';


// import Sidebar from '@/components/layout/Sidebar';
// import Breadcrumbs from '@mui/material/Breadcrumbs';
// import Link from 'next/link';
// import {
//   Box, Typography, Button, TextField, MenuItem, Paper
// } from '@mui/material';
// import { useRouter } from 'next/navigation';
// import { useState } from 'react';

// const roles = ['Admin', 'Manager', 'Accountant', 'Owner',"Vendor"];


// export default function AddUserPage() {
//   const router = useRouter();
//   const [form, setForm] = useState({
//     name: '',
//     email: '',
//     role: '',
//     phone: '',
//     address: '',
//     password: '',
//     retypePassword: '',
//   });
//   const [error, setError] = useState('');
//   const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');
//     if (!form.password || form.password !== form.retypePassword) {
//       setError('Passwords do not match');
//       return;
//     }
//     const res = await fetch('http://localhost:8000/users', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({
//         username: form.name,
//         email: form.email,
//         password: form.password,
//         role: form.role,
//         status: 'active',
//       }),
//     });
//     if (res.ok) {
//       router.push('/settings/users');
//     } else {
//       const data = await res.json();
//       setError(data.detail || 'Failed to create user');
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#18181b' }}>
//       {/* <Sidebar selected="Users" /> */}
//       <Box sx={{ flexGrow: 1, bgcolor: '#f8fafc', p: 4, maxWidth: 'calc(100vw - 240px)', minHeight: '100vh' }}>
//         <Box sx={{ maxWidth: 800, mx: 'auto' }}>
//           <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
//             <Link href="/dashboard" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>Dashboard</Link>
//             <Link href="/settings" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>Settings</Link>
//             <Link href="/settings/users" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 500 }}>Users</Link>
//             <Typography color="text.primary" fontWeight={500}>Add User</Typography>
//           </Breadcrumbs>
//           <Typography variant="h5" fontWeight="bold" mb={2}>Add New User</Typography>
//           <Typography variant="h6" fontWeight="medium" mb={2}>User Details</Typography>
//           <Paper sx={{ p: 4 }}>
//             <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit}>
//               <TextField
//                 label="Full Name"
//                 name="name"
//                 value={form.name}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//                 placeholder="Enter full name"
//                 InputProps={{ sx: { bgcolor: '#f7f7f7' } }}
//               />
//               <TextField
//                 label="Email"
//                 name="email"
//                 value={form.email}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//                 placeholder="Enter email address"
//                 InputProps={{ sx: { bgcolor: '#f7f7f7' } }}
//               />
//               <TextField
//                 label="Role"
//                 name="role"
//                 value={form.role}
//                 onChange={handleChange}
//                 select
//                 fullWidth
//                 margin="normal"
//                 placeholder="Select role"
//                 InputProps={{ sx: { bgcolor: '#f7f7f7' } }}
//               >
//                 {roles.map(r => <MenuItem key={r} value={r}>{r}</MenuItem>)}
//               </TextField>
//               <TextField
//                 label="Phone Number"
//                 name="phone"
//                 value={form.phone}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//                 placeholder="Enter phone number"
//                 InputProps={{ sx: { bgcolor: '#f7f7f7' } }}
//               />
//               <TextField
//                 label="Address"
//                 name="address"
//                 value={form.address}
//                 onChange={handleChange}
//                 fullWidth
//                 margin="normal"
//                 multiline
//                 minRows={3}
//                 placeholder="Enter address"
//                 InputProps={{ sx: { bgcolor: '#f7f7f7' } }}
//               />
//               <TextField
//               label="Password"
//               name="password"
//               type="password"
//               value={form.password}
//               onChange={handleChange}
//               fullWidth
//               margin="normal"
//               placeholder="Enter password"
//               InputProps={{ sx: { bgcolor: '#f7f7f7' } }}
//             />
//             <TextField
//               label="Retype Password"
//               name="retypePassword"
//               type="password"
//               value={form.retypePassword}
//               onChange={handleChange}
//               fullWidth
//               margin="normal"
//               placeholder="Retype password"
//               InputProps={{ sx: { bgcolor: '#f7f7f7' } }}
//             />
//               <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
//                 <Button variant="contained" color="primary">Create User</Button>
//                 <Button variant="outlined" color="primary" onClick={() => router.back()}>Cancel</Button>
//               </Box>
//             </Box>
//           </Paper>
//         </Box>
//       </Box>
//     </Box>
//   );
// }