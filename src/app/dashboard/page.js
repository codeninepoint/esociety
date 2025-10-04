'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import ListItemButton from '@mui/material/ListItemButton';
import Sidebar from '@/components/layout/Sidebar';
import { Box, Typography, Paper, Button, Stack, Avatar } from '@mui/material';
import { Home, Group, AccountBalance, Receipt } from '@mui/icons-material';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const iconMap = {
  Home: <Home />,
  Group: <Group />,
  AccountBalance: <AccountBalance />,
  Receipt: <Receipt />,
};

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setData);
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#18181b' }}>
  {/* Sidebar removed: now rendered in layout.js */}
      <Box
        sx={{
          flexGrow: 1,
          bgcolor: '#f8fafc',
          p: 4,
          maxWidth: 'calc(100vw - 240px)',
          overflowX: 'auto',
          minHeight: '100vh',
        }}
      >
        <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
          <Typography variant="h5" fontWeight="bold" mb={3}>Overview</Typography>
          <Stack direction="row" spacing={2} mb={3}>
            {data.overviewData.map((item) => (
              <Paper key={item.label} sx={{ p: 2, flex: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
                {iconMap[item.icon]}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">{item.label}</Typography>
                  <Typography variant="h6" fontWeight="bold">{item.value}</Typography>
                </Box>
              </Paper>
            ))}
          </Stack>

          <Typography variant="h6" fontWeight="medium" mb={2}>Quick Actions</Typography>
          <Stack direction="row" spacing={2} mb={3}>
            {data.quickActions.map((action) => (
              <Button key={action} variant="contained" color="primary">{action}</Button>
            ))}
          </Stack>

          <Typography variant="h6" fontWeight="medium" mb={2}>Recent Activity</Typography>
          <Paper sx={{ mb: 3 }}>
            <Box sx={{ p: 2 }}>
              {/* Header Row */}
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  fontWeight: 'bold',
                  color: 'text.secondary',
                  mb: 1,
                  px: 1,
                }}
              >
                <Typography variant="body2">Activity</Typography>
                <Typography variant="body2">Status/Amount</Typography>
                <Typography variant="body2">Details/Time</Typography>
                <Typography variant="body2">User</Typography>
              </Box>
              {/* Data Rows */}
              <Stack spacing={1}>
                {data.recentActivity.map((item, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr',
                      alignItems: 'center',
                      px: 1,
                    }}
                  >
                    <Typography variant="body2">{item.activity}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.status}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.time}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.user}</Typography>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Paper>

          <Typography variant="h6" fontWeight="medium" mb={2}>Collections Trend</Typography>
          <Paper sx={{ p: 2, maxWidth: 700, mx: 'auto' }}>
            <Box sx={{ height: 300 }}>
              <Bar
                data={data.chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                }}
              />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}