// Local preview with clean URLs and the same legacy-path middleware as production.
const http = require("node:http");
const fs = require("node:fs/promises");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css",
  ".js": "text/javascript",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};
async function createPreview(port = 8080) {
  const source = await fs.readFile(
    path.join(root, "functions/_middleware.js"),
    "utf8",
  );
  const { onRequest } = await import(
    "data:text/javascript;base64," + Buffer.from(source).toString("base64")
  );
  const server = http.createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      if (req.method !== "GET" && req.method !== "HEAD") {
        res.writeHead(503, { "Content-Type": "application/json" });
        res.end('{"ok":false,"error":"local_preview"}');
        return;
      }
      const redirect = await onRequest({
        request: new Request("https://dfg.consulting" + req.url),
        next: () => null,
      });
      if (redirect) {
        const to = new URL(redirect.headers.get("location"));
        res.writeHead(redirect.status, {
          Location: to.pathname + to.search + to.hash,
        });
        res.end();
        return;
      }
      let pathname = decodeURIComponent(url.pathname);
      if (pathname === "/") pathname = "/index.html";
      else if (!path.extname(pathname))
        pathname = pathname.replace(/\/$/, "") + ".html";
      const target = path.resolve(root, "." + pathname);
      if (
        !target.startsWith(root + path.sep) ||
        pathname.split("/").some((x) => x.startsWith(".")) ||
        !types[path.extname(target)]
      ) {
        res.writeHead(404);
        res.end();
        return;
      }
      let content;
      try {
        content = await fs.readFile(target);
      } catch {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end(await fs.readFile(path.join(root, "404.html")));
        return;
      }
      res.writeHead(200, {
        "Content-Type": types[path.extname(target)],
        "Cache-Control": "no-store",
      });
      res.end(req.method === "HEAD" ? undefined : content);
    } catch {
      res.writeHead(400);
      res.end("Invalid request");
    }
  });
  await new Promise((resolve) => server.listen(port, "127.0.0.1", resolve));
  return server;
}
if (require.main === module)
  createPreview(Number(process.env.PORT || 8080)).then((server) =>
    console.log("Preview: http://127.0.0.1:" + server.address().port),
  );
module.exports = { createPreview };
