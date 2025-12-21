'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Box, Typography, Paper, Button, Stack, Avatar, Chip

 } from '@mui/material';
import { Home, Group, AccountBalance, Receipt, TrendingUp, Add, Description, Payment, Assessment } from '@mui/icons-material';
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
  Home: <Home sx={{ fontSize: 28 }} />,
  Group: <Group sx={{ fontSize: 28 }} />,
  AccountBalance: <AccountBalance sx={{ fontSize: 28 }} />,
  Receipt: <Receipt sx={{ fontSize: 28 }} />,
};

const gradients = [
  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
];

const actionIcons = {
  'Add Society': <Add />,
  'ADD SOCIETY': <Add />,
  'Create Voucher': <Description />,
  'CREATE VOUCHER': <Description />,
  'Record Payment': <Payment />,
  'RECORD PAYMENT': <Payment />,
  'Generate Report': <Assessment />,
  'GENERATE REPORT': <Assessment />,
};

const actionColors = {
  'Add Society': { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
  'ADD SOCIETY': { color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
  'Create Voucher': { color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
  'CREATE VOUCHER': { color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
  'Record Payment': { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  'RECORD PAYMENT': { color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.1)' },
  'Generate Report': { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  'GENERATE REPORT': { color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
};

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: 400,
        flexDirection: 'column',
        gap: 2,
      }}>
        <Box sx={{
          width: 48,
          height: 48,
          border: '3px solid rgba(99, 102, 241, 0.2)',
          borderTopColor: '#6366f1',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        }} />
        <Typography sx={{ color: '#64748b' }}>Loading dashboard...</Typography>
      </Box>
    );
  }

  if (!data) return null;

  // Custom chart options for dark theme
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        borderColor: 'rgba(148, 163, 184, 0.2)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#64748b' },
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.1)' },
        ticks: { color: '#64748b' },
      },
    },
  };

  // Update chart data colors
  const chartData = data?.chartData ? {
    ...data.chartData,
    datasets: data.chartData.datasets?.map((ds, i) => ({
      ...ds,
      backgroundColor: i === 0 ? 'rgba(99, 102, 241, 0.8)' : 'rgba(168, 85, 247, 0.8)',
      borderColor: i === 0 ? '#6366f1' : '#a855f7',
      borderWidth: 2,
      borderRadius: 8,
    })) || [],
  } : { labels: [], datasets: [] };

  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: '#f1f5f9',
            mb: 0.5,
          }}
        >
          Main Overview
        </Typography>
        <Typography sx={{ color: '#64748b', fontSize: '0.95rem' }}>
          Welcome back! Here's what's happening across your societies
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 3,
        mb: 4,
      }}>
        {data.overviewData.map((item, idx) => (
          <Paper 
            key={item.label} 
            sx={{ 
              p: 3,
              background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
              border: '1px solid rgba(148, 163, 184, 0.1)',
              borderRadius: '16px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
                borderColor: 'rgba(99, 102, 241, 0.3)',
              },
            }}
          >
            {/* Background decoration */}
            <Box sx={{
              position: 'absolute',
              top: -20,
              right: -20,
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: gradients[idx % gradients.length],
              opacity: 0.1,
              filter: 'blur(20px)',
            }} />
            
            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
              <Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#64748b',
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    fontWeight: 500,
                    mb: 1,
                  }}
                >
                  {item.label}
                </Typography>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 700,
                    color: '#f1f5f9',
                    fontSize: '2rem',
                    lineHeight: 1,
                  }}
                >
                  {item.value}
                </Typography>
                {item.label.toLowerCase().includes('societ') && (
                  <Chip 
                    label="Active" 
                    size="small"
                    sx={{ 
                      mt: 1.5,
                      bgcolor: 'rgba(34, 197, 94, 0.15)',
                      color: '#22c55e',
                      fontWeight: 500,
                      fontSize: '0.7rem',
                      height: 24,
                    }} 
                  />
                )}
                {item.label.toLowerCase().includes('dues') && (
                  <Chip 
                    label="Pending" 
                    size="small"
                    sx={{ 
                      mt: 1.5,
                      bgcolor: 'rgba(239, 68, 68, 0.15)',
                      color: '#ef4444',
                      fontWeight: 500,
                      fontSize: '0.7rem',
                      height: 24,
                    }} 
                  />
                )}
              </Box>
              <Box sx={{
                width: 52,
                height: 52,
                borderRadius: '14px',
                background: gradients[idx % gradients.length],
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                boxShadow: `0 8px 24px ${idx === 0 ? 'rgba(99, 102, 241, 0.3)' : idx === 1 ? 'rgba(236, 72, 153, 0.3)' : idx === 2 ? 'rgba(59, 130, 246, 0.3)' : 'rgba(34, 197, 94, 0.3)'}`,
              }}>
                {iconMap[item.icon] || <TrendingUp sx={{ fontSize: 28 }} />}
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Quick Actions */}
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 600, 
            color: '#e2e8f0',
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <Box sx={{
            width: 4,
            height: 20,
            borderRadius: 2,
            background: 'linear-gradient(180deg, #6366f1 0%, #8b5cf6 100%)',
          }} />
          Quick Actions
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
          {data.quickActions.map((action) => {
            const colors = actionColors[action] || { color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' };
            const icon = actionIcons[action] || <Add />;
            return (
              <Button 
                key={action} 
                variant="outlined"
                startIcon={icon}
                sx={{
                  color: colors.color,
                  borderColor: 'rgba(148, 163, 184, 0.2)',
                  bgcolor: colors.bg,
                  borderRadius: '10px',
                  px: 2.5,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 500,
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    borderColor: colors.color,
                    bgcolor: colors.bg,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {action.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ')}
              </Button>
            );
          })}
        </Stack>
      </Box>

      {/* Two Column Layout */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
        gap: 3,
      }}>
        {/* Recent Activity */}
        <Paper sx={{ 
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          <Box sx={{ 
            p: 2.5, 
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#e2e8f0' }}>
              Recent Activity
            </Typography>
            <Chip 
              label={`${data.recentActivity?.length || 0} items`} 
              size="small"
              sx={{ 
                bgcolor: 'rgba(99, 102, 241, 0.15)',
                color: '#818cf8',
                fontWeight: 500,
                fontSize: '0.75rem',
              }} 
            />
          </Box>
          <Box sx={{ p: 2 }}>
            <Stack spacing={1}>
              {data.recentActivity?.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    p: 1.5,
                    borderRadius: '10px',
                    transition: 'background 0.2s',
                    '&:hover': {
                      bgcolor: 'rgba(99, 102, 241, 0.05)',
                    },
                  }}
                >
                  <Avatar sx={{ 
                    width: 36, 
                    height: 36, 
                    bgcolor: gradients[idx % gradients.length],
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}>
                    {item.user?.charAt(0) || 'U'}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#e2e8f0',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.activity}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748b' }}>
                      {item.user} • {item.time}
                    </Typography>
                  </Box>
                  <Chip 
                    label={item.status} 
                    size="small"
                    sx={{ 
                      bgcolor: item.status?.toLowerCase().includes('success') || item.status?.toLowerCase().includes('paid') || item.status?.toLowerCase().includes('approved')
                        ? 'rgba(34, 197, 94, 0.15)'
                        : item.status?.toLowerCase().includes('pending')
                        ? 'rgba(251, 191, 36, 0.15)'
                        : 'rgba(99, 102, 241, 0.15)',
                      color: item.status?.toLowerCase().includes('success') || item.status?.toLowerCase().includes('paid') || item.status?.toLowerCase().includes('approved')
                        ? '#22c55e'
                        : item.status?.toLowerCase().includes('pending')
                        ? '#fbbf24'
                        : '#818cf8',
                      fontWeight: 500,
                      fontSize: '0.7rem',
                      height: 22,
                    }} 
                  />
                </Box>
              ))}
            </Stack>
          </Box>
        </Paper>

        {/* Collections Trend Chart */}
        <Paper sx={{ 
          background: 'linear-gradient(145deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.95) 100%)',
          border: '1px solid rgba(148, 163, 184, 0.1)',
          borderRadius: '16px',
          overflow: 'hidden',
        }}>
          <Box sx={{ 
            p: 2.5, 
            borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#e2e8f0' }}>
              Collections Trend
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {['Weekly', 'Monthly', 'Yearly'].map((period, i) => (
                <Chip
                  key={period}
                  label={period}
                  size="small"
                  sx={{
                    bgcolor: i === 1 ? 'rgba(99, 102, 241, 0.2)' : 'transparent',
                    color: i === 1 ? '#818cf8' : '#64748b',
                    fontWeight: 500,
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: i === 1 ? 'rgba(99, 102, 241, 0.3)' : 'rgba(148, 163, 184, 0.15)',
                    '&:hover': {
                      bgcolor: 'rgba(99, 102, 241, 0.1)',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
          <Box sx={{ p: 3, height: 300 }}>
            <Bar data={chartData} options={chartOptions} />
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
