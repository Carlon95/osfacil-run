import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getStripe } from "@/lib/stripe";

function mapStripeStatus(status: Stripe.Subscription.Status): string {
  switch (status) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
    case "unpaid":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
      return "canceled";
    default:
      return "incomplete";
  }
}

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Webhook não configurado" },
      { status: 500 }
    );
  }

  const signature = req.headers.get("stripe-signature");
  const rawBody = await req.text();

  const stripe = getStripe();
  let event: Stripe.Event;

  try {
    if (!signature) throw new Error("Assinatura ausente");
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Assinatura inválida" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const checkoutSession = event.data.object as Stripe.Checkout.Session;
      const userId =
        checkoutSession.metadata?.userId ?? checkoutSession.client_reference_id;

      if (userId && typeof checkoutSession.customer === "string") {
        await db
          .update(users)
          .set({
            stripeCustomerId: checkoutSession.customer,
            stripeSubscriptionId:
              typeof checkoutSession.subscription === "string"
                ? checkoutSession.subscription
                : null,
            subscriptionStatus: "active",
          })
          .where(eq(users.id, userId));
      }
      break;
    }

    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const status = mapStripeStatus(subscription.status);
      const userId = subscription.metadata?.userId;

      if (userId) {
        await db
          .update(users)
          .set({ subscriptionStatus: status, stripeSubscriptionId: subscription.id })
          .where(eq(users.id, userId));
      } else if (typeof subscription.customer === "string") {
        await db
          .update(users)
          .set({ subscriptionStatus: status, stripeSubscriptionId: subscription.id })
          .where(eq(users.stripeCustomerId, subscription.customer));
      }
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
