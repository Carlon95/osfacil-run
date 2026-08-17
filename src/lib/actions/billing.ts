"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";
import { getStripe } from "@/lib/stripe";

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export async function createCheckoutSession() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .get();
  if (!user) redirect("/login");

  const priceId = process.env.STRIPE_PRICE_ID;
  if (!priceId) {
    throw new Error(
      "STRIPE_PRICE_ID não configurado. Veja STRIPE.md para configurar."
    );
  }

  const stripe = getStripe();

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: user.stripeCustomerId ?? undefined,
    customer_email: user.stripeCustomerId ? undefined : user.email,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${getAppUrl()}/dashboard/assinatura?status=sucesso`,
    cancel_url: `${getAppUrl()}/dashboard/assinatura?status=cancelado`,
    client_reference_id: user.id,
    metadata: { userId: user.id },
    subscription_data: { metadata: { userId: user.id } },
  });

  if (!checkoutSession.url) {
    throw new Error("Não foi possível criar a sessão de checkout");
  }

  redirect(checkoutSession.url);
}

export async function createPortalSession() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId))
    .get();

  if (!user?.stripeCustomerId) redirect("/dashboard/assinatura");

  const stripe = getStripe();

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${getAppUrl()}/dashboard/assinatura`,
  });

  redirect(portalSession.url);
}
