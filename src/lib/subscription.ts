export const TRIAL_DAYS = 7;
export const PLAN_PRICE_LABEL = "R$ 39,90/mês";
export const PLAN_NAME = "Plano Profissional";

export function trialEndDate(from: Date = new Date()) {
  const end = new Date(from);
  end.setDate(end.getDate() + TRIAL_DAYS);
  return end;
}

type SubscriptionUser = {
  subscriptionStatus: string;
  trialEndsAt: string | null;
};

export function isTrialing(user: SubscriptionUser) {
  return (
    user.subscriptionStatus === "trialing" &&
    user.trialEndsAt !== null &&
    new Date(user.trialEndsAt).getTime() > Date.now()
  );
}

export function hasActiveAccess(user: SubscriptionUser) {
  if (user.subscriptionStatus === "active") return true;
  return isTrialing(user);
}

export function trialDaysLeft(user: SubscriptionUser) {
  if (user.trialEndsAt === null) return 0;
  const diffMs = new Date(user.trialEndsAt).getTime() - Date.now();
  return Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
}
