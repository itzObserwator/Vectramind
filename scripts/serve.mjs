import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { resolve, extname, sep } from "node:path";
import { brotliCompressSync, gzipSync, constants } from "node:zlib";

const root = resolve("out");
const portArgument = process.argv.find((argument) =>
  argument.startsWith("--port="),
);
const port = Number(process.env.PORT ?? portArgument?.slice(7) ?? 3000);
if (!Number.isInteger(port) || port < 0 || port > 65535) {
  throw new Error("The preview port must be an integer between 0 and 65535.");
}
const host = process.env.HOST || "127.0.0.1";
const encoded = new Map();
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".map": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".svg": "image/svg+xml",
  ".ttf": "font/ttf",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".xml": "application/xml; charset=utf-8",
};
const server = createServer(async (req, res) => {
  try {
    if (!["GET", "HEAD"].includes(req.method)) {
      res.writeHead(405, { Allow: "GET, HEAD" });
      res.end();
      return;
    }
    const pathname = decodeURIComponent(
      new URL(req.url, `http://${host}:${port}`).pathname,
    );
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(root + sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    let info = await stat(file);
    if (info.isDirectory()) {
      file = resolve(file, "index.html");
      info = await stat(file);
    }
    const extension = extname(file);
    const headers = {
      "Content-Type": types[extension] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Frame-Options": "SAMEORIGIN",
      ETag: `W/"${info.size.toString(16)}-${Math.trunc(info.mtimeMs).toString(16)}"`,
      "Cache-Control":
        pathname.startsWith("/_next/static/") || pathname.startsWith("/fonts/")
          ? "public, max-age=31536000, immutable"
          : /\.(html|txt|json)$/.test(extension)
            ? "no-cache"
            : "public, max-age=604800, stale-while-revalidate=86400",
    };
    if (req.headers["if-none-match"] === headers.ETag) {
      res.writeHead(304, headers);
      res.end();
      return;
    }
    // Byte ranges let the browser fetch MP4 metadata and start playback without
    // waiting for the entire file. Stream media instead of buffering it in RAM.
    if ([".mp4", ".webm"].includes(extension)) {
      headers["Accept-Ranges"] = "bytes";
      const range = req.headers.range?.match(/^bytes=(\d*)-(\d*)$/);
      let start = 0,
        end = info.size - 1;
      if (req.headers.range && !range) {
        res.writeHead(416, {
          ...headers,
          "Content-Range": `bytes */${info.size}`,
        });
        res.end();
        return;
      }
      if (range) {
        if (range[1]) {
          start = Number(range[1]);
          end = range[2] ? Math.min(Number(range[2]), end) : end;
        } else if (range[2]) start = Math.max(0, info.size - Number(range[2]));
        else {
          res.writeHead(416, {
            ...headers,
            "Content-Range": `bytes */${info.size}`,
          });
          res.end();
          return;
        }
        if (start > end || start >= info.size) {
          res.writeHead(416, {
            ...headers,
            "Content-Range": `bytes */${info.size}`,
          });
          res.end();
          return;
        }
        headers["Content-Range"] = `bytes ${start}-${end}/${info.size}`;
      }
      headers["Content-Length"] = end - start + 1;
      res.writeHead(range ? 206 : 200, headers);
      if (req.method === "HEAD") {
        res.end();
        return;
      }
      const stream = createReadStream(file, { start, end });
      stream.on("error", () => res.destroy());
      res.on("close", () => stream.destroy());
      stream.pipe(res);
      return;
    }
    let body = await readFile(file);
    if (
      /\.(html|js|css|json|map|txt|svg|xml)$/.test(extension) &&
      body.length > 1024
    ) {
      headers.Vary = "Accept-Encoding";
      const accept = req.headers["accept-encoding"] || "";
      const encoding = /\bbr\b/.test(accept)
        ? "br"
        : /\bgzip\b/.test(accept)
          ? "gzip"
          : null;
      if (encoding) {
        const key = `${file}:${info.mtimeMs}:${encoding}`;
        let compressed = encoded.get(key);
        if (!compressed) {
          compressed =
            encoding === "br"
              ? brotliCompressSync(body, {
                  params: { [constants.BROTLI_PARAM_QUALITY]: 4 },
                })
              : gzipSync(body);
          if (encoded.size > 150) encoded.clear();
          encoded.set(key, compressed);
        }
        body = compressed;
        headers["Content-Encoding"] = encoding;
      }
    }
    headers["Content-Length"] = body.length;
    res.writeHead(200, headers);
    res.end(req.method === "HEAD" ? undefined : body);
  } catch {
    if (res.headersSent) {
      res.destroy();
      return;
    }
    res.writeHead(404, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
    });
    res.end(
      req.method === "HEAD"
        ? undefined
        : await readFile(resolve(root, "404.html")).catch(() => "Not found"),
    );
  }
});
server.listen(port, host, () => {
  const actualPort = server.address().port;
  console.log(`Vectramind production preview: http://${host}:${actualPort}`);
  process.send?.({ type: "ready", port: actualPort });
});
