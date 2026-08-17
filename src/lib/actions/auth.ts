"use server";

import { redirect } from "next/navigation";
import { randomBytes } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import {
  signUpSchema,
  logInSchema,
  requestPasswordResetSchema,
  resetPasswordSchema,
} from "@/lib/validators";
import { trialEndDate } from "@/lib/subscription";
import { sendPasswordResetEmail } from "@/lib/email";
import {
  createSessionCookie,
  clearSessionCookie,
  hashPassword,
  verifyPassword,
} from "@/lib/auth";

const RESET_TOKEN_HOURS = 1;
const RESET_COOLDOWN_SECONDS = 60;

function getAppUrl() {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

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

export async function requestPasswordReset(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = requestPasswordResetSchema.safeParse({
    email: formData.get("email"),
  });

  // Mensagem sempre genérica (mesmo em erro de validação simples), pra
  // não revelar se um e-mail está cadastrado ou não.
  const GENERIC_MESSAGE =
    "Se esse e-mail estiver cadastrado, você vai receber um link pra redefinir a senha em instantes.";

  if (!parsed.success) {
    return { error: GENERIC_MESSAGE };
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, parsed.data.email.toLowerCase()))
    .get();

  if (user) {
    // Evita reenviar em sequência (spam do próprio botão, ou abuso)
    const recentlyRequested =
      user.resetTokenExpiresAt &&
      new Date(user.resetTokenExpiresAt).getTime() - Date.now() >
        (RESET_TOKEN_HOURS * 3600 - RESET_COOLDOWN_SECONDS) * 1000;

    if (!recentlyRequested) {
      const token = randomBytes(32).toString("hex");
      const expiresAt = new Date(Date.now() + RESET_TOKEN_HOURS * 3600 * 1000);

      await db
        .update(users)
        .set({
          resetToken: token,
          resetTokenExpiresAt: expiresAt.toISOString(),
        })
        .where(eq(users.id, user.id));

      const resetUrl = `${getAppUrl()}/redefinir-senha?token=${token}`;

      try {
        await sendPasswordResetEmail(user.email, resetUrl);
      } catch (err) {
        console.error("Falha ao enviar e-mail de redefinição:", err);
        // Não revela o erro pro usuário — evita expor detalhes internos
        // e também evita confirmar se o e-mail existe.
      }
    }
  }

  return { error: GENERIC_MESSAGE };
}

export async function resetPassword(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const user = await db
    .select()
    .from(users)
    .where(eq(users.resetToken, parsed.data.token))
    .get();

  if (
    !user ||
    !user.resetTokenExpiresAt ||
    new Date(user.resetTokenExpiresAt).getTime() < Date.now()
  ) {
    return {
      error: "Link inválido ou expirado. Peça uma nova redefinição de senha.",
    };
  }

  const passwordHash = await hashPassword(parsed.data.password);

  await db
    .update(users)
    .set({
      passwordHash,
      resetToken: null,
      resetTokenExpiresAt: null,
      failedLoginAttempts: 0,
      lockedUntil: null,
    })
    .where(eq(users.id, user.id));

  redirect("/login?redefinida=1");
}
