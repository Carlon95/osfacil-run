"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUp } from "@/lib/actions/auth";
import { PROFESSIONS } from "@/lib/professions";

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, null);
  const [profession, setProfession] = useState("");

  return (
    <form action={formAction} className="mt-8 space-y-4">
      {state?.error && (
        <p className="rounded-lg bg-status-open-bg px-3 py-2 text-sm text-status-open">
          {state.error}
        </p>
      )}
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="name">
          Seu nome
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30"
          placeholder="Ex: João Pereira"
        />
      </div>
      <div>
        <label
          className="text-sm font-medium text-ink"
          htmlFor="businessName"
        >
          Nome do negócio{" "}
          <span className="font-normal text-ink-soft">(opcional)</span>
        </label>
        <input
          id="businessName"
          name="businessName"
          type="text"
          className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30"
          placeholder="Ex: Elétrica Pereira"
        />
      </div>
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
        <label className="text-sm font-medium text-ink" htmlFor="phone">
          Telefone/WhatsApp{" "}
          <span className="font-normal text-ink-soft">(opcional)</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30"
          placeholder="(11) 99999-9999"
        />
      </div>
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="profession">
          Sua profissão{" "}
          <span className="font-normal text-ink-soft">
            (opcional — usamos pra sugerir peças na hora de criar a OS)
          </span>
        </label>
        <select
          id="profession"
          name="profession"
          value={profession}
          onChange={(e) => setProfession(e.target.value)}
          className="mt-1 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30"
        >
          <option value="">Selecione…</option>
          {PROFESSIONS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        {profession === "outro" && (
          <input
            name="professionOther"
            className="mt-2 w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-ink outline-none transition-colors focus:border-ink focus:ring-2 focus:ring-amber/30"
            placeholder="Qual?"
          />
        )}
      </div>
      <div>
        <label className="text-sm font-medium text-ink" htmlFor="password">
          Senha
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
        {pending ? "Criando conta…" : "Criar conta grátis"}
      </button>
      <p className="text-center text-sm text-ink-soft">
        Já tem conta?{" "}
        <Link href="/login" className="font-semibold text-ink underline">
          Entrar
        </Link>
      </p>
    </form>
  );
}
