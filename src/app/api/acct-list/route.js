import fs from 'fs';
import path from 'path';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'acct-list.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(FILE)) fs.writeFileSync(FILE, JSON.stringify([
    { acct_code: 'CASH001', name: 'Cash' },
    { acct_code: 'BANK001', name: 'Bank' },
    { acct_code: 'EXP100', name: 'Expenses' },
    { acct_code: 'REV200', name: 'Revenue' },
    { acct_code: 'MEM001', name: 'Members' }
  ], null, 2));
}

export async function GET() {
  try {
    ensureDataDir();
    const content = fs.readFileSync(FILE, 'utf-8');
    const json = JSON.parse(content);
    return new Response(JSON.stringify(json), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
}

export async function POST(request) {
  try {
    ensureDataDir();
    const body = await request.json();
    if (!Array.isArray(body)) return new Response(JSON.stringify({ error: 'expected array' }), { status: 400 });
    // expect array of objects
    fs.writeFileSync(FILE, JSON.stringify(body, null, 2));
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
    if (!code) return new Response(JSON.stringify({ error: 'no code provided' }), { status: 400 });
    const content = fs.readFileSync(FILE, 'utf-8');
    const arr = JSON.parse(content).filter(c => c.acct_code !== code);
    fs.writeFileSync(FILE, JSON.stringify(arr, null, 2));
    return new Response(JSON.stringify(arr), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
}
