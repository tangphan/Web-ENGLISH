import { getStore } from "@netlify/blobs";
import { createHash, randomBytes, randomInt, timingSafeEqual } from "node:crypto";

export const PRICE_VND = 2000;
export const PRODUCT_ID = "english-study-guide";
export const ORDER_TTL_MS = 30 * 60 * 1000;

export function ordersStore() {
  return getStore("sepay-document-orders");
}

export function jsonResponse(status, body) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export function getBearerToken(request) {
  const match = /^Bearer ([A-Za-z0-9_-]+)$/.exec(request.headers.get("authorization") || "");
  return match ? match[1] : "";
}

export function digestToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

export function tokensMatch(actualToken, expectedDigest) {
  if (!actualToken || !expectedDigest) return false;
  const actual = Buffer.from(digestToken(actualToken), "hex");
  const expected = Buffer.from(expectedDigest, "hex");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function validOrderId(orderId) {
  return /^TL\d{6}$/.test(orderId || "");
}

export function matchesApiKey(request, expectedKey) {
  const authorization = request.headers.get("authorization") || "";
  const match = /^Apikey\s+(.+)$/i.exec(authorization);
  if (!match || !expectedKey) return false;

  const actual = Buffer.from(match[1]);
  const expected = Buffer.from(expectedKey);
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export function createVietQrUrl(orderId) {
  const bankCode = process.env.SEPAY_BANK_CODE || "MB";
  const accountNumber = process.env.SEPAY_QR_ACCOUNT || process.env.SEPAY_ACCOUNT_NUMBER;
  if (!accountNumber) throw new Error("SEPAY_ACCOUNT_NUMBER is not configured.");

  const url = new URL("https://vietqr.app/img");
  url.searchParams.set("acc", accountNumber);
  url.searchParams.set("bank", bankCode);
  url.searchParams.set("amount", String(PRICE_VND));
  url.searchParams.set("des", orderId);
  return url.toString();
}

export async function createUniqueOrder(store, requestedOrderId) {
  const candidates = requestedOrderId ? [requestedOrderId] : Array.from(
    { length: 30 },
    () => `TL${randomInt(100000, 1000000)}`,
  );

  for (const orderId of candidates) {
    const pollToken = randomBytes(32).toString("base64url");
    const order = {
      productId: PRODUCT_ID,
      amount: PRICE_VND,
      tokenHash: digestToken(pollToken),
      status: "pending",
      createdAt: new Date().toISOString(),
      expiresAt: Date.now() + ORDER_TTL_MS,
    };
    const result = await store.set(orderId, JSON.stringify(order), { onlyIfNew: true });
    if (!result.modified) {
      if (requestedOrderId) return null;
      continue;
    }
    return { orderId, pollToken, order };
  }
  throw new Error("Could not allocate a unique order ID.");
}
