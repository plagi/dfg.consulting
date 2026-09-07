/**
 * POST /api/contact
 * Receives the homepage contact form as JSON and emails it to hello@dfg.consulting via Resend.
 *
 * Configuration (Cloudflare Pages > dfg-consulting > Settings > Variables and Secrets):
 *   RESEND_API_KEY  secret   required; without it the endpoint answers 503 and the page falls back to mailto
 *   CONTACT_TO      text     optional, default hello@dfg.consulting
 *   CONTACT_FROM    text     optional, default "DFG website <website@dfg.consulting>"
 *                            the sending domain must be verified in Resend
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function json(body, status, extra) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: Object.assign({ 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }, extra || {}),
  });
}

function text(v, max) {
  return String(v == null ? '' : v).replace(/\r/g, '').trim().slice(0, max);
}

export async function onRequest({ request, env }) {
  if (request.method !== 'POST') return json({ ok: false, error: 'method_not_allowed' }, 405, { allow: 'POST' });
  if (!env.RESEND_API_KEY) return json({ ok: false, error: 'not_configured' }, 503);

  // Same-origin only. Browsers always send Origin on cross-site POSTs.
  const origin = request.headers.get('origin');
  const host = request.headers.get('host');
  if (origin && new URL(origin).host !== host) return json({ ok: false, error: 'forbidden' }, 403);

  let data;
  try { data = await request.json(); } catch (_) { return json({ ok: false, error: 'bad_json' }, 400); }

  // Honeypot: the field is invisible to people; bots fill it.
  if (text(data.website, 10)) return json({ ok: true });

  const name = text(data.name, 120);
  const company = text(data.company, 160);
  const email = text(data.email, 200);
  const problem = text(data.problem, 5000);
  const attached = Array.isArray(data.attached) ? data.attached.slice(0, 3).map((s) => text(s, 600)).filter(Boolean) : [];

  if (!name || !company || !problem || !EMAIL.test(email)) return json({ ok: false, error: 'invalid' }, 400);

  const body =
    'Name: ' + name + '\nCompany: ' + company + '\nEmail: ' + email + '\n\n' + problem +
    (attached.length ? '\n\nAttached to this message:\n' + attached.map((a) => '- ' + a).join('\n') : '') +
    '\n\n--\nSent from the dfg.consulting contact form. Reply goes to ' + email + '.';

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: 'Bearer ' + env.RESEND_API_KEY, 'content-type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM || 'DFG website <website@dfg.consulting>',
      to: [env.CONTACT_TO || 'hello@dfg.consulting'],
      reply_to: email,
      subject: 'DFG: ' + company,
      text: body,
    }),
  });

  if (!r.ok) return json({ ok: false, error: 'send_failed' }, 502);
  return json({ ok: true });
}
