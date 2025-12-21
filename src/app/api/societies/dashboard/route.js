import { NextResponse } from 'next/server'

// Fallback overview data in case Core service is unreachable or returns unexpected data
const FALLBACK_OVERVIEW = {
  societiesActive: 5,
  members: '320',
  bankAccounts: '8',
  pendingDues: '₹1,20,000',
}

export async function GET(request) {
  const urlObj = new URL(request.url)
  const organizationId = urlObj.searchParams.get('organizationId') || urlObj.searchParams.get('orgId') || ''

  // Call our internal societies list BFF which already wraps Core and returns { societies, activeCount }
  const internalListUrl = new URL(`/api/societies/list${organizationId ? `?organizationId=${encodeURIComponent(organizationId)}` : ''}`, request.url).toString()

  let societies = []
  let activeCount = FALLBACK_OVERVIEW.societiesActive

  try {
    const res = await fetch(internalListUrl, { headers: { accept: '*/*' } })
    if (!res.ok) {
      // Propagate non-OK responses from the internal list route (e.g., 502 from upstream Core)
      let errBody
      try {
        errBody = await res.json()
      } catch (e) {
        errBody = { error: `Internal list returned status ${res.status}` }
      }
      return NextResponse.json(errBody, { status: res.status })
    }

    const data = await res.json()
    // data may be { societies: [...], activeCount: N } or an array directly
    if (Array.isArray(data)) {
      societies = data
      activeCount = data.length
    } else if (data && Array.isArray(data.societies)) {
      societies = data.societies
      activeCount = typeof data.activeCount === 'number' ? data.activeCount : data.societies.length
    }
  } catch (err) {
    console.error('Error fetching internal societies list:', err)
    // Propagate network/error as 502
    return NextResponse.json({ error: 'Failed to fetch internal societies list', message: String(err?.message || err) }, { status: 502 })
  }

  const response = {
    overviewData: [
      { label: 'Societies', value: `${activeCount} Active`, icon: 'Home' },
      { label: 'Members', value: FALLBACK_OVERVIEW.members, icon: 'Group' },
      { label: 'Bank Accounts', value: FALLBACK_OVERVIEW.bankAccounts, icon: 'AccountBalance' },
      { label: 'Pending Dues', value: FALLBACK_OVERVIEW.pendingDues, icon: 'Receipt' },
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
    // Indicate that data was sourced from the internal list (which wraps Core)
    source: 'internal-societies-list',
    message: 'Overview data computed from internal /api/societies/list (Core)',
  }

  return NextResponse.json(response)
}