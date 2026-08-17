"use server";

import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { signUpSchema, logInSchema } from "@/lib/validators";
import { trialEndDate } from "@/lib/subscription";
import {
  createSessionCookie,
  clearSessionCookie,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";

export type ActionState = { error?: string } | null;

export async function signUp(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    businessName: formData.get("businessName") || undefined,
    email: formData.get("email"),
    phone: formData.get("phone") || undefined,
    profession: formData.get("profession") || undefined,
    professionOther: formData.get("professionOther") || undefined,
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { name, businessName, email, phone, profession, professionOther, password } =
    parsed.data;

  const finalProfession =
    profession === "outro" ? professionOther || null : profession || null;

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .get();

  if (existing) {
    return { error: "Já existe uma conta com esse e-mail" };
  }

  const passwordHash = await hashPassword(password);

  const [created] = await db
    .insert(users)
    .values({
      name,
      businessName: businessName || null,
      email: email.toLowerCase(),
      phone: phone || null,
      profession: finalProfession,
      passwordHash,
      trialEndsAt: trialEndDate().toISOString(),
    })
    .returning({ id: users.id });

  await createSessionCookie(created.id);
  redirect("/dashboard");
}

export async function logIn(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = logInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const { email, password } = parsed.data;

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email.toLowerCase()))
    .get();

  if (!user) {
    return { error: "E-mail ou senha incorretos" };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "E-mail ou senha incorretos" };
  }

  await createSessionCookie(user.id);
  redirect("/dashboard");
}

export async function logOut() {
  await clearSessionCookie();
  redirect("/login");
}
