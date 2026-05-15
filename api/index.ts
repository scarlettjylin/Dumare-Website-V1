// Vercel Node.js Serverless Function — SSR entry point.
// All non-asset requests are rewritten here by vercel.json.
// dist/server/** is included at runtime via vercel.json "includeFiles".

import type { IncomingMessage, ServerResponse } from "node:http";

let _app: { fetch: (req: Request) => Promise<Response> } | null = null;

async function getApp() {
  if (!_app) {
    // Dynamic import with a computed URL so TypeScript does not try to
    // resolve '../dist/server/server.js' at compile time (it won't exist
    // until after `npm run build` runs on Vercel).
    const serverUrl = new URL("../dist/server/server.js", import.meta.url);
    // @ts-ignore — module exists at runtime after the build step
    const mod = await import(serverUrl.href);
    _app = mod.default;
  }
  return _app!;
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  const app = await getApp();

  const proto = (req.headers["x-forwarded-proto"] as string) ?? "https";
  const host = (req.headers["x-forwarded-host"] as string) ?? req.headers.host;
  const url = new URL(req.url!, `${proto}://${host}`);

  const init: RequestInit = { method: req.method, headers: req.headers as HeadersInit };

  if (req.method !== "GET" && req.method !== "HEAD") {
    const chunks: Buffer[] = [];
    for await (const chunk of req) chunks.push(chunk as Buffer);
    init.body = Buffer.concat(chunks);
  }

  const response = await app.fetch(new Request(url.toString(), init));

  res.statusCode = response.status;
  response.headers.forEach((v, k) => res.setHeader(k, v));
  res.end(Buffer.from(await response.arrayBuffer()));
}
