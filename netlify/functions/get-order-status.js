import {
  getBearerToken,
  jsonResponse,
  ordersStore,
  tokensMatch,
  validOrderId,
} from "../lib/orders.js";

export default async request => {
  if (request.method !== "GET") {
    return jsonResponse(405, { error: "Method not allowed." });
  }

  const orderId = new URL(request.url).searchParams.get("orderId");
  if (!validOrderId(orderId)) {
    return jsonResponse(400, { error: "Invalid order ID." });
  }

  try {
    const order = await ordersStore().get(orderId, { type: "json" });
    if (!order || !tokensMatch(getBearerToken(request), order.tokenHash)) {
      return jsonResponse(404, { error: "Order not found." });
    }

    if (order.status === "pending" && order.expiresAt < Date.now()) {
      return jsonResponse(200, { status: "expired" });
    }
    return jsonResponse(200, { status: order.status, amount: order.amount });
  } catch (error) {
    console.error("Unable to read SePay order status:", error);
    return jsonResponse(500, { error: "Could not read order status." });
  }
};
