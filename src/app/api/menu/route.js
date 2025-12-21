export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const moduleName = searchParams.get('module');

  // Example menu data for different modules
  const menuConfig = {
    Societies: [
      { label: 'Dashboard', href: '/societies/dashboard' },
      { label: 'Master Files', href: '/societies/main',
        children: [
          { label: 'Society', href: '/societies/society' },
          { label: 'Accounts / Vendor', href: '/societies/accounts' }
        ]
      },
      { label: 'Society', href: '/societies/society' },
      {
        label: 'Societies',
        href: '/societies',
        children: [
          { label: 'Society', href: '/societies/add' },
          { label: 'Societies', href: '/societies/society' },
          { label: 'Accounts / Vendor', href: '/societies/accounts' }
          
        ]
      },
      { label: 'Accounts / Vendor', href: '/societies/accounts' },
      { label: 'Reports', href: '/societies/reports' },
    ],
    Accounts: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Accounts', href: '/accounts' },
      { label: 'Payments', href: '/accounts/payments' },
      { label: 'Reports', href: '/accounts/reports' },
    ],
    // Add more modules as needed
  };

  const items = menuConfig[moduleName] || [
    { label: 'Dashboard', href: '/dashboard' },
  ];

  return Response.json({ items });
}