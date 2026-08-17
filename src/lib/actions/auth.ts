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

const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_MINUTES = 15;

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

  // Mensagem genérica em qualquer caso de falha, pra não revelar se o
  // e-mail existe ou não.
  const GENERIC_ERROR = "E-mail ou senha incorretos";

  if (!user) {
    return { error: GENERIC_ERROR };
  }

  if (user.lockedUntil && new Date(user.lockedUntil).getTime() > Date.now()) {
    const minutesLeft = Math.ceil(
      (new Date(user.lockedUntil).getTime() - Date.now()) / 60000
    );
    return {
      error: `Muitas tentativas erradas. Tente de novo em ${minutesLeft} minuto${minutesLeft === 1 ? "" : "s"}.`,
    };
  }

  const valid = await verifyPassword(password, user.passwordHash);

  if (!valid) {
    const attempts = user.failedLoginAttempts + 1;
    const shouldLock = attempts >= MAX_LOGIN_ATTEMPTS;

    await db
      .update(users)
      .set({
        failedLoginAttempts: attempts,
        lockedUntil: shouldLock
          ? new Date(Date.now() + LOCKOUT_MINUTES * 60 * 1000).toISOString()
          : null,
      })
      .where(eq(users.id, user.id));

    return {
      error: shouldLock
        ? `Muitas tentativas erradas. Tente de novo em ${LOCKOUT_MINUTES} minutos.`
        : GENERIC_ERROR,
    };
  }

  // Login certo: zera o contador de tentativas
  if (user.failedLoginAttempts > 0 || user.lockedUntil) {
    await db
      .update(users)
      .set({ failedLoginAttempts: 0, lockedUntil: null })
      .where(eq(users.id, user.id));
  }

  await createSessionCookie(user.id);
  redirect("/dashboard");
}

export async function logOut() {
  await clearSessionCookie();
  redirect("/login");
}
