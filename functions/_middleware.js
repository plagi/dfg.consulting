/** Canonical host: send www.dfg.consulting to dfg.consulting, same path and query. */
export async function onRequest({ request, next }) {
  const url = new URL(request.url);
  if (url.hostname === 'www.dfg.consulting') {
    url.hostname = 'dfg.consulting';
    return Response.redirect(url.toString(), 301);
  }
  return next();
}
