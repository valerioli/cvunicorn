import { createHmac, timingSafeEqual } from "crypto";

/** HMAC-signed access tokens — lets confirmation/receipt/account links work
 *  without accounts or sessions. Token = orderId.expiry.signature */

function secret(): string {
  return process.env.ACCESS_TOKEN_SECRET || "dev-secret-change-in-production";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createAccessToken(orderId: string, ttlSeconds = 60 * 60 * 24 * 400): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${orderId}.${exp}`;
  return `${payload}.${sign(payload)}`;
}

export function verifyAccessToken(token: string): { orderId: string } | null {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [orderId, expStr, sig] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return null;
  const expected = sign(`${orderId}.${expStr}`);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  return { orderId };
}
