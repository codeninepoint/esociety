"use client";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const items = [
  {
    title: "Society Billing & Accounting",
    description: "Automate billing, manage accounts, and track payments with ease. Generate invoices, manage dues, and keep financial records organized.",
    image: "/carousel/accounting.jpg",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
        <path d="M6 8h.01M6 12h.01M6 16h.01"/>
        <path d="M10 8h8M10 12h8"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
  },
  {
    title: "Event & Facility Booking",
    description: "Book community halls, sports facilities, and common areas. Manage reservations and avoid scheduling conflicts effortlessly.",
    image: "/carousel/booking.jpg",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
        <line x1="16" y1="2" x2="16" y2="6"/>
        <line x1="8" y1="2" x2="8" y2="6"/>
        <line x1="3" y1="10" x2="21" y2="10"/>
        <path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
  },
  {
    title: "Resident Portal & Mobile App",
    description: "Empower residents with a dedicated portal and mobile app. Access services, pay bills, and stay connected on the go.",
    image: "/carousel/portal.jpg",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
        <line x1="12" y1="18" x2="12.01" y2="18"/>
        <path d="M9 6h6M9 10h6M9 14h4"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)"
  },
  {
    title: "Visitor & Security Management",
    description: "Track visitors, manage gate passes, and enhance security with digital entry logs and real-time notifications.",
    image: "/carousel/security.jpg",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="M9 12l2 2 4-4"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)"
  },
  {
    title: "Communication & Announcements",
    description: "Send announcements, notices, and updates instantly. Keep all residents informed with multi-channel communication.",
    image: "/carousel/announcements.jpg",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        <path d="M8 9h8M8 13h6"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)"
  },
  {
    title: "Document Storage & Sharing",
    description: "Store and share important documents securely. Access bylaws, meeting minutes, and legal documents anytime.",
    image: "/carousel/documents.jpg",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>
    ),
    gradient: "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)"
  }
];

export default function ProductCarousel() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 600,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: '20px',
        },
      },
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };

  return (
    <Box 
      sx={{ 
        py: 8, 
        px: 2, 
        maxWidth: 1200, 
        mx: 'auto',
        '& .slick-dots': {
          bottom: '-40px',
          '& li button:before': {
            fontSize: '12px',
            color: '#6366f1',
            opacity: 0.3,
          },
          '& li.slick-active button:before': {
            opacity: 1,
            color: '#6366f1',
          },
        },
        '& .slick-prev, & .slick-next': {
          width: '44px',
          height: '44px',
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          borderRadius: '50%',
          zIndex: 10,
          boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
          transition: 'all 0.2s ease',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            transform: 'scale(1.1)',
          },
          '&:before': {
            fontSize: '20px',
            opacity: 1,
          },
        },
        '& .slick-prev': {
          left: '-10px',
        },
        '& .slick-next': {
          right: '-10px',
        },
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography 
          variant="overline" 
          sx={{ 
            color: '#6366f1', 
            fontWeight: 600, 
            letterSpacing: 2,
            fontSize: '0.85rem',
          }}
        >
          FEATURES
        </Typography>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700, 
            color: '#1e293b',
            mt: 1,
            mb: 2,
            fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
          }}
        >
          Our Products & Services
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#64748b', 
            maxWidth: 600, 
            mx: 'auto',
            fontSize: '1.1rem',
            lineHeight: 1.7,
          }}
        >
          Complete society management solution designed to simplify operations and enhance community living
        </Typography>
      </Box>

      <Slider {...settings}>
        {items.map((item, idx) => (
          <Box key={idx} sx={{ px: 1.5, pb: 2 }}>
            <Box
              sx={{
                height: 380,
                p: 0,
                display: 'flex',
                flexDirection: 'column',
                bgcolor: '#fff',
                borderRadius: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15)',
                  '& .card-icon-wrapper': {
                    transform: 'scale(1.1)',
                  },
                  '& .card-image': {
                    transform: 'scale(1.05)',
                  },
                },
              }}
            >
              {/* Image Section */}
              <Box 
                sx={{ 
                  position: 'relative',
                  height: 160,
                  background: item.gradient,
                  overflow: 'hidden',
                }}
              >
                <Box
                  className="card-image"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    opacity: 0.15,
                    transition: 'transform 0.4s ease',
                  }}
                >
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill
                    style={{ objectFit: 'cover' }} 
                  />
                </Box>
                {/* Icon */}
                <Box
                  className="card-icon-wrapper"
                  sx={{
                    position: 'absolute',
                    bottom: -30,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 70,
                    height: 70,
                    bgcolor: '#fff',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
                    color: '#6366f1',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {item.icon}
                </Box>
              </Box>

              {/* Content Section */}
              <Box sx={{ p: 3, pt: 5, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#1e293b',
                    mb: 1.5,
                    fontSize: '1.1rem',
                  }}
                >
                  {item.title}
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#64748b',
                    lineHeight: 1.7,
                    fontSize: '0.9rem',
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
