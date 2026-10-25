import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const root = resolve(process.argv[2] || "dist");
const port = Number(process.env.PORT || 3000);
const host = process.env.HOST || "0.0.0.0";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".wasm": "application/wasm",
  ".glb": "model/gltf-binary",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json"
};

async function resolveFile(pathname) {
  const target = resolve(root, "." + pathname);
  if (target !== root && !target.startsWith(root + sep)) return null;
  try {
    const info = await stat(target);
    if (info.isDirectory()) {
      const index = resolve(target, "index.html");
      const indexInfo = await stat(index);
      return indexInfo.isFile() ? index : null;
    }
    return info.isFile() ? target : null;
  } catch {
    return null;
  }
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", "http://localhost");
    if (url.pathname === "/healthz") {
      response.writeHead(200, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
      response.end(JSON.stringify({ ok: true }));
      return;
    }

    let pathname;
    try {
      pathname = decodeURIComponent(url.pathname);
    } catch {
      response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Bad request");
      return;
    }

    if (pathname === "/") pathname = "/index.html";
    let file = await resolveFile(pathname);

    if (!file && !extname(pathname)) file = await resolveFile("/index.html");
    if (!file) {
      response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      response.end("Not found");
      return;
    }

    const extension = extname(file).toLowerCase();
    response.writeHead(200, {
      "Content-Type": types[extension] || "application/octet-stream",
      "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=60",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin"
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    const stream = createReadStream(file);
    stream.on("error", () => response.destroy());
    stream.pipe(response);
  } catch (error) {
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Internal server error");
    console.error(error);
  }
});

server.on("error", (error) => {
  console.error("Server error:", error.message);
  process.exitCode = 1;
});

server.listen(port, host, () => {
  console.log(`Serving ${root} at http://${host}:${port}`);
});

function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(0), 4000).unref();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
