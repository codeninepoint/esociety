const CORE = process.env.CORE_SERVICE_URL || process.env.NEXT_PUBLIC_CORE_SERVICE_URL || 'http://localhost:8081';

export async function POST(request) {
  try {
    const body = await request.json();
    if (!body || typeof body !== 'object') return new Response(JSON.stringify({ error: 'expected JSON object' }), { status: 400 });
    const orgId = body.organization_id || body.organizationId || null;
    if (!orgId) return new Response(JSON.stringify({ error: 'organization_id required in request body' }), { status: 400 });

    // Determine society id to target the update resource
    const societyId = body.id || body.society_id || body.societyId || null;
    if (!societyId) return new Response(JSON.stringify({ error: 'society id required in request body (id)' }), { status: 400 });

    // Only include allowed fields for Core API. Accept common aliases (camelCase/snake_case).
    const allowed = {
      id: body.id || body.society_id || body.societyId || null,
      society_code: body.society_code || body.societyCode || null,
      name: body.name || null,
      organization_id: orgId,
      // meta
      createdOn: body.createdOn || body.created_on || null,
      updatedOn: body.updatedOn || body.updated_on || null,
      createdBy: body.createdBy || body.created_by || null,
      updatedBy: body.updatedBy || body.updated_by || null,
      // registration / address
      reg_no: body.reg_no || body.regNo || null,
      address1: body.address1 || null,
      address2: body.address2 || null,
      // interest/billing
      interest_charged: body.interest_charged ?? body.interest_pct ?? body.interestCharged ?? null,
      billing_period: body.billing_period ?? body.billingPeriod ?? null,
      interest_method: body.interest_method ?? body.interestMethod ?? null,
      due_days: body.due_days ?? body.dueDays ?? null,
      interest_from: body.interest_from ?? body.interestFrom ?? null,
      from_bill_due: body.from_bill_due ?? body.fromBillDue ?? null,
      rebate_mode: body.rebate_mode ?? body.rebateMode ?? null,
      rebate_days: body.rebate_days ?? body.rebateDays ?? null,
      rebate_amt_pct: body.rebate_amt_pct ?? body.rebateAmtPct ?? null,
      adjust_first: body.adjust_first ?? body.adjustFirst ?? null,
      acct_period_from: body.acct_period_from ?? body.acctPeriodFrom ?? null,
      acct_period_to: body.acct_period_to ?? body.acctPeriodTo ?? null,
      acct_year: body.acct_year ?? body.acctYear ?? null,
      auth_sign: body.auth_sign ?? body.authSign ?? null,
      total_members: body.total_members ?? body.totalMembers ?? null,
      charge_late: body.charge_late ?? body.chargeLate ?? null,
      messages: body.messages ?? null
    };

    // Remove undefined/null values so we don't send empty fields
    const payloadToSend = {};
    for (const k of Object.keys(allowed)) {
      const v = allowed[k];
      if (v !== undefined && v !== null && v !== '') {
        // Coerce numeric-looking fields to numbers when appropriate
        if ((k === 'interest_charged' || k === 'billing_period') && typeof v === 'string' && v.trim() !== '') {
          const n = Number(v);
          payloadToSend[k] = Number.isNaN(n) ? v : n;
        } else {
          payloadToSend[k] = v;
        }
      }
    }

    // PUT to /api/societies/{societyId}?organizationId={orgId}
    const url = `${CORE.replace(/\/$/, '')}/api/societies/${encodeURIComponent(societyId)}${orgId ? `?organizationId=${encodeURIComponent(orgId)}` : ''}`;

    try {
      // Log what we'll send to the Core service for debugging
      try {
        console.debug && console.debug('societies/update: PUT ->', url, payloadToSend);
        console.log('societies/update: PUT ->', url, JSON.stringify(payloadToSend));
      } catch (logErr) { /* ignore logging failures */ }

      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'accept': '*/*', 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadToSend)
      });

      const text = await res.text();
      const contentType = res.headers.get('content-type') || '';
      // try to parse JSON responses, otherwise return as text
      const payload = contentType.includes('application/json') ? JSON.parse(text || 'null') : text;

      try {
        console.debug && console.debug('societies/update: Core response', res.status, payload);
        console.log('societies/update: Core response', res.status, JSON.stringify(payload));
      } catch (logErr) { /* ignore logging failures */ }

      if (!res.ok) {
        return new Response(JSON.stringify({ error: 'upstream error', status: res.status, body: payload }), { status: res.status });
      }

      return new Response(JSON.stringify(payload), { status: 200 });
    } catch (err) {
      try { console.error('societies/update: network error', String(err)); } catch (e) { /* ignore */ }
      return new Response(JSON.stringify({ error: 'Failed to contact Core service', message: String(err?.message || err) }), { status: 502 });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500 });
  }
}
