import { NextResponse } from 'next/server';

const getCoreBase = () => process.env.CORE_SERVICE_URL || process.env.NEXT_PUBLIC_CORE_SERVICE_URL || 'http://localhost:8081';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const accountType = url.searchParams.get('accountType');
    const societyId = url.searchParams.get('societyId');

    if (!accountType || !societyId) {
      return NextResponse.json({
        error: 'accountType and societyId query parameters are required',
      }, { status: 400 });
    }

    const base = getCoreBase().replace(/\/+$/, '');
    const accountsUrl = `${base}/api/accounts?accountType=${encodeURIComponent(accountType)}&societyId=${encodeURIComponent(societyId)}`;

    // Log the request being sent to Core
    console.log('[Accounts API] GET request to Core:', accountsUrl);
    console.log('[Accounts API] Query params - accountType:', accountType, 'societyId:', societyId);

    try {
      const res = await fetch(accountsUrl, { headers: { accept: '*/*' } });
      if (!res.ok) {
        console.warn('Core /api/accounts returned', res.status);
        return NextResponse.json({
          error: 'Core service returned non-OK status',
          coreStatus: res.status,
        }, { status: 502 });
      }

      const data = await res.json();
      // Expecting an array of accounts
      const accounts = Array.isArray(data) ? data : [];
      console.log('[Accounts API] Core GET response - received', accounts.length, 'accounts');
      return NextResponse.json(accounts, { status: 200 });
    } catch (err) {
      console.error('Error fetching accounts from Core service', err);
      return NextResponse.json({
        error: 'Failed to fetch accounts from Core service',
        message: String(err?.message || err),
      }, { status: 502 });
    }
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'expected JSON object' }, { status: 400 });
    }

    const base = getCoreBase().replace(/\/+$/, '');
    const accountsUrl = `${base}/api/accounts`;

    // Log the payload being sent to Core
    console.log('[Accounts API] Payload being sent to Core:', JSON.stringify(body, null, 2));
    console.log('[Accounts API] Core URL:', accountsUrl);

    try {
      const res = await fetch(accountsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.warn('[Accounts API] Core /api/accounts POST returned', res.status);
        const errorBody = await res.json().catch(() => ({ error: `Core service returned ${res.status}` }));
        console.log('[Accounts API] Core error response:', JSON.stringify(errorBody, null, 2));
        return NextResponse.json(errorBody, { status: res.status });
      }

      const data = await res.json();
      console.log('[Accounts API] Core response:', JSON.stringify(data, null, 2));
      return NextResponse.json(data, { status: 200 });
    } catch (err) {
      console.error('Error posting account to Core service', err);
      return NextResponse.json({
        error: 'Failed to post account to Core service',
        message: String(err?.message || err),
      }, { status: 502 });
    }
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') {
      return NextResponse.json({ error: 'expected JSON object' }, { status: 400 });
    }

    const id = body.id || body.account_id || body.accountId || null;
    if (!id) {
      return NextResponse.json({ error: 'id is required for update' }, { status: 400 });
    }

    const base = getCoreBase().replace(/\/+$/, '');
    // Call Core API: PUT /api/accounts/{id}
    const putUrl = `${base}/api/accounts/${encodeURIComponent(id)}`;

    // Log the payload being sent to Core
    console.log('[Accounts API] PUT request to Core:', putUrl);
    console.log('[Accounts API] Payload being sent to Core:', JSON.stringify(body, null, 2));

    try {
      const res = await fetch(putUrl, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', accept: '*/*' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        console.warn('[Accounts API] Core /api/accounts PUT returned', res.status);
        const errorBody = await res.json().catch(() => ({ error: `Core service returned ${res.status}` }));
        console.log('[Accounts API] Core error response:', JSON.stringify(errorBody, null, 2));
        return NextResponse.json(errorBody, { status: res.status });
      }

      const data = await res.json();
      console.log('[Accounts API] Core PUT response:', JSON.stringify(data, null, 2));
      return NextResponse.json(data, { status: 200 });
    } catch (err) {
      console.error('[Accounts API] Error updating account in Core service', err);
      return NextResponse.json({
        error: 'Failed to update account in Core service',
        message: String(err?.message || err),
      }, { status: 502 });
    }
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    const body = await request.json().catch(() => ({}));
    console.log('[Accounts API] DELETE request received, payload:', JSON.stringify(body, null, 2));
    
    const id = body.id || body.account_id || body.accountId || null;
    const code = body.code || body.acct_code || body.acctCode || null;
    const accountType = body.account_type || body.accountType || null;
    const societyId = body.society_id || body.societyId || null;

    console.log('[Accounts API] DELETE - Extracted values:', { id, code, accountType, societyId });

    let targetId = id;
    
    // If no id provided but code is provided, resolve code to id
    if (!targetId && code && accountType && societyId) {
      console.log('[Accounts API] No ID provided, resolving code to ID:', { code, accountType, societyId });
      try {
        const base = getCoreBase().replace(/\/+$/, '');
        const accountsUrl = `${base}/api/accounts?accountType=${encodeURIComponent(accountType)}&societyId=${encodeURIComponent(societyId)}`;
        console.log('[Accounts API] Fetching accounts from Core to resolve code:', accountsUrl);
        const res = await fetch(accountsUrl, {
          method: 'GET',
          headers: { accept: '*/*' }
        });
        if (res.ok) {
          const accounts = await res.json();
          const account = Array.isArray(accounts) ? accounts.find(a => (a.acct_code || a.code) === code) : null;
          if (account && (account.id || account._id)) {
            targetId = account.id || account._id;
            console.log('[Accounts API] Resolved code to ID:', targetId);
          } else {
            console.error('[Accounts API] Account not found for code:', code);
            return NextResponse.json({ error: 'Account not found for code' }, { status: 404 });
          }
        } else {
          console.error('[Accounts API] Failed to fetch accounts from Core, status:', res.status);
          return NextResponse.json({ error: 'Failed to resolve account code' }, { status: 502 });
        }
      } catch (err) {
        console.error('[Accounts API] Error resolving account code', err);
        return NextResponse.json({ error: 'Failed to resolve account code', message: String(err?.message || err) }, { status: 502 });
      }
    }

    if (!targetId) {
      return NextResponse.json({ error: 'no account id or code provided' }, { status: 400 });
    }

    const base = getCoreBase().replace(/\/+$/, '');
    // Call Core API: DELETE /api/accounts/{id}
    const deleteUrl = `${base}/api/accounts/${encodeURIComponent(targetId)}`;

    // Log the delete request
    console.log('[Accounts API] DELETE request to Core API:', deleteUrl);
    console.log('[Accounts API] Account ID being deleted:', targetId);
    console.log('[Accounts API] Core API endpoint: DELETE /api/accounts/' + targetId);

    try {
      console.log('[Accounts API] Making DELETE request to Core API...');
      const res = await fetch(deleteUrl, { 
        method: 'DELETE', 
        headers: { accept: '*/*' } 
      });
      
      console.log('[Accounts API] Core DELETE response received - status:', res.status, 'ok:', res.ok);
      
      const text = await res.text();
      const contentType = res.headers.get('content-type') || '';
      
      let payload = null;
      if (text && text.trim()) {
        if (contentType.includes('application/json')) {
          try {
            payload = JSON.parse(text);
          } catch (parseErr) {
            console.warn('[Accounts API] Failed to parse JSON response, using text:', parseErr);
            payload = text;
          }
        } else {
          payload = text;
        }
      } else {
        // Empty response (common for 204 No Content)
        payload = { success: true, message: 'Account deleted' };
      }
      
      console.log('[Accounts API] Core DELETE response body:', JSON.stringify(payload, null, 2));
      
      if (!res.ok) {
        console.error('[Accounts API] Core DELETE failed with status:', res.status);
        return NextResponse.json({ 
          error: 'Core service returned non-OK status', 
          coreStatus: res.status,
          body: payload 
        }, { status: res.status });
      }

      // Return success response (200 or 204 are both success)
      console.log('[Accounts API] Core DELETE successful, returning response to client');
      return NextResponse.json(payload || { success: true }, { status: res.status === 204 ? 200 : res.status });
    } catch (err) {
      console.error('[Accounts API] Error deleting account from Core service:', err);
      console.error('[Accounts API] Error stack:', err.stack);
      return NextResponse.json({
        error: 'Failed to delete account from Core service',
        message: String(err?.message || err),
      }, { status: 502 });
    }
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
