import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { deliverKeys, releaseKeys } from "@/lib/keys";
import { paymentClient } from "@/lib/mercadopago";
import crypto from "crypto";

/**
 * Valida a assinatura HMAC-SHA256 do webhook do Mercado Pago.
 * Docs: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 */
function verifyWebhookSignature(
  xSignature: string | null,
  xRequestId: string | null,
  dataId: string,
  secret: string
): boolean {
  if (!xSignature || !xRequestId || !secret) return false;

  // Parse x-signature header: "ts=xxx,v1=xxx"
  const parts: Record<string, string> = {};
  xSignature.split(",").forEach((part) => {
    const [key, value] = part.trim().split("=");
    if (key && value) parts[key] = value;
  });

  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;

  // Build the manifest string
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;

  // Generate HMAC-SHA256
  const hmac = crypto
    .createHmac("sha256", secret)
    .update(manifest)
    .digest("hex");

  return hmac === v1;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // MP sends different notification types
    if (body.type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) {
      return new NextResponse("Missing payment ID", { status: 400 });
    }

    // Validate webhook signature if secret is configured
    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
    if (webhookSecret) {
      const xSignature = request.headers.get("x-signature");
      const xRequestId = request.headers.get("x-request-id");

      const isValid = verifyWebhookSignature(
        xSignature,
        xRequestId,
        String(paymentId),
        webhookSecret
      );

      if (!isValid) {
        console.error("[WEBHOOK_MERCADOPAGO] Invalid signature");
        return new NextResponse("Invalid signature", { status: 401 });
      }
    }

    // Fetch payment details from MP
    const payment = await paymentClient.get({ id: paymentId });

    const orderId = payment.external_reference;
    if (!orderId) {
      return new NextResponse("Missing external_reference", { status: 400 });
    }

    // Idempotency: check if already processed
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    if (order.status === "DELIVERED") {
      return NextResponse.json({ received: true, message: "Already delivered" });
    }

    const paymentStatus = payment.status;

    console.log(
      `[WEBHOOK_MERCADOPAGO] Payment ${paymentId} → status: ${paymentStatus}, order: ${orderId}`
    );

    if (paymentStatus === "approved") {
      // Update order with payment info
      await prisma.order.update({
        where: { id: orderId },
        data: {
          status: "PAID",
          mpPaymentId: String(paymentId),
          paymentMethod: payment.payment_type_id ?? null,
        },
      });

      // Deliver keys
      await deliverKeys(orderId);

      console.log(`[WEBHOOK_MERCADOPAGO] ✅ Keys delivered for order ${orderId}`);
      // TODO: Send email with keys via Resend
    } else if (
      paymentStatus === "rejected" ||
      paymentStatus === "cancelled"
    ) {
      // Release reserved keys
      await releaseKeys(orderId);
      console.log(`[WEBHOOK_MERCADOPAGO] ❌ Keys released for order ${orderId} (${paymentStatus})`);
    }
    // For "pending" or "in_process", do nothing — wait for next webhook

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[WEBHOOK_MERCADOPAGO]", error);
    return new NextResponse("Webhook processing failed", { status: 500 });
  }
}
