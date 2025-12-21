"use client";
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { signIn } from "next-auth/react";
import { useState } from 'react';
import RegisterDrawer from './RegisterDrawer';
import ProductCarousel from './ProductCarousel';

export default function LandingPage() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f8fafc', 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* Hero Section */}
      <Box 
        sx={{ 
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          px: 3,
          py: 8,
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
          overflow: 'hidden',
        }}
      >
        {/* Background decorations */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.4,
          background: `
            radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 80% 80%, rgba(168, 85, 247, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 60%)
          `,
          pointerEvents: 'none',
        }} />
        
        {/* Floating shapes */}
        <Box sx={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(168, 85, 247, 0.05) 100%)',
          filter: 'blur(60px)',
          animation: 'float 8s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
            '50%': { transform: 'translateY(-20px) rotate(5deg)' },
          },
        }} />
        <Box sx={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: 250,
          height: 250,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
          filter: 'blur(50px)',
          animation: 'float2 10s ease-in-out infinite',
          '@keyframes float2': {
            '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
            '50%': { transform: 'translateY(20px) rotate(-5deg)' },
          },
        }} />

        {/* Content */}
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 900, mx: 'auto' }}>
          {/* Logo/Brand */}
          <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <Box sx={{
              width: 60,
              height: 60,
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"/>
                <path d="M9 22V12H15V22"/>
              </svg>
            </Box>
            <Typography 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                background: 'linear-gradient(135deg, #f8fafc 0%, #94a3b8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.5px',
              }}
            >
              eSociety
            </Typography>
          </Box>

          <Typography 
            variant="h1" 
            sx={{ 
              fontWeight: 800, 
              color: '#f8fafc',
              fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4rem' },
              lineHeight: 1.1,
              mb: 3,
              textShadow: '0 4px 30px rgba(0,0,0,0.3)',
            }}
          >
            Empowering Communities,
            <br />
            <Box 
              component="span" 
              sx={{ 
                background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Simplifying Management
            </Box>
          </Typography>

          <Typography 
            variant="h6" 
            sx={{ 
              color: '#94a3b8', 
              maxWidth: 600, 
              mx: 'auto', 
              mb: 5,
              fontWeight: 400,
              lineHeight: 1.8,
              fontSize: { xs: '1rem', sm: '1.15rem' },
            }}
          >
            Your all-in-one platform for society management, resident engagement, 
            and seamless communication. Discover tools designed to make your community thrive.
          </Typography>

          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => signIn("keycloak")}
              sx={{
                px: 5,
                py: 1.8,
                borderRadius: '14px',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
                border: 'none',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 12px 40px rgba(99, 102, 241, 0.5)',
                }
              }}
            >
              Sign In to Dashboard
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => setDrawerOpen(true)}
              sx={{
                px: 5,
                py: 1.8,
                borderRadius: '14px',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                color: '#f8fafc',
                borderColor: 'rgba(248, 250, 252, 0.3)',
                borderWidth: 2,
                transition: 'all 0.3s ease',
                '&:hover': { 
                  borderColor: '#6366f1',
                  bgcolor: 'rgba(99, 102, 241, 0.1)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Register Your Society
            </Button>
          </Box>

          {/* Stats */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: { xs: 4, sm: 8 }, 
            mt: 8,
            flexWrap: 'wrap',
          }}>
            {[
              { value: '500+', label: 'Societies' },
              { value: '50K+', label: 'Residents' },
              { value: '99.9%', label: 'Uptime' },
            ].map((stat, idx) => (
              <Box key={idx} sx={{ textAlign: 'center' }}>
                <Typography sx={{ 
                  fontSize: { xs: '2rem', sm: '2.5rem' }, 
                  fontWeight: 700, 
                  color: '#f8fafc',
                  lineHeight: 1,
                }}>
                  {stat.value}
                </Typography>
                <Typography sx={{ color: '#64748b', fontSize: '0.9rem', mt: 0.5 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Scroll indicator */}
        <Box sx={{ 
          position: 'absolute', 
          bottom: 40, 
          left: '50%', 
          transform: 'translateX(-50%)',
          animation: 'bounce 2s infinite',
          '@keyframes bounce': {
            '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
            '50%': { transform: 'translateX(-50%) translateY(10px)' },
          },
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </Box>
      </Box>

      {/* Products Carousel Section */}
      <Box sx={{ 
        py: 10, 
        px: 2,
        background: 'linear-gradient(180deg, #f8fafc 0%, #fff 100%)',
      }}>
        <ProductCarousel />
      </Box>

      {/* About Section */}
      <Box sx={{ 
        py: 10, 
        px: 3,
        background: 'linear-gradient(180deg, #fff 0%, #f1f5f9 100%)',
      }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="overline" 
              sx={{ color: '#6366f1', fontWeight: 600, letterSpacing: 2, fontSize: '0.85rem' }}
            >
              WHY CHOOSE US
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ fontWeight: 700, color: '#1e293b', mt: 1, fontSize: { xs: '1.75rem', sm: '2.25rem' } }}
            >
              Built for Modern Communities
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, 
            gap: 4,
          }}>
            {[
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                ),
                title: 'Secure & Reliable',
                description: 'Bank-grade security with 99.9% uptime. Your data is encrypted and protected at all times.',
                gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                ),
                title: 'Save Time',
                description: 'Automate repetitive tasks. Spend less time on paperwork and more on what matters.',
                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                ),
                title: 'Community First',
                description: 'Designed with residents in mind. Easy to use for everyone, from tech-savvy to beginners.',
                gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              },
            ].map((item, idx) => (
              <Box 
                key={idx}
                sx={{
                  p: 4,
                  borderRadius: '20px',
                  bgcolor: '#fff',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                  border: '1px solid rgba(0, 0, 0, 0.04)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.12)',
                  },
                }}
              >
                <Box sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '16px',
                  background: item.gradient,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  mb: 3,
                  boxShadow: '0 8px 24px rgba(99, 102, 241, 0.2)',
                }}>
                  {item.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 1.5 }}>
                  {item.title}
                </Typography>
                <Typography sx={{ color: '#64748b', lineHeight: 1.7 }}>
                  {item.description}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* CTA Section */}
      <Box sx={{ 
        py: 10, 
        px: 3,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(ellipse at 30% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)
          `,
          pointerEvents: 'none',
        }} />
        
        <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              color: '#f8fafc', 
              mb: 3,
              fontSize: { xs: '1.75rem', sm: '2.5rem' },
            }}
          >
            Ready to Transform Your Society?
          </Typography>
          <Typography sx={{ color: '#94a3b8', mb: 5, fontSize: '1.1rem', lineHeight: 1.8 }}>
            Join hundreds of societies already using eSociety to streamline operations 
            and build stronger communities. Get started today!
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => setDrawerOpen(true)}
              sx={{
                px: 5,
                py: 1.8,
                borderRadius: '14px',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                boxShadow: '0 8px 32px rgba(99, 102, 241, 0.4)',
                '&:hover': { 
                  background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                  transform: 'translateY(-2px)',
                }
              }}
            >
              Start Free Trial
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                px: 5,
                py: 1.8,
                borderRadius: '14px',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                color: '#f8fafc',
                borderColor: 'rgba(248, 250, 252, 0.3)',
                borderWidth: 2,
                '&:hover': { 
                  borderColor: '#6366f1',
                  bgcolor: 'rgba(99, 102, 241, 0.1)',
                }
              }}
            >
              Contact Sales
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Contact Section */}
      <Box sx={{ 
        py: 10, 
        px: 3,
        background: '#fff',
      }}>
        <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, 
            gap: 4,
          }}>
            {/* Company Info */}
            <Box sx={{ gridColumn: { xs: '1', md: 'span 1' } }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
                <Box sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"/>
                    <path d="M9 22V12H15V22"/>
                  </svg>
                </Box>
                <Typography sx={{ fontWeight: 700, color: '#1e293b', fontSize: '1.25rem' }}>
                  eSociety
                </Typography>
              </Box>
              <Typography sx={{ color: '#64748b', lineHeight: 1.8, fontSize: '0.9rem' }}>
                Empowering communities with modern management tools since 2020.
              </Typography>
            </Box>

            {/* Quick Links */}
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>Product</Typography>
              {['Features', 'Pricing', 'Integrations', 'Updates'].map((link) => (
                <Typography 
                  key={link}
                  component="a"
                  href="#"
                  sx={{ 
                    display: 'block', 
                    color: '#64748b', 
                    textDecoration: 'none', 
                    mb: 1,
                    fontSize: '0.9rem',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#6366f1' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Box>

            {/* Company */}
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>Company</Typography>
              {['About Us', 'Careers', 'Blog', 'Press'].map((link) => (
                <Typography 
                  key={link}
                  component="a"
                  href="#"
                  sx={{ 
                    display: 'block', 
                    color: '#64748b', 
                    textDecoration: 'none', 
                    mb: 1,
                    fontSize: '0.9rem',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#6366f1' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Box>

            {/* Contact */}
            <Box>
              <Typography sx={{ fontWeight: 700, color: '#1e293b', mb: 2 }}>Contact</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <Typography 
                  component="a" 
                  href="mailto:support@esociety.com"
                  sx={{ color: '#64748b', textDecoration: 'none', fontSize: '0.9rem', '&:hover': { color: '#6366f1' } }}
                >
                  support@esociety.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <Typography sx={{ color: '#64748b', fontSize: '0.9rem' }}>
                  +1-800-ESOCIETY
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Bottom bar */}
          <Box sx={{ 
            mt: 8, 
            pt: 4, 
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}>
            <Typography sx={{ color: '#94a3b8', fontSize: '0.85rem' }}>
              © {new Date().getFullYear()} eSociety. All rights reserved.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3 }}>
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                <Typography 
                  key={link}
                  component="a"
                  href="#"
                  sx={{ 
                    color: '#94a3b8', 
                    textDecoration: 'none', 
                    fontSize: '0.85rem',
                    '&:hover': { color: '#6366f1' },
                  }}
                >
                  {link}
                </Typography>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>

      <RegisterDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </Box>
  );
}
