"use client";

import { useActionState } from "react";
import Link from "next/link";
import { logIn } from "@/lib/actions/auth";

export function LoginForm() {
  const [state, formAction, pending] = useActionState(logIn, null);

  return (
    <form action={formAction} className="mt-8 space-y-4">
      {state?.error && (
        <p className="rounded-lg bg-status-open-bg px-3 py-2 text-sm text-status-open">
          {state.error}
        </p>
      )}
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
      <div>
        <div className="flex items-baseline justify-between">
          <label className="text-sm font-medium text-ink" htmlFor="password">
            Senha
          </label>
          <Link
            href="/esqueci-senha"
            className="text-xs font-medium text-ink-soft underline hover:text-ink"
          >
            Esqueceu a senha?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30"
          placeholder="••••••••"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-paper hover:bg-ink-soft disabled:opacity-60"
      >
        {pending ? "Entrando…" : "Entrar"}
      </button>
      <p className="text-center text-sm text-ink-soft">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-semibold text-ink underline">
          Criar conta grátis
        </Link>
      </p>
    </form>
  );
}
