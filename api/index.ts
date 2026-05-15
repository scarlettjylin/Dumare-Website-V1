// Vercel Edge Function — entry point for SSR.
// All non-asset requests are rewritten here by vercel.json.
// Vercel's Edge Runtime uses the same Web Fetch API as Cloudflare Workers,
// so src/server.ts (which exports a { fetch } handler) works as-is.

export const config = {
  runtime: "edge",
};

// The server bundle is built to dist/server/index.js by `npm run build`.
// Vercel runs the buildCommand first, so this import is always resolvable.
import app from "../dist/server/index.js";

export default function handler(request: Request): Promise<Response> {
  return app.fetch(request);
}
