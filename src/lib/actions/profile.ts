"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { getSession } from "@/lib/auth";

export type ActionState = { error?: string } | null;

export async function updateProfession(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  if (!session) redirect("/login");

  const profession = formData.get("profession");
  const professionOther = formData.get("professionOther");

  const finalProfession =
    profession === "outro"
      ? (professionOther as string)?.trim() || null
      : (profession as string)?.trim() || null;

  if (!finalProfession) {
    return { error: "Selecione uma profissão" };
  }

  await db
    .update(users)
    .set({ profession: finalProfession })
    .where(eq(users.id, session.userId));

  revalidatePath("/dashboard/os/nova");
  return null;
}
