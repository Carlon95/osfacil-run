"use client";

import { useActionState } from "react";
import { resetPassword } from "@/lib/actions/auth";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPassword, null);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <input type="hidden" name="token" value={token} />
      {state?.error && (
        <p className="rounded-lg bg-status-open-bg px-3 py-2 text-sm text-status-open">
          {state.error}
        </p>
      )}
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="password">
          Nova senha
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30"
          placeholder="Mínimo 8 caracteres"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-amber px-4 py-2.5 text-sm font-semibold text-ink hover:bg-amber-dark disabled:opacity-60"
      >
        {pending ? "Salvando…" : "Criar nova senha"}
      </button>
    </form>
  );
}
