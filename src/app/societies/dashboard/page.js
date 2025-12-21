'use client';

import { useEffect, useState, useContext } from 'react';
import { ModuleContext } from '../ModuleProvider';
import { AppContext } from '@/app/ContextProvider';
import Link from 'next/link';
import { Box, Typography, Paper, Button, Stack, Avatar, Chip, IconButton } from '@mui/material';
import { Home, Group, AccountBalance, Receipt, TrendingUp, Add, Edit, Delete, Refresh } from '@mui/icons-material';
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

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const {moduleContext, setModuleContext} = useContext(ModuleContext);
  const [societies, setSocieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { context: appContext } = useContext(AppContext);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const orgIdParam = appContext?.organizationId ? `?organizationId=${encodeURIComponent(appContext.organizationId)}` : ''

    fetch(`/api/societies/dashboard${orgIdParam}`)
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) throw { status: res.status, body: json };
        return json;
      })
      .then((d) => setData(d))
      .catch((err) => {
        console.error('Failed to load dashboard:', err);
        setError(err);
      })
      .finally(() => setLoading(false));

    const separator = orgIdParam ? '&' : '?'
    fetch(`/api/societies/list${orgIdParam}${separator}page=1&limit=100`)
      .then(async (res) => {
        const json = await res.json().catch(() => null);
        if (!res.ok) throw { status: res.status, body: json };
        return json;
      })
      .then((result) => {
        const list = result.societies || []
        setSocieties(list)

        try {
          if ((!moduleContext?.society_code || moduleContext.society_code === '') && list.length > 0) {
            const s = list[0]
            const code = s.society_code || ''
            const name = s.name || s.society_name || ''
            setModuleContext({ society_code: code, society_name: name })
          }
        } catch (e) {
          console.warn('Error setting module context from societies list', e)
        }
      })
      .catch((err) => {
        console.error('Failed to load societies list:', err);
      });
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

  if (error) {
    const status = error?.status || 'network'
    const msg = (error?.body && (error.body.error || JSON.stringify(error.body))) || 'Failed to fetch dashboard'
    return (
      <Box sx={{ 
        p: 4, 
        textAlign: 'center',
        bgcolor: 'rgba(239, 68, 68, 0.1)',
        borderRadius: '16px',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        maxWidth: 500,
        mx: 'auto',
        mt: 4,
      }}>
        <Typography variant="h6" sx={{ color: '#ef4444', mb: 1 }}>Error loading dashboard</Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8' }}>Status: {String(status)}</Typography>
        <Typography variant="body2" sx={{ color: '#94a3b8' }}>{String(msg)}</Typography>
      </Box>
    )
  }

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
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 4,
        flexWrap: 'wrap',
        gap: 2,
      }}>
        <Box>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700, 
              color: '#f1f5f9',
              mb: 0.5,
            }}
          >
            Society Overview
          </Typography>
          <Typography sx={{ color: '#64748b', fontSize: '0.95rem' }}>
            Manage and monitor your society operations
          </Typography>
        </Box>

        {/* Society Selector */}
        {societies && societies.length > 0 && (
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            background: 'rgba(30, 41, 59, 0.6)',
            borderRadius: '12px',
            padding: '8px 16px',
            border: '1px solid rgba(148, 163, 184, 0.1)',
          }}>
            <Typography sx={{ color: '#64748b', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
              Current Society:
            </Typography>
            <select
              value={moduleContext?.society_code || ''}
              onChange={(e) => {
                const code = e.target.value
                const s = societies.find(s => (s.society_code || s.societyCode || s.code || s.id) === code)
                const name = s ? (s.name || s.society_name || '') : ''
                try { setModuleContext({ society_code: code, society_name: name }) } catch (err) { console.warn(err) }
              }}
              style={{ 
                padding: '8px 32px 8px 12px',
                borderRadius: '8px',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                background: 'rgba(15, 23, 42, 0.8)',
                color: '#e2e8f0',
                fontSize: '0.9rem',
                fontWeight: 500,
                cursor: 'pointer',
                outline: 'none',
                appearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
              }}
            >
              {societies.map((s) => {
                const code = s.society_code || s.societyCode || s.code || s.id || ''
                const name = s.name || s.society_name || code
                return <option key={code} value={code} style={{ background: '#1e293b', color: '#e2e8f0' }}>{name} ({code})</option>
              })}
            </select>
          </Box>
        )}
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
                {item.label === 'Societies' && (
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
          {[
            { label: 'Add Society', icon: <Add />, color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
            { label: 'Modify', icon: <Edit />, color: '#6366f1', bg: 'rgba(99, 102, 241, 0.1)' },
            { label: 'Delete', icon: <Delete />, color: '#ef4444', bg: 'rgba(239, 68, 68, 0.1)' },
            { label: 'Refresh', icon: <Refresh />, color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
          ].map((action) => (
            <Button 
              key={action.label} 
              variant="outlined"
              startIcon={action.icon}
              sx={{
                color: action.color,
                borderColor: 'rgba(148, 163, 184, 0.2)',
                bgcolor: action.bg,
                borderRadius: '10px',
                px: 2.5,
                py: 1,
                textTransform: 'none',
                fontWeight: 500,
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: action.color,
                  bgcolor: action.bg,
                  transform: 'translateY(-2px)',
                },
              }}
            >
              {action.label}
            </Button>
          ))}
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
              label={`${data.recentActivity.length} items`} 
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
              {data.recentActivity.map((item, idx) => (
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
                      bgcolor: item.status?.toLowerCase().includes('success') || item.status?.toLowerCase().includes('paid')
                        ? 'rgba(34, 197, 94, 0.15)'
                        : 'rgba(251, 191, 36, 0.15)',
                      color: item.status?.toLowerCase().includes('success') || item.status?.toLowerCase().includes('paid')
                        ? '#22c55e'
                        : '#fbbf24',
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
