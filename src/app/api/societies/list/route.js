import { NextResponse } from 'next/server'

const getCoreBase = () => process.env.CORE_SERVICE_URL || process.env.NEXT_PUBLIC_CORE_SERVICE_URL || 'http://localhost:8081'

export async function GET(request) {
  const url = new URL(request.url)
  const organizationId = url.searchParams.get('organizationId') || ''

  const base = getCoreBase().replace(/\/+$/, '')
  const societiesUrl = organizationId ? `${base}/api/societies?organizationId=${encodeURIComponent(organizationId)}` : `${base}/api/societies`

  try {
    const res = await fetch(societiesUrl, { headers: { accept: '*/*' } })
    if (!res.ok) {
      console.warn('Core /api/societies returned', res.status)
      return NextResponse.json({
        error: 'Core service returned non-OK status',
        coreStatus: res.status,
      }, { status: 502 })
    }

    const data = await res.json()

    // Expecting an array of societies
    const societies = Array.isArray(data) ? data : []

    // Compute active count. If items have `is_active` or `status`, use them; otherwise treat all returned as active.
    let activeCount = 0
    if (societies.length > 0) {
      // Check for common active flags
      if (societies.some(s => Object.prototype.hasOwnProperty.call(s, 'is_active') || Object.prototype.hasOwnProperty.call(s, 'status'))) {
        activeCount = societies.filter(s => s.is_active === true || (typeof s.status === 'string' && /active/i.test(s.status))).length
      } else {
        activeCount = societies.length
      }
    }

    return NextResponse.json({ societies, activeCount })
  } catch (err) {
    console.error('Error fetching societies from Core service', err)
    return NextResponse.json({
      error: 'Failed to fetch societies from Core service',
      message: String(err?.message || err),
    }, { status: 502 })
  }
}