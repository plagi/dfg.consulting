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
  return next();
}
