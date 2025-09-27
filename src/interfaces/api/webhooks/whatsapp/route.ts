import { NextRequest, NextResponse } from "next/server";
import { verifyMetaSignature } from "../../../../infrastructure/whatsapp/verifySignature";
import { handleIncomingMessage } from "../../../../application/whatsapp/handleIncomingMessage";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const mode = url.searchParams.get("hub.mode");
  const token = url.searchParams.get("hub.verify_token");
  const challenge = url.searchParams.get("hub.challenge");
  if (mode === "subscribe" && token === process.env.META_VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return new Response("forbidden", { status: 403 });
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  const signature = req.headers.get("x-hub-signature-256");
  const ok = verifyMetaSignature({ appSecret: process.env.META_APP_SECRET!, signature, payload: raw });
  if (!ok) return NextResponse.json({ error: "invalid signature" }, { status: 401 });

  const body = JSON.parse(raw);
  const entry = body.entry?.[0];
  const changes = entry?.changes?.[0];
  const msg = changes?.value?.messages?.[0];

  if (msg?.type === "text") {
    const from = msg.from;
    const text = msg.text.body;
    await handleIncomingMessage({ from, text });
  }

  return NextResponse.json({ status: "ok" });
}
