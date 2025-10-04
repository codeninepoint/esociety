export async function POST(request) {
  const data = await request.json();
  // Stubbed response
  return Response.json({
    success: true,
    message: 'Society added successfully (stubbed)',
    society: data,
  });
}