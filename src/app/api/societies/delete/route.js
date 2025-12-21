const CORE = process.env.CORE_SERVICE_URL || process.env.NEXT_PUBLIC_CORE_SERVICE_URL || 'http://localhost:8081';

export async function DELETE(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const id = body.id || body.society_id || body.societyId || null;
    const code = body.code || body.society_code || body.societyCode || null;
    const orgId = body.organization_id || body.organizationId || null;

    let targetId = id;
    if (!targetId && code) {
      // resolve code -> full society object via internal BFF
      try {
        const q = orgId ? `&organizationId=${encodeURIComponent(orgId)}` : '';
        const url = new URL(`/api/societies?code=${encodeURIComponent(code)}${q}`, request.url).toString();
        const res = await fetch(url, { headers: { accept: '*/*' } });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: `upstream returned ${res.status}` }));
          return new Response(JSON.stringify(err), { status: res.status });
        }
        const obj = await res.json().catch(() => null);
        if (obj && (obj.id || obj._id)) targetId = obj.id || obj._id;
        else return new Response(JSON.stringify({ error: 'society not found for code' }), { status: 404 });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to resolve society code', message: String(err?.message || err) }), { status: 502 });
      }
    }

    if (!targetId) return new Response(JSON.stringify({ error: 'no society id or code provided' }), { status: 400 });

    const url = `${CORE.replace(/\/$/, '')}/api/societies/${encodeURIComponent(targetId)}${orgId ? `?organizationId=${encodeURIComponent(orgId)}` : ''}`;

    try {
      console.log('societies/delete: DELETE ->', url);
      const res = await fetch(url, { method: 'DELETE', headers: { accept: '*/*' } });
      const text = await res.text();
      const contentType = res.headers.get('content-type') || '';
      const payload = contentType.includes('application/json') ? JSON.parse(text || 'null') : text;
      console.log('societies/delete: Core response', res.status, payload);
      if (!res.ok) {
        return new Response(JSON.stringify({ error: 'upstream error', status: res.status, body: payload }), { status: res.status });
      }
      return new Response(JSON.stringify(payload), { status: 200 });
    } catch (err) {
      console.error('societies/delete: network error', String(err));
      return new Response(JSON.stringify({ error: 'Failed to contact Core service', message: String(err?.message || err) }), { status: 502 });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
}
