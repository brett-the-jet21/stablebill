import { NextResponse } from "next/server";

// We already have the real route at /api/invoice-by-token/[token].
// This file provides a clean alias: /api/invoice/[token].
export async function GET(req: Request, { params }: { params: { token: string } }) {
  const url = new URL(req.url);
  const base = `${url.protocol}//${url.host}`;

  const upstream = await fetch(`${base}/api/invoice-by-token/${params.token}`, {
    // forward headers if needed later (auth, etc). For now simple passthrough.
    headers: req.headers,
    cache: "no-store"
  });

  const body = await upstream.text();
  return new NextResponse(body, {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" }
  });
}
