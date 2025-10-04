export async function GET() {
  // Stubbed data, replace with real backend call
  return Response.json({
    societies: [
      {
        society_name: 'Green Valley Society',
        society_code: 'GVS',
        authorized_signatory: 'John Doe',
        total_members: 120,
        account_year: '2024-2025',
      },
      {
        society_name: 'Blue Lake Residency',
        society_code: 'BLR',
        authorized_signatory: 'Jane Smith',
        total_members: 80,
        account_year: '2024-2025',
      },
    ],
  });
}