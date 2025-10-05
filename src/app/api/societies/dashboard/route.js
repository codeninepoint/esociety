export async function GET() {
  return Response.json({
    overviewData: [
      { label: 'Societies', value: '5 Active', icon: 'Home' },
      { label: 'Members', value: '320', icon: 'Group' },
      { label: 'Bank Accounts', value: '8', icon: 'AccountBalance' },
      { label: 'Pending Dues', value: '₹1,20,000', icon: 'Receipt' },
    ],
    quickActions: [
      'Add Society',
      'Create Voucher',
      'Record Payment',
      'Generate Report',
    ],
    recentActivity: [
      { activity: 'Society A', status: 'Activated', time: '2 mins ago', user: 'Admin User' },
      { activity: 'Payment Received', status: '₹5,000', time: 'Flat 101', user: 'Today' },
      { activity: 'Voucher Created', status: '₹12,000', time: 'Bank', user: 'Yesterday' },
    ],
    chartData: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: 'Collections',
          data: [12, 10, 8, 14, 13, 15, 14, 13, 13, 12, 11, 15],
          backgroundColor: '#2563eb',
        },
      ],
    },
  });
}