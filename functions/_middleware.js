/**
 * Canonical host. Everything that is not https://dfg.consulting (www, the *.pages.dev
 * project URL, preview deployments) is redirected there with the same path and query.
 */
const CANONICAL = "dfg.consulting";

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname !== CANONICAL || url.protocol !== "https:") {
    url.hostname = CANONICAL;
    url.protocol = "https:";
    return Response.redirect(url.toString(), 301);
  }
  const moved = {
    "/bank-onboarding": "/fintech-readiness",
    "/iso-27001": "/expertise/security-posture#scope",
    "/expertise/data-and-it": "/expertise/ai-strategy#data-readiness",
    "/expertise/incident-response":
      "/expertise/security-posture#incident-preparedness",
  };
  const path = url.pathname.replace(/\.html$/, "").replace(/\/$/, "");
  if (moved[path]) {
    const target = new URL(moved[path], url.origin);
    target.search = url.search;
    return Response.redirect(target.toString(), 301);
  }
  const response = await next();
  const type = response.headers.get("content-type") || "";
  if (!type.includes("text/html")) return response;

  /* Content Security Policy with a per-request nonce. Cloudflare reads the nonce from this
     header and applies it to the scripts it injects (bot detection, analytics beacon), so
     the policy can stay strict without 'unsafe-inline'. Our own scripts are external files. */
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  const nonce = btoa(String.fromCharCode(...bytes));
  const csp = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://static.cloudflareinsights.com`,
    "style-src 'self' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data:",
    "connect-src 'self' https://cloudflareinsights.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
  const out = new Response(response.body, response);
  out.headers.set("Content-Security-Policy", csp);
  return out;
}
