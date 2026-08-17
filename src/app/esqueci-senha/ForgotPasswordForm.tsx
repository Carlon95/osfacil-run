"use client";

import { useActionState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/actions/auth";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(
    requestPasswordReset,
    null
  );

  if (state?.error) {
    // Aqui "error" é sempre a mensagem genérica de sucesso/instrução —
    // ver comentário na action, é proposital não diferenciar.
    return (
      <div className="mt-8">
        <p className="rounded-lg bg-status-done-bg px-3 py-2 text-sm text-status-done">
          {state.error}
        </p>
        <p className="mt-6 text-center text-sm text-ink-soft">
          <Link href="/login" className="font-semibold text-ink underline">
            Voltar pro login
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="email">
          E-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30"
          placeholder="voce@exemplo.com"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-ink-soft disabled:opacity-60"
      >
        {pending ? "Enviando…" : "Enviar link de redefinição"}
      </button>
      <p className="text-center text-sm text-ink-soft">
        <Link href="/login" className="font-semibold text-ink underline">
          Voltar pro login
        </Link>
      </p>
    </form>
  );
}
