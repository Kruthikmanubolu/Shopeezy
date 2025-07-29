import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { updateOrderToPaid } from "@/lib/actions/order.actions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-06-30.basil", // ✅ correct version
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Stripe signature verification failed:", err);
    return NextResponse.json({ error: "Webhook Error" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderId = session.metadata?.orderId;
    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId in metadata" },
        { status: 400 }
      );
    }

    try {
      await updateOrderToPaid({
        orderId,
        paymentResult: {
          id: session.payment_intent as string,
          status: session.payment_status ?? "completed",
          email_address: session.customer_email!,
          price_Paid: ((session.amount_total ?? 0) / 100).toFixed(2), // 💰 Convert cents to dollars
        },
      });

      return NextResponse.json({ message: "Order updated successfully" });
    } catch (error) {
      console.error("Failed to update order:", error);
      return NextResponse.json(
        { error: "Order update failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Unhandled event type" });
}
