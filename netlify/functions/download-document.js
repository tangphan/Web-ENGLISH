import { readFile } from "node:fs/promises";
import path from "node:path";
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
    if (order.status !== "paid" || order.amount !== 2000) {
      return jsonResponse(403, { error: "Payment has not been confirmed." });
    }

    const documentPath = path.join(process.cwd(), "documents", "english-study-guide.txt");
    const document = await readFile(documentPath);
    return new Response(document, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Content-Disposition": 'attachment; filename="cam-nang-hoc-tieng-Anh.txt"',
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Unable to download paid document:", error);
    return jsonResponse(500, { error: "Could not provide the document." });
  }
};
