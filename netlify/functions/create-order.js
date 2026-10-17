import {
  createUniqueOrder,
  createVietQrUrl,
  jsonResponse,
  ordersStore,
  validOrderId,
} from "../lib/orders.js";

export default async request => {
  if (request.method !== "POST") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  try {
    let payload;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse(400, { error: "Invalid JSON payload." });
    }

    const requestedOrderId = payload?.orderId;
    if (!validOrderId(requestedOrderId)) {
      return jsonResponse(400, { error: "Invalid order ID." });
    }
    if (!process.env.SEPAY_ACCOUNT_NUMBER) {
      return jsonResponse(503, { error: "SePay bank account is not configured." });
    }

    const store = ordersStore();
    const createdOrder = await createUniqueOrder(store, requestedOrderId);
    if (!createdOrder) {
      return jsonResponse(409, { error: "Order ID already exists." });
    }
    const { orderId, pollToken } = createdOrder;
    return jsonResponse(201, {
      orderId,
      pollToken,
      amount: 2000,
      qrUrl: createVietQrUrl(orderId),
    });
  } catch (error) {
    console.error("Unable to create SePay order:", error);
    return jsonResponse(500, { error: "Could not create a payment order." });
  }
};
