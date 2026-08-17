import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getUserById } from "@/lib/queries";
import { hasActiveAccess } from "@/lib/subscription";

export async function requireActiveUser() {
  const session = await getSession();
  if (!session) redirect("/login");

  const user = await getUserById(session.userId);
  if (!user) redirect("/api/auth/invalidate");

  if (!hasActiveAccess(user)) redirect("/dashboard/assinatura");

  return user;
}
