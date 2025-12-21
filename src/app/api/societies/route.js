import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'societies.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify([
    { society_code: 'SOCI001', name: 'Default Society' }
  ], null, 2));
}

export async function GET(request) {
  try {
    const urlObj = new URL(request.url);
    const code = urlObj.searchParams.get('code');
    const orgId = urlObj.searchParams.get('organizationId');

    // If a code is provided, fetch the societies list from the internal BFF (which proxies Core),
    // then return the matching society object. This ensures we return the canonical object from Core.
    if (code) {
      const listUrl = new URL(`/api/societies/list${orgId ? `?organizationId=${encodeURIComponent(orgId)}` : ''}`, request.url).toString();
      try {
        const res = await fetch(listUrl, { headers: { accept: '*/*' } });
        if (!res.ok) {
          const body = await res.json().catch(() => ({ error: `Upstream returned ${res.status}` }));
          return new Response(JSON.stringify(body), { status: res.status });
        }

        const data = await res.json();
        const societies = Array.isArray(data) ? data : (data && Array.isArray(data.societies) ? data.societies : []);
        const found = societies.find(s => (s.society_code || s.code || s.id) === code || (s.name || s.society_name) === code);
        if (!found) return new Response(JSON.stringify({ error: 'not found' }), { status: 404 });
        return new Response(JSON.stringify(found), { status: 200 });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Failed to fetch upstream list', message: String(err?.message || err) }), { status: 502 });
      }
    }

    // No code => return local file list (legacy behavior)
    ensureDataDir();
    const content = fs.readFileSync(FILE, 'utf-8');
    const json = JSON.parse(content);
    return new Response(JSON.stringify(json), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
}

// POST upserts a society object by society_code
export async function POST(request) {
  try {
    ensureDataDir();
    const body = await request.json();
    if (!body || typeof body !== 'object') return new Response(JSON.stringify({ error: 'expected object' }), { status: 400 });
    const code = body.society_code;
    if (!code) return new Response(JSON.stringify({ error: 'society_code required' }), { status: 400 });
    const content = fs.readFileSync(FILE, 'utf-8');
    const arr = Array.isArray(JSON.parse(content)) ? JSON.parse(content) : [];
    const idx = arr.findIndex(s => (s.society_code || '').toString() === code.toString());
    if (idx >= 0) {
      arr[idx] = { ...arr[idx], ...body };
    } else {
      arr.push(body);
    }
    fs.writeFileSync(FILE, JSON.stringify(arr, null, 2));
    return new Response(JSON.stringify(body), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    ensureDataDir();
    const body = await request.json();
    const code = body && body.code;
    if (!code) return new Response(JSON.stringify({ error: 'no society_code provided' }), { status: 400 });
    const content = fs.readFileSync(FILE, 'utf-8');
    const arr = (Array.isArray(JSON.parse(content)) ? JSON.parse(content) : []).filter(s => s.society_code !== code);
    fs.writeFileSync(FILE, JSON.stringify(arr, null, 2));
    return new Response(JSON.stringify(arr), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
}
