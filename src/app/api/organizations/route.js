import { NextResponse } from 'next/server'

// Example fallback data for `const organizations`
const organizations = [
  {
    id: '73749298-70cc-4a9a-b0e2-067f5e2a0d6f',
    name: 'Default Organization',
    createdOn: '2025-11-22T20:13:43.26504',
    updatedOn: null,
    createdBy: 'system',
    updatedBy: null,
  },
]

const getCoreBase = () => {
  return (
    process.env.CORE_SERVICE_URL || process.env.NEXT_PUBLIC_CORE_SERVICE_URL || 'http://localhost:8081'
  )
}

export async function GET() {
  const base = getCoreBase()
  const url = `${base.replace(/\/+$/, '')}/api/organizations`

  try {
    const res = await fetch(url, { headers: { accept: '*/*' } })

    if (!res.ok) {
      console.warn(`Core responded with status ${res.status}. Returning fallback organizations.`)
      return NextResponse.json(organizations, { status: 200 })
    }

    const data = await res.json()
    // If the service returned an empty body or invalid structure, return fallback
    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json(organizations, { status: 200 })
    }

    return NextResponse.json(data, { status: 200 })
  } catch (err) {
    console.error('Error fetching organizations from Core service:', err)
    return NextResponse.json(organizations, { status: 200 })
  }
}
