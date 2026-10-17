import {
  jsonResponse,
  matchesApiKey,
  ordersStore,
  validOrderId,
} from "../lib/orders.js";

export default async request => {
  if (request.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  const webhookKey = process.env.SEPAY_WEBHOOK_API_KEY;
  if (!webhookKey) {
    console.error("SEPAY_WEBHOOK_API_KEY is not configured.");
    return jsonResponse(503, { error: "Webhook authentication is not configured." });
  }
  if (!matchesApiKey(request, webhookKey)) {
    return jsonResponse(401, { error: "Unauthorized." });
  }
  if (!process.env.SEPAY_ACCOUNT_NUMBER) {
    console.error("SEPAY_ACCOUNT_NUMBER is not configured.");
    return jsonResponse(503, { error: "Webhook account validation is not configured." });
  }

  let transaction;
  try {
    transaction = await request.json();
  } catch {
    return jsonResponse(400, { error: "Invalid JSON payload." });
  }
  if (!transaction || typeof transaction !== "object" || Array.isArray(transaction)) {
    return jsonResponse(400, { error: "Invalid transaction payload." });
  }

  const content = String(transaction.content ?? transaction.transaction_content ?? "");
  const orderId = content.toUpperCase().match(/\bTL\d{6}\b/)?.[0];
  const transferAmount = Number(transaction.transferAmount ?? transaction.amount_in ?? 0);
  const transferType = String(transaction.transferType ?? transaction.transfer_type ?? "").toUpperCase();
  const accountNumber = String(transaction.accountNumber ?? transaction.account_number ?? "");
  const expectedAccount = process.env.SEPAY_QR_ACCOUNT || process.env.SEPAY_ACCOUNT_NUMBER || "";

  if (transferType !== "IN"
      || !Number.isFinite(transferAmount)
      || transferAmount < 2000
      || !validOrderId(orderId)
      || accountNumber !== expectedAccount) {
    return jsonResponse(200, { success: true, matched: false });
  }

  try {
    const store = ordersStore();
    const order = await store.get(orderId, { type: "json" });
    if (!order
        || order.status !== "pending"
        || order.productId !== "english-study-guide"
        || order.amount !== 2000
        || order.expiresAt < Date.now()) {
      return jsonResponse(200, { success: true, matched: false });
    }

    order.status = "paid";
    order.paidAt = new Date().toISOString();
    order.transactionId = String(transaction.id ?? transaction.referenceCode ?? "");
    order.paidAmount = transferAmount;
    await store.setJSON(orderId, order);
    return jsonResponse(200, { success: true, matched: true });
  } catch (error) {
    console.error("Unable to process SePay webhook:", error);
    return jsonResponse(500, { success: false });
  }
};
