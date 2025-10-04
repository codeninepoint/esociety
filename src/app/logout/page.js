'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';

// Material UI imports
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

export default function LoginForm() {
  const [mounted, setMounted] = useState(false);
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // Prevent hydration mismatch

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await AuthService.login(credentials);

      AuthService.setToken(response.access_token);
      if (response.username && response.role) {
        const user = {
          username: response.username,
          role: response.role,
        };
        localStorage.setItem('user', JSON.stringify(user));
      }

      router.push('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f3f4f6" px={2}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, width: 400, maxWidth: '100%' }}>
        <Typography variant="h5" fontWeight="bold" color="text.primary" align="center" mb={3}>
          Community Login
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" align="center" mb={2}>
          Sign in to your account
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="Username"
              name="username"
              value={credentials.username}
              onChange={handleChange}
              disabled={isLoading}
              required
              autoFocus
              fullWidth
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={credentials.password}
              onChange={handleChange}
              disabled={isLoading}
              required
              fullWidth
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={isLoading}
              sx={{ mt: 1 }}
            >
              {isLoading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Stack>
        </form>
        <Box mt={2} textAlign="center">
          <Button variant="text" size="small" onClick={() => alert('Password reset functionality would be implemented here')}>
            Forgot your password?
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}