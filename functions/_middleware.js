/**
 * Canonical host. Everything that is not https://dfg.consulting (www, the *.pages.dev
 * project URL, preview deployments) is redirected there with the same path and query.
 */
const CANONICAL = 'dfg.consulting';

export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname !== CANONICAL || url.protocol !== 'https:') {
    url.hostname = CANONICAL;
    url.protocol = 'https:';
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
