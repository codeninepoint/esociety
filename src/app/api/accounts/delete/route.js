import { NextResponse } from 'next/server';

const getCoreBase = () => process.env.CORE_SERVICE_URL || process.env.NEXT_PUBLIC_CORE_SERVICE_URL || 'http://localhost:8081';

export async function DELETE(request) {
  try {
    const body = await request.json().catch(() => ({}));
    console.log('[Accounts Delete API] DELETE request received, payload:', JSON.stringify(body, null, 2));
    
    const id = body.id || body.account_id || body.accountId || null;

    if (!id) {
      console.error('[Accounts Delete API] No account ID provided');
      return NextResponse.json({ error: 'no account id provided' }, { status: 400 });
    }

    const base = getCoreBase().replace(/\/+$/, '');
    const deleteUrl = `${base}/api/accounts/${encodeURIComponent(id)}`;

    console.log('[Accounts Delete API] DELETE request to Core API:', deleteUrl);

    try {
      const res = await fetch(deleteUrl, { 
        method: 'DELETE', 
        headers: { accept: '*/*' } 
      });
      
      console.log('[Accounts Delete API] Core DELETE response - status:', res.status, 'ok:', res.ok);
      
      const text = await res.text();
      const contentType = res.headers.get('content-type') || '';
      
      let payload = null;
      if (text && text.trim()) {
        if (contentType.includes('application/json')) {
          try {
            payload = JSON.parse(text);
          } catch (parseErr) {
            payload = text;
          }
        } else {
          payload = text;
        }
      } else {
        payload = { success: true, message: 'Account deleted' };
      }
      
      console.log('[Accounts Delete API] Core DELETE response body:', JSON.stringify(payload, null, 2));
      
      if (!res.ok) {
        console.error('[Accounts Delete API] Core DELETE failed with status:', res.status);
        return NextResponse.json({ 
          error: 'Core service returned non-OK status', 
          coreStatus: res.status,
          body: payload 
        }, { status: res.status });
      }

      console.log('[Accounts Delete API] Core DELETE successful');
      return NextResponse.json(payload || { success: true }, { status: 200 });
    } catch (err) {
      console.error('[Accounts Delete API] Error deleting account from Core service:', err);
      return NextResponse.json({
        error: 'Failed to delete account from Core service',
        message: String(err?.message || err),
      }, { status: 502 });
    }
  } catch (e) {
    console.error('[Accounts Delete API] Unexpected error:', e);
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

// Also support POST method for clients that can't send DELETE
export async function POST(request) {
  return DELETE(request);
}

