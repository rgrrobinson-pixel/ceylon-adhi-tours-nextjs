/* ============================================================
   /api/lead  —  Lead handoff to the Solo Launch agent team (n8n)

   When Sofia captures a real enquiry (name / contact / trip
   details), the frontend POSTs it here. We forward it to Roger's
   n8n webhook, where the agents take over (follow-up, logging,
   notifications, etc.).

   Degrades gracefully: if no webhook is configured, we accept the
   lead and return { forwarded:false } so the visitor experience is
   never blocked — WhatsApp remains the always-available path.

   Env vars (set in Vercel project settings):
     N8N_WEBHOOK_URL  — production webhook URL from the n8n flow
     N8N_WEBHOOK_AUTH — optional bearer token / shared secret
   ============================================================ */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 12;
const rateLimit = new Map<string, { count: number; resetAt: number }>();

function allowedOrigin(req: Request) {
  const origin = req.headers.get('origin');
  if (!origin) return '';

  const allowed = [
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '',
  ].filter((url): url is string => Boolean(url));

  try {
    const host = new URL(origin).hostname;
    if (
      host === 'localhost' ||
      host === '127.0.0.1' ||
      host === 'ceylonadhitours.com' ||
      host === 'www.ceylonadhitours.com' ||
      allowed.some((url) => new URL(url).origin === origin)
    ) {
      return origin;
    }
  } catch {
    return '';
  }

  return '';
}

function corsHeaders(req: Request) {
  const origin = allowedOrigin(req);
  return {
    ...(origin ? { 'Access-Control-Allow-Origin': origin } : {}),
    Vary: 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function rateLimitKey(req: Request) {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    req.headers.get('x-real-ip') ||
    'anonymous'
  );
}

function isRateLimited(req: Request) {
  const now = Date.now();
  const key = rateLimitKey(req);
  const current = rateLimit.get(key);
  if (!current || current.resetAt <= now) {
    rateLimit.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > RATE_LIMIT_MAX;
}

export async function OPTIONS(req: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(req) });
}

type TranscriptTurn = { role?: string; text?: string };

export async function POST(req: Request) {
  const headers = corsHeaders(req);
  if (req.headers.get('origin') && !allowedOrigin(req)) {
    return Response.json({ error: 'Origin not allowed' }, { status: 403, headers });
  }
  if (isRateLimited(req)) {
    return Response.json({ error: 'Too many requests' }, { status: 429, headers });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }
  body = body || {};

  const str = (v: unknown) => (v == null ? '' : String(v));

  // Normalise a clean lead payload for the agent team.
  const lead = {
    source: 'ceylonadhitours.com',
    via: 'Sofia (Adhi\u2019s Assistant)',
    captured_at: new Date().toISOString(),
    name: str(body.name).slice(0, 120),
    contact: str(body.contact).slice(0, 200),
    message: str(body.message).slice(0, 2000),
    trip: {
      dates: str(body.dates).slice(0, 200),
      group_size: str(body.group_size).slice(0, 80),
      interests: str(body.interests).slice(0, 500),
    },
    transcript: Array.isArray(body.transcript)
      ? (body.transcript as TranscriptTurn[]).slice(-20).map((t) => ({
          role: t && t.role === 'user' ? 'user' : 'assistant',
          text: (t && t.text ? String(t.text) : '').slice(0, 1000),
        }))
      : [],
  };

  const WEBHOOK = process.env.N8N_WEBHOOK_URL;
  if (!WEBHOOK) {
    // Not wired yet — accept gracefully so the UI keeps flowing.
    console.log('Lead captured (no n8n webhook configured):', JSON.stringify(lead));
    return Response.json({ ok: true, forwarded: false }, { headers });
  }

  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (process.env.N8N_WEBHOOK_AUTH) {
      headers['Authorization'] = 'Bearer ' + process.env.N8N_WEBHOOK_AUTH;
    }
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    const r = await fetch(WEBHOOK, {
      method: 'POST',
      headers,
      body: JSON.stringify(lead),
      signal: ctrl.signal,
    });
    clearTimeout(timer);

    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      console.error('n8n webhook error', r.status, detail.slice(0, 300));
      return Response.json({ ok: true, forwarded: false }, { headers });
    }
    return Response.json({ ok: true, forwarded: true }, { headers });
  } catch (e) {
    console.error('Lead handoff exception', e instanceof Error ? e.message : e);
    return Response.json({ ok: true, forwarded: false }, { headers });
  }
}
