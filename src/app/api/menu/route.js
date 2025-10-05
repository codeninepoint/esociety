export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const module = searchParams.get('module');

  // Example menu data for different modules
  const menuConfig = {
    Societies: [
      { label: 'Dashboard', href: '/societies/dashboard' },
      {
        label: 'Societies',
        href: '/societies',
        children: [
          { label: 'Add Society', href: '/societies/add' }
        ]
      },
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

  const items = menuConfig[module] || [
    { label: 'Dashboard', href: '/dashboard' },
  ];

  return Response.json({ items });
}