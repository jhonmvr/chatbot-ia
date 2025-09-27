import crypto from "crypto";

export function verifyMetaSignature({ appSecret, signature, payload }: { appSecret: string; signature?: string | null; payload: string; }) {
  if (!signature) return false;
  const hmac = crypto.createHmac("sha256", appSecret).update(payload).digest("hex");
  return signature.replace("sha256=", "") === hmac;
}
